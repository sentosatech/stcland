import { CellValue, Row, RowValues, Worksheet } from 'exceljs'
import { isNil, isNotNil, } from 'ramda'
// import { notEqual } from 'ramda-adjunct'

import { toJson } from '@stcland/utils'

import type {
  ParseOptions, ParseWorksheet,
  ParseFrontMatter,   ParseFrontMatterResult,
  ParseDataLayout, ParseDataTable, ParseDataCollection,
  ParseDataTableResult, ParseDataCollectionResult, ParsedWorksheetResult,
  RowMeta, DataCellMeta, Meta, MetaTypeMap,
  Data, DataTableData,
  DataType,  DataTableDataType, // DataTypeMap,
  DelimiterActions,
  DataCollectionData,
} from './SpreadsheetParserTypes'

import {
  validDataLayouts,
} from './SpreadsheetParserTypes'

import {
  cellValueToDate, cellValueToBool, cellValueToString, cellValueToNumber,
  cellValueToPasswordHash, cellValueFromJson, cellValueToUuid,
  getPropNameFromCallValue, getDataTypeFromCallValue,
  getRowValues, getPropNamesFromRow, getDataTypesFromRow,
  dataCellWarning, parserWarning, cellValueHasError, getCellError, rowWarning,
  isEmptyCell, colNumToText, doesNotHaveFrontMatter,
  isNotValidDataTableDataType, isRowValueListType,
  shouldSkipDataCollectionRow,
  shouldSkipDataTableValue, getBaseDataType, rowIsDelimiter
} from './spreadsheetParseUtils'


//-----------------------------------------------------------------------------

export const parseWorksheet: ParseWorksheet = (
  ws, parseOpts = {}, startingRowNum = 1
) => {

  const { reportProgress = true } = parseOpts || {}

  const worksheetName = ws.name
  if (reportProgress) console.log(`... Parsing worksheet '${worksheetName}'`)

  let meta: Meta | undefined = undefined
  let metaTypeMap: MetaTypeMap | undefined = undefined
  let parsedData: ParseDataCollectionResult | ParseDataTableResult | undefined

  let nextRowNum = startingRowNum

  const dataLayoutResult = parseDataLayout(ws, nextRowNum, parseOpts)
  const { dataLayout } = dataLayoutResult

  nextRowNum = dataLayoutResult.nextRowNum

  // any data format may start with front matter
  const frontMatterResult = parseFrontMatter(ws, nextRowNum, parseOpts)

  meta = frontMatterResult?.meta
  metaTypeMap = frontMatterResult?.metaTypeMap

  nextRowNum = frontMatterResult.nextRowNum

  switch (dataLayout) {
  case 'dataTable':
    parsedData = parseDataTable(ws, nextRowNum, {
      ...parseOpts, onDelimiter: 'stop'
    })
    break
  case 'dataCollection':
    parsedData = parseDataCollection(ws, nextRowNum, {
      ...parseOpts, onDelimiter: 'continue'
    })
    break
  case 'frontMatterOnly':
    break // ok to have no data,
  default:
    throw new Error(
      `WS: ${worksheetName}: Invalid dataLayout '${dataLayout}'\n` +
      `  Expected one of ${toJson(validDataLayouts)}`
    )
  }

  const result: ParsedWorksheetResult = {
    worksheetName,
    dataLayout,
    numDataEntriesParsed: parsedData?.numDataEntriesParsed || 0, // TODO: changet this to num dta entryes parsed
    meta,
    metaTypeMap,
    data: parsedData?.data,
    dataTypeMap: parsedData?.dataTypeMap,
  }

  return result
}

//-----------------------------------------------------------------------------

