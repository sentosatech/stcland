import { CellValue, Row, Worksheet } from 'exceljs'

import type {
  ParseWorksheet, DataType, RowMeta, DataCellMeta, WorksheetParseOptions,
  ParseFrontMatter
} from './SpreadsheetParserTypes'

import {
  getRowValues,
  isEmptyCell,
  cellValueToDate,
  getPropNamesFromRow,
  getPropTypesFromRow,
  cellValueToBool,
  cellValueToString,
  cellValueToNumber,
  cellValueToPasswordHash,
  cellValueFromJson,
  cellValueToUuid,
  dataCellWarning,
  parserWarning,
  cellValueHasError,
  getCellError,
  doesNotHaveFrontMatter,
  rowIsNotFrontMatterDelimiter,
  getPropNameFromCallValue,
  getPropTypeFromCallValue,
} from './spreadsheetParseUtils'
import { toJson } from '@stcland/utils'

export const parseWorksheet: ParseWorksheet = (
  ws, parseOpts = {}, startingRowNum = 1
) => {

  const { reportProgress = true } = parseOpts || {}

  const sheetName = ws.name
  if (reportProgress) console.log(`... Parsing worksheet '${sheetName}'`)

  const { meta, metaTypes, dataStartRowNum } = parseFrontMatter(ws, startingRowNum, parseOpts)

  const propNames = getPropNamesFromRow(ws.getRow(dataStartRowNum))
  const propTypes = getPropTypesFromRow(ws.getRow(dataStartRowNum+1))


  if (propNames.length !== propTypes.length) {
    parserWarning(
      `WS: ${sheetName}: Number of property names does not match number of property types (skipping)\n` +
      `  property names: ${toJson(propNames)}\n` +
      `  property types: ${toJson(propTypes)}`,
      parseOpts
    )
    return { sheetName, rowsParsed: 0, data: [], dataTypes: {} }
  }

  const data: any[] = []
  ws.eachRow((row, rowNumber) => {

    // skip propName and propType rows
    if (rowNumber < dataStartRowNum+2 )
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

  const rowsParsed = data.length
  return { sheetName, rowsParsed, data, dataTypes, meta, metaTypes }
}

const parseDataRow = (
  propNames: string[],
  propTypes: DataType[],
  row: Row,
  rowMeta: RowMeta,
  parseOpts?: WorksheetParseOptions
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

export const parseDataCell = (
  propType: DataType,
  cellValue: CellValue,
  dataCellMeta: DataCellMeta,
  parseOpts?: WorksheetParseOptions
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

export const parseFrontMatter: ParseFrontMatter = (
  ws: Worksheet,
  startingRowNumber: number,
  parseOpts?: WorksheetParseOptions
): any => {

  if (doesNotHaveFrontMatter(ws, startingRowNumber))
    return { dataStartRowNum: startingRowNumber }

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

  return { meta, metaTypes, dataStartRowNum: curRowNumber + 1 }
}
