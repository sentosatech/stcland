import { CellValue, Row, Worksheet } from 'exceljs'

import type {
  ParseOptions, ParseWorksheet,
  ParseFrontMatter,   ParseFrontMatterResult,
  ParseDataLayout, ParseDataTable, ParseDataList,
  ParseDataTableResult, ParseDataListResult, ParsedWorksheetResult,
  RowMeta, DataCellMeta, Meta, MetaTypes,
  Data, DataTableData, // DataListData,    DataLayout,
  DataType, DataTypes, // DataTableDataType, HorizontalDataListType, DataListDataType,
} from './SpreadsheetParserTypes'


import { validDataLayouts } from './SpreadsheetParserTypes'

import {
  isEmptyCell, getRowValues, cellValueToDate, colNumToText,
  cellValueToBool, cellValueToString,
  cellValueToNumber,
  cellValueToPasswordHash, cellValueFromJson, cellValueToUuid,
  getPropNamesFromRow, getPropTypesFromRow,
  dataCellWarning, parserWarning, cellValueHasError, getCellError,
  doesNotHaveFrontMatter, getPropNameFromCallValue, getPropTypeFromCallValue,
} from './spreadsheetParseUtils'

import { toJson } from '@stcland/utils'
import { keys } from 'ramda'

//-----------------------------------------------------------------------------

