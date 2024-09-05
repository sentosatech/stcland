import { CellValue, Row } from 'exceljs'

import {
  ParseWorksheet, PropType, RowMeta, DataCellMeta, WorksheetParseOptions
} from './WorksheetParserTypes'

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
  cellWarning,
  parserWarning,
  cellValueHasError,
  getCellError
} from './spreadSheetParseUtils'


export const parseWorksheet: ParseWorksheet = (ws, startingRow, parseOpts): any => {

  const { reportProgress } = parseOpts || {}

  if (reportProgress) console.log(`... Parsing worksheet '${ws.name}'`)

  const propNames = getPropNamesFromRow(ws.getRow(startingRow))
  const propTypes = getPropTypesFromRow(ws.getRow(startingRow+1))

  if (propNames.length !== propTypes.length) {
    parserWarning('Number of property names does not match number of property types', parseOpts)
    return
  }

  const data: any[] = []
  ws.eachRow(async (row, rowNumber) => {
    const rowMeta: RowMeta = { worksheetName: ws.name, rowNumber }
    if (rowNumber < startingRow+2 ) return
    const rowData = parseDataRow(propNames, propTypes, row, rowMeta, parseOpts)
    data.push(rowData)
  })

  const dataTypes = propNames.reduce((acc, propName, i) => {
    return { ...acc, [propName]: propTypes[i] }
  }, {})

  return { data, dataTypes }
}

const parseDataRow = (
  propNames: string[],
  propTypes: PropType[],
  row: Row,
  rowMeta: RowMeta,
  parseOpts?: WorksheetParseOptions
) => {

  const propValues = getRowValues(row)
  const data = propNames.reduce((accData, propName, i) => {

    const cellMeta = {
      ...rowMeta,
      colNumber: i,
      propName,
      propType: propTypes[i]
    }

    if (propValues[i]?.toString().trim() === '_skip_')
      return accData

    const dataValue = parseDataCell(
      propTypes[i], propValues[i], cellMeta, parseOpts
    )

    return {
      ...accData, [propName]: dataValue
    }
  }, {})

  return data
}

export const parseDataCell = (
  propType: PropType,
  cellValue: CellValue,
  cellMeta: DataCellMeta,
  parseOpts?: WorksheetParseOptions
): any => {


  if (isEmptyCell(cellValue)) return undefined

  if (cellValueHasError(cellValue)) {
    const errorStr: string = getCellError(cellValue)
    return cellWarning(`Cell has an error: ${errorStr}`, cellMeta, parseOpts)
  }

  switch (propType) {
  case 'string': return cellValueToString(cellValue, cellMeta, parseOpts)
  case 'number': return cellValueToNumber(cellValue, cellMeta, parseOpts)
  case 'boolean':return cellValueToBool(cellValue, cellMeta, parseOpts)
  case 'date': return cellValueToDate(cellValue, cellMeta, parseOpts)
  case 'password': return cellValueToPasswordHash(cellValue, cellMeta, parseOpts)
  case 'json': return cellValueFromJson(cellValue, cellMeta, parseOpts)
  case 'uuid': return cellValueToUuid(cellValue, cellMeta, parseOpts)
  default: return cellWarning(`Invalid property type: '${propType}'`, cellMeta, parseOpts)
  }
}
