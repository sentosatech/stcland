import { CellValue, Row, Worksheet } from 'exceljs'

import type {
  ParseWorksheet, DataType, RowMeta, DataCellMeta, ParseOptions,
  ParseFrontMatter, ParseDataLayout, ParseDataTableResult, ParseDataListResult,
  ParseDataTable, Meta, MetaTypes, ParsedWorksheetResult
} from './SpreadsheetParserTypes'

import { validDataLayouts } from './SpreadsheetParserTypes'

import {
  isEmptyCell, getRowValues, cellValueToDate, colNumToText,
  cellValueToBool, cellValueToString, cellValueToNumber,
  cellValueToPasswordHash, cellValueFromJson, cellValueToUuid,
  getPropNamesFromRow, getPropTypesFromRow,
  dataCellWarning, parserWarning, cellValueHasError, getCellError,
  doesNotHaveFrontMatter, rowIsNotFrontMatterDelimiter,
  getPropNameFromCallValue, getPropTypeFromCallValue,
} from './spreadsheetParseUtils'

import { toJson } from '@stcland/utils'

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
  case 'dataList':
    break
  case 'dataTable':
    parsedData = parseDataTable(ws, nextRowNum, parseOpts)
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

  const data: any[] = []
  ws.eachRow((row, rowNumber) => {

    // skip propName and propType rows
    if (rowNumber < startingRowNum+2 )
      return

    const rowMeta: RowMeta = {
      worksheetName: ws.name, rowNumber
    }
    const rowData = parseDataRow(propNames, propTypes, row, rowMeta, parseOpts)
    data.push(rowData)
  })

  const dataTypes = propNames.reduce((acc, propName, i) => {
    return { ...acc, [propName]: propTypes[i] }
  }, {})

  return { numDataRowsParsed: data.length, data, dataTypes }
}

//-----------------------------------------------------------------------------

const parseDataRow = (
  propNames: string[],
  propTypes: DataType[],
  row: Row,
  rowMeta: RowMeta,
  parseOpts?: ParseOptions
) => {

  const propValues = getRowValues(row)
  const data = propNames.reduce((accData, propName, i) => {

    const dataCellMeta = {
      ...rowMeta, colNumber: i, propName, propType: propTypes[i]
    }

    if (propValues[i]?.toString().trim() === '_skip_')
      return accData

    const dataValue = parseDataCell(
      propTypes[i], propValues[i], dataCellMeta, parseOpts
    )

    return {
      ...accData, [propName]: dataValue
    }
  }, {})

  return data
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
  default: return dataCellWarning(`Invalid property type: '${propType}'`, dataCellMeta, parseOpts)
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

  let meta: Record<string, any> = {}
  let metaTypes: Record<string, DataType> = {}

  // skip the intiial '---'
  let curRowNumber = startingRowNumber + 1
  let curRow = ws.getRow(curRowNumber)

  while(rowIsNotFrontMatterDelimiter(curRow)) {

    const rowMeta: RowMeta = {
      worksheetName: ws.name,
      rowNumber: curRowNumber
    }

    const rowValues = getRowValues(curRow)

    if (rowValues.length !== 3) {
      parserWarning(
        `WS: ${ws.name}: Invalid front matter row ${curRowNumber}\n` +
        `  Expected 3 cells [propName, propType, propValue], found ${rowValues.length}\n` +
        `  ${toJson(rowValues)}`
      )
      curRowNumber++
      curRow = ws.getRow(curRowNumber)
      continue
    }

    curRowNumber++
    curRow = ws.getRow(curRowNumber)
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

    meta = { ...meta, [propName]: propValue }
    metaTypes = { ...metaTypes, [propName]: propType }
  }

  return { meta, metaTypes, nextRowNum: curRowNumber + 1 }
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
