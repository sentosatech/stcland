import { CellValue, Row } from 'exceljs'

import {
  ParseWorksheet, PropType, RowMeta, DataCellMeta, ParseWorksheetOptions
} from './SpreadSheetLoaderTypes'

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
} from './spreadSheetUtils'

export const parseWorksheet: ParseWorksheet = (ws, startingRow=1, parseOpts): any => {
  const { reportProgress } = parseOpts || {}

  if (reportProgress) console.log(`\n... Parsing worksheet '${ws.name}'`)

  const propNames = getPropNamesFromRow(ws.getRow(startingRow))
  const propTypes = getPropTypesFromRow(ws.getRow(startingRow+1))

  if (propNames.length !== propTypes.length) {
    parserWarning('Number of property names does not match number of property types', parseOpts)
    return
  }

  ws.eachRow(async (row, rowNumber) => {
    const rowMeta: RowMeta = { worksheetName: ws.name, rowNumber }
    if (rowNumber < startingRow+2 ) return
    const rowData = parseDataRow(propNames, propTypes, row, rowMeta, parseOpts)
    console.log('rowData: ', rowData)
  })
}

const parseDataRow = (
  propNames: string[],
  propTypes: PropType[],
  row: Row,
  rowMeta: RowMeta,
  parseOpts?: ParseWorksheetOptions
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
  parseOpts?: ParseWorksheetOptions
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