const parseDataTable: ParseDataTable = (
  ws: Worksheet,
  startingRowNum: number,
  parseOpts?: ParseOptions
) => {

  const worksheetName = ws.name

  const propNames = getPropNamesFromRow(ws.getRow(startingRowNum))
  const dataTypes = getDataTypesFromRow(ws.getRow(startingRowNum+1))

  if (propNames.length !== dataTypes.length) {
    parserWarning(
      `WS: ${worksheetName}: Number of property names does not match number of property types (skipping)\n` +
      `  property names: ${toJson(propNames)}\n` +
      `  property types: ${toJson(dataTypes)}`,
      parseOpts
    )
    return { numDataEntriesParsed: 0, data: [], dataTypeMap: {} }
  }

  let stopParsing = false

  // default to stop parsing for table data when we hit a delimiter row
  const onDelimiter: DelimiterActions = parseOpts?.onDelimiter || 'stop'

  const data: DataTableData = []
  ws.eachRow((curRow, curRowNumber) => {

    if (stopParsing) return


    // skip propName and dataType rows
    if (curRowNumber < startingRowNum+2 ) return

    // keep an eye out for delimeter row
    if (rowIsDelimiter(curRow) && onDelimiter === 'stop') {
      stopParsing = true
      return false
    }

    const rowMeta: RowMeta = {
      worksheetName: ws.name, rowNumber: curRowNumber
    }

    const rowData = parseTableDataRow(propNames, dataTypes, curRow, rowMeta, parseOpts)
    data.push(rowData)
  })

  const dataTypeMap = propNames.reduce((acc, propName, i) => {
    return { ...acc, [propName]: dataTypes[i] }
  }, {})

  return { numDataEntriesParsed: data.length, data, dataTypeMap }
}

//-----------------------------------------------------------------------------

const parseTableDataRow = (
  propNames: string[],
  dataTypes: DataType[],
  row: Row,
  rowMeta: RowMeta,
  parseOpts?: ParseOptions
): Data => {

  const propValues = getRowValues(row)
  const data = propNames.reduce((accData, propName, colNumber) => {

    const dataType = dataTypes[colNumber] as DataTableDataType
    const propValue = propValues[colNumber]

    const dataCellMeta = {
      ...rowMeta, colNumber, propName, dataType
    }

    if (isNotValidDataTableDataType(dataType)) {
      const propTypeIsList = isRowValueListType(dataType)
      const warning =
        `Invalid data type for table data: '${dataType}'` +
        `${propTypeIsList ? ', row data lists not valid for table data' : ''}`

      return {
        ...accData, [propName]: propTypeIsList
          ? [dataCellWarning(warning, dataCellMeta, parseOpts) ]
          : dataCellWarning(warning, dataCellMeta, parseOpts)
      }
    }

    if (shouldSkipDataTableValue(propValue))
      return accData

    const dataValue = parseDataCell(dataType, propValue, dataCellMeta, parseOpts)

    return {
      ...accData, [propName]: dataValue
    }
  }, {})

  return data
}

//-----------------------------------------------------------------------------

