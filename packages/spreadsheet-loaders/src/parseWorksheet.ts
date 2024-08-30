import { CellValue, Row } from 'exceljs'

import {
  ParseWorksheet, PropType, RowMeta, DataCellMeta
} from './SpreadSheetLoaderTypes'

import {
  getRowValues,
  shouldSkipCell,
  colNumToText,
  cellValueToDate,
  getPropNamesFromRow,
  getPropTypesFromRow,
  cellValueToBool,
  cellValueToString,
  cellValueToNumber,
  cellValueToPasswordHash,
  cellValueFromJson,
  cellValueToUuid,
  cellWarning
} from './spreadSheetUtils'

export const parseWorksheet: ParseWorksheet = ({
  ws,
  firstRowOffset = 0,
  log = false
}): any => {

  if (log) console.log(`\n... Parsing worksheet '${ws.name}'`)

  const propNames = getPropNamesFromRow(ws.getRow(firstRowOffset))
  const propTypes = getPropTypesFromRow(ws.getRow(firstRowOffset+1))

  if (propNames.length !== propTypes.length)
    throw new Error(`Property names and types are not the same length in worksheet ${ws.name}`)

  ws.eachRow(async (row, rowNumber) => {
    const dataRowInfo: RowMeta = { worksheetName: ws.name, rowNumber }
    if (rowNumber < firstRowOffset+2 ) return
    const rowData = parseDataRow(propNames, propTypes, row, dataRowInfo)
    console.log('rowData: ', rowData)
  })
}

const parseDataRow = (
  propNames: string[],
  propTypes: PropType[],
  row: Row,
  rowMeta: RowMeta
) => {

  const propValues = getRowValues(row)
  const data = propNames.reduce((accData, propName, i) => {

    const cellMeta = {
      ...rowMeta,
      colNumber: i,
      propName,
      propType: propTypes[i]
    }

    const dataValue = parseDataCell(propTypes[i], propValues[i], cellMeta)

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
  silent: boolean = false // if true, don't log warnings (for testing)
): any => {

  // TODO: check for error cells

  if (shouldSkipCell(propType, cellValue)) return undefined

  switch (propType) {
  case 'string': return cellValueToString(cellValue, cellMeta)
  case 'number': return cellValueToNumber(cellValue, cellMeta)
  case 'boolean':return cellValueToBool(cellValue, cellMeta)
  case 'date': return cellValueToDate(cellValue, cellMeta)
  case 'password': return cellValueToPasswordHash(cellValue, cellMeta)
  case 'json': return cellValueFromJson(cellValue, cellMeta)
  case 'uuid': return cellValueToUuid(cellValue)
  default: return cellWarning(`Invalid property type: '${propType}'`, cellMeta)
  }
}