export const parseWorksheet: ParseWorksheet = (
  ws, parseOpts = {}, startingRowNum = 1
) => {

  const { reportProgress = true } = parseOpts || {}

  const worksheetName = ws.name
  if (reportProgress) console.log(`... Parsing worksheet '${worksheetName}'`)

  let meta: Meta | undefined = undefined
  let metaTypes: MetaTypes | undefined = undefined
  let parsedData: ParseDataListResult | ParseDataTableResult | undefined

  let nextRowNum = startingRowNum

  const dataLayoutResult = parseDataLayout(ws, nextRowNum, parseOpts)
  const { dataLayout } = dataLayoutResult

  nextRowNum = dataLayoutResult.nextRowNum

  // any data format may start with front matter
  const frontMatterResult = parseFrontMatter(ws, nextRowNum, parseOpts)

  meta = frontMatterResult.meta
  metaTypes = frontMatterResult.metaTypes

  nextRowNum = frontMatterResult.nextRowNum

  switch (dataLayout) {
  case 'dataTable':
    parsedData = parseDataTable(ws, nextRowNum, parseOpts)
    break
  case 'dataList':
    parsedData = parseDataList(ws, nextRowNum, parseOpts)
    break
  default:
    break // ok to have no data
  }

  const result: ParsedWorksheetResult = {
    worksheetName,
    dataLayout,
    numDataRowsParsed: parsedData?.numDataRowsParsed || 0,
    meta,
    metaTypes,
    data: parsedData?.data,
    dataTypes: parsedData?.dataTypes,
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
  const propTypes = getPropTypesFromRow(ws.getRow(startingRowNum+1))

  if (propNames.length !== propTypes.length) {
    parserWarning(
      `WS: ${worksheetName}: Number of property names does not match number of property types (skipping)\n` +
      `  property names: ${toJson(propNames)}\n` +
      `  property types: ${toJson(propTypes)}`,
      parseOpts
    )
    return { numDataRowsParsed: 0, data: [], dataTypes: {} }
  }

  const data: DataTableData = []
  ws.eachRow((row, rowNumber) => {

    // skip propName and propType rows
    if (rowNumber < startingRowNum+2)
      return

    // keep an eye out for data termination row (if any)
    if ( parseOpts?.dataTerminationRow === '---' && row.getCell(1).value === '---')
      return false // terminates the eachRow interation loop

    const rowMeta: RowMeta = {
      worksheetName: ws.name, rowNumber
    }
    const rowData = parseTableDataRow(propNames, propTypes, row, rowMeta, parseOpts)
    data.push(rowData)
  })

  const dataTypes = propNames.reduce((acc, propName, i) => {
    return { ...acc, [propName]: propTypes[i] }
  }, {})

  return { numDataRowsParsed: data.length, data, dataTypes }
}

//-----------------------------------------------------------------------------

const parseTableDataRow = (
  propNames: string[],
  propTypes: DataType[],
  row: Row,
  rowMeta: RowMeta,
  parseOpts?: ParseOptions
): Data => {

  const propValues = getRowValues(row)
  const data = propNames.reduce((accData, propName, colNumber) => {

    const dataCellMeta = {
      ...rowMeta, colNumber, propName, propType: propTypes[colNumber]
    }

    if (propValues[colNumber]?.toString().trim() === '_skip_')
      return accData

    const dataValue = parseDataCell(
      propTypes[colNumber], propValues[colNumber], dataCellMeta, parseOpts
    )

    return {
      ...accData, [propName]: dataValue
    }
  }, {})

  return data
}

//-----------------------------------------------------------------------------

export const parseDataList: ParseDataList = (
  ws, startingRowNum, parseOpts?
) => {
  const worksheetName = ws.name

  let data: Data | undefined = undefined
  let dataTypes: DataTypes | undefined = undefined

  let stopParsing = false

  ws.eachRow((curRow, curRowNumber) => {

    if (stopParsing) return

    const rowMeta: RowMeta = {
      worksheetName: ws.name,
      rowNumber: curRowNumber
    }

    // Get to our target row
    if (curRowNumber < startingRowNum)
      return

    // keep an eye out for data termination row (if any)
    if ( parseOpts?.dataTerminationRow === '---' && curRow.getCell(1).value === '---') {
      stopParsing = true
      return
    }

    const rowValues = getRowValues(curRow)

    if (rowValues.length !== 3) {
      parserWarning(
        `WS: ${worksheetName}: Invalid Data List property row ${curRowNumber}\n` +
        `  Expected 3 cells [propName, propType, propValue], found ${rowValues.length}\n` +
        `  ${toJson(rowValues)}`
      )
    }

    if (rowValues[2]?.toString().trim() === '_skip_')
      return

    const propName = getPropNameFromCallValue(rowValues[0], {
      ...rowMeta, colNumber: 0
    })

    const propType = getPropTypeFromCallValue(rowValues[1], {
      ...rowMeta, colNumber: 1
    })

    const propValue = parseDataCell(
      propType, rowValues[2],
      { ...rowMeta, colNumber: 2, propName, propType },
      parseOpts
    )

    data = { ...(data || {}), [propName]: propValue }
    dataTypes = { ...(dataTypes || {}), [propName]: propType }
  })

  const result: ParseDataListResult = {
    data,
    dataTypes,
    numDataRowsParsed: keys(data || {}).length,
  }

  return result

}

//-----------------------------------------------------------------------------

export const parseDataCell = (
  propType: DataType,
  cellValue: CellValue,
  dataCellMeta: DataCellMeta,
  parseOpts?: ParseOptions
): any => {

  if (isEmptyCell(cellValue)) return undefined

  if (cellValueHasError(cellValue)) {
    const errorStr: string = getCellError(cellValue)
    return dataCellWarning(`Cell has an error: ${errorStr}`, dataCellMeta, parseOpts)
  }

  switch (propType) {
  case 'string': return cellValueToString(cellValue, dataCellMeta, parseOpts)
  case 'number': return cellValueToNumber(cellValue, dataCellMeta, parseOpts)
  case 'boolean':return cellValueToBool(cellValue, dataCellMeta, parseOpts)
  case 'date': return cellValueToDate(cellValue, dataCellMeta, parseOpts)
  case 'password': return cellValueToPasswordHash(cellValue, dataCellMeta, parseOpts)
  case 'json': return cellValueFromJson(cellValue, dataCellMeta, parseOpts)
  case 'uuid': return cellValueToUuid(cellValue, dataCellMeta, parseOpts)
  default:
    return dataCellWarning(`Invalid property type: '${propType}'`, dataCellMeta, parseOpts)
  }
}

//-----------------------------------------------------------------------------

export const parseHorizontalDataList = (
  rowValues: CellValue[],
  dataCellMeta: DataCellMeta,
  parseOpts?: ParseOptions
) => {

  // get prop name and data type
  // const propName = getPropNameFromCallValue(rowValues[0], dataCellMeta)
  // const propType = getPropTypeFromCallValue(rowValues[1], dataCellMeta)

  // make sure it is a list
  // iteratte over the the rowValues and parse each cell
  // const propValues = rowValues.slice(2).map((cellValue, i) => {
  //   return parseDataCell('dataList', propType, cellValue, {
  //     ...dataCellMeta, colNumber: i+2, propName, propType
  //   }, parseOpts)
  // })


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


  const parsedData =  parseDataList(ws, curRowNumber, {
    ...parseOpts, dataTerminationRow: '---'
  })

  const { data, dataTypes, numDataRowsParsed } = parsedData

  const result: ParseFrontMatterResult = {
    meta: data,
    metaTypes: dataTypes,
    nextRowNum: curRowNumber + numDataRowsParsed + 1 // +1 to skip terminating '---'
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
    propType: 'string'
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