export const parseDataCollection: ParseDataCollection = (
  ws, startingRowNum, parseOpts
) => {

  const worksheetName = ws.name

  const data: DataCollectionData = []
  // let firstEntryDataTypeMap: DataTypeMap = {}
  // const curDataTypeMap: DataTypeMap = {}

  let stopParsing = false

  // default to continue parsing for collection data when we hit a delimiter row
  const onDelimiter: DelimiterActions = parseOpts?.onDelimiter || 'continue'

  let nextRowNum = 1
  let curDataEntry: Data = {}

  // const curEntryIsFirst = (data: DataCollectionData) => data.length === 0
  // const curEntryIsNotFirst = (data: DataCollectionData) => data.length > 1

  ws.eachRow((curRow, curRowNumber) => {

    if (stopParsing) return

    nextRowNum++

    // Get to our starting row
    if (curRowNumber < startingRowNum) return

    const rowMeta: RowMeta = {
      worksheetName: ws.name,
      rowNumber: curRowNumber
    }

    // at end of current entry
    if (rowIsDelimiter(curRow)) {

      // Data type consistency check
      // if (curEntryIsNotFirst(data)) {

      //   if (notEqual(firstEntryDataTypeMap, curDataTypeMap)) {
      //     console.log('firstEntryDataTypeMap: ', firstEntryDataTypeMap)
      //     console.log('curDataTypeMap: ', curDataTypeMap)
      //     const warningMsg = rowWarning(
      //       'Data type inconsistency in data collection\n' +
      //       `  First entry had types: ${toJson(firstEntryDataTypeMap)}\n` +
      //       `  Followon entry has types: ${toJson(curDataTypeMap)}\n` +
      //       '  Types from first entry will be returned',
      //       rowMeta, parseOpts
      //     )
      //     if (!firstEntryDataTypeMap?.typeWarning)
      //       firstEntryDataTypeMap.typeWarning = warningMsg as DataType
      //   }
      // }

      // Lets push the current entry to the data list, and and get ready for the next
      data.push(curDataEntry)
      curDataEntry = {}

      if (onDelimiter  === 'stop') stopParsing = true
      return
    }

    const rowValues = getRowValues(curRow)

    const propName = getPropNameFromCallValue(rowValues[0], {
      ...rowMeta, colNumber: 0
    })

    const dataType = getDataTypeFromCallValue(rowValues[1], {
      ...rowMeta, colNumber: 1
    })

    let propValue: any

    // are we delaing with a list of row values?
    if (isRowValueListType(dataType)) {

      // TODO: use row warning
      if (rowValues.length < 3) {
        parserWarning(
          `WS: ${worksheetName}: Invalid Data List row value list ${curRowNumber}\n` +
          `  Expected 3+ cells [propName, dataType, ...propValueList], found ${rowValues.length}\n` +
          `  ${toJson(rowValues)}`
        )}

      propValue = parseRowValueList(
        propName, dataType, rowValues.slice(2), rowMeta, parseOpts
      )
    }

    // nomral propName, dataType, propValue row
    else {

      if (rowValues.length !== 3) {
        parserWarning(
          `WS: ${worksheetName}: Invalid Data List property row ${curRowNumber}\n` +
        `  Expected 3 cells [propName, dataType, propValue], found ${rowValues.length}\n` +
        `  ${toJson(rowValues)}`
        )}

      if (shouldSkipDataCollectionRow(rowValues)) return // TODO: hmmmmm, make sure this is OK

      propValue = parseDataCell(
        dataType, rowValues[2], { ...rowMeta, colNumber: 2, propName, dataType }, parseOpts
      )
    }

    curDataEntry = { ...curDataEntry, [propName]: propValue }
  //   if (curEntryIsFirst(data))
  //     firstEntryDataTypeMap = { ...(firstEntryDataTypeMap), [propName]: dataType }
  })

  console.log('data: ', data)

  const result: ParseDataCollectionResult = {
    data,
    dataTypeMap: {}, // firstEntryDataTypeMap, // TEMP
    numDataEntriesParsed: data ? data.length : 0,
    nextRowNum
  }

  return result
}

//-----------------------------------------------------------------------------

export const parseRowValueList = (
  propName: string,
  dataType: DataType,
  rowValuesList: RowValues,
  rowMeta: RowMeta,
  parseOpts?: ParseOptions
): any[]  => {

  const dataCellMeta: DataCellMeta = {
    ...rowMeta, dataType, propName, colNumber: 1,
  }
  if (isNil(rowValuesList))
    return [dataCellWarning('Row value list is undefined', dataCellMeta, parseOpts)]

  const baseDataType = getBaseDataType(dataType)
  if (baseDataType === 'invalid-data-type') return [
    dataCellWarning(
      `Invalid data type for row value list: '${dataType}'`,
      dataCellMeta, parseOpts
    )]

  // loop through the rowValuesList and parse each cell
  const cleanRowValues = (rowValuesList as CellValue[]).filter(isNotNil)
  const data = cleanRowValues.map((cellValue, colNum) =>
    parseDataCell(baseDataType, cellValue, {
      ...dataCellMeta, colNumber: colNum+2 // +2 to accomodate propName / dataType cells
    }, parseOpts)
  )

  return data
}

 //-----------------------------------------------------------------------------

export const parseDataCell = (
  dataType: DataType | 'invalid-data-type' | 'invalid-list-type', // put invalid-xxx these in type def?
  cellValue: CellValue,
  dataCellMeta: DataCellMeta,
  parseOpts?: ParseOptions
): any => {

  if (isEmptyCell(cellValue)) return undefined

  if (cellValueHasError(cellValue)) {
    const errorStr: string = getCellError(cellValue)
    return dataCellWarning(`Cell has an error: ${errorStr}`, dataCellMeta, parseOpts)
  }

  switch (dataType) {
  case 'string': return cellValueToString(cellValue, dataCellMeta, parseOpts)
  case 'number': return cellValueToNumber(cellValue, dataCellMeta, parseOpts)
  case 'boolean':return cellValueToBool(cellValue, dataCellMeta, parseOpts)
  case 'date': return cellValueToDate(cellValue, dataCellMeta, parseOpts)
  case 'password': return cellValueToPasswordHash(cellValue, dataCellMeta, parseOpts)
  case 'json': return cellValueFromJson(cellValue, dataCellMeta, parseOpts)
  case 'uuid': return cellValueToUuid(cellValue, dataCellMeta, parseOpts)
  default:
    return dataCellWarning(`Invalid property type: '${dataType}'`, dataCellMeta, parseOpts)
  }
}

//-----------------------------------------------------------------------------

export const parseFrontMatter: ParseFrontMatter = (
  ws: Worksheet,
  startingRowNumber: number,
  parseOpts?: ParseOptions
): any => {

  if (doesNotHaveFrontMatter(ws, startingRowNumber))
    return { nextRowNum: startingRowNumber }

  // +1 to skip the intial '---'
  const curRowNumber = startingRowNumber + 1

  const rowMeta: RowMeta = {
    worksheetName: ws.name,
    rowNumber: curRowNumber
  }

  const parsedData =  parseDataCollection(ws, curRowNumber, {
    ...parseOpts, onDelimiter: 'stop'
  })

  const { data, dataTypeMap, nextRowNum } = parsedData

  // data coming back as an arrary (or undefined), only shoule be 1 entry for frontmatter
  const meta: Meta | undefined = (data || [])[0]

  if (meta && data && data.length > 1) {
    const warningMsg = rowWarning(
      'Front matter should only have one row of data\n' +
      `  Found ${data?.length || 0} rows of data, only the first will be used\n` +
      '  This is indicitive an signifcant internall error',
      rowMeta, parseOpts
    )
    meta.typeWarning = warningMsg as DataType
  }

  const result: ParseFrontMatterResult = {
    meta,
    metaTypeMap: dataTypeMap,
    nextRowNum: nextRowNum // +1 to skip terminating '---'
  }

  return result
}

//-----------------------------------------------------------------------------

export const parseDataLayout: ParseDataLayout = (
  ws: Worksheet,
  rowNumber: number,
  parseOpts?: ParseOptions
) => {

  const row = ws.getRow(rowNumber)
  const rowValues = getRowValues(row)

  if (rowValues.length !== 2) {
    parserWarning(
      `WS: ${ws.name}: Invalid data format row ${rowNumber}\n` +
      `  Expected 2 cells [dataLayout][list | table], found ${rowValues.length}\n` +
      `  acually read: ${toJson(rowValues)}`
    )
  }

  const dataCellMeta: DataCellMeta = {
    worksheetName: ws.name,
    rowNumber,
    colNumber: 0,
    propName: 'dataLayout',
    dataType: 'string'
  }

  // check the label
  let colNumber = 0
  const label = parseDataCell('string', rowValues[colNumber], dataCellMeta, parseOpts)
  if (label !== 'dataLayout') {
    parserWarning(
      `WS: ${ws.name}: Invalid dataLayout row ${rowNumber}, col ${colNumToText(colNumber)}\n` +
      `  Expected lable string 'dataLayout', found '${label}'\n` +
      '  This is just a warning, will still look in next cell over for data format'
    )
  }

  // get the data format type
  colNumber = 1
  const dataLayout = parseDataCell('string', rowValues[colNumber], dataCellMeta, parseOpts)
  if (!validDataLayouts.includes(dataLayout)) {
    throw new Error(
      `WS: ${ws.name}: Invalid dataLayout '${dataLayout}'\n` +
      `  row ${rowNumber}, col ${colNumToText(colNumber)}\n` +
      `  Expected one of ${toJson(validDataLayouts)}`
    )
  }

  return {
    dataLayout,
    nextRowNum: rowNumber + 1,
  }
}
