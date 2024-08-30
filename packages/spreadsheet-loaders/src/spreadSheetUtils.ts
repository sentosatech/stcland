import { complement, isNil } from 'ramda'
import { isBoolean, isObject, isString, isNotNaN, isDate } from 'ramda-adjunct'

import { Worksheet, Row, Cell, CellValue } from 'exceljs'
import sha256 from 'hash.js/lib/hash/sha/256'
import { v4 as uuidv4 } from 'uuid'

import { isStringOrNumber } from '@stcland/utils'


import { validPropTypes } from './SpreadSheetLoaderTypes'
import type {
  GetWorkSheetList, GetRowValues, PropType, DataCellMeta as cellMeta, GetPropTypesFromRow
} from './SpreadSheetLoaderTypes'

export const worksheetTypeCell = [2, 1]
export const cellsToSkip = ['_auto_', '_skip_']

export const shouldSkipCell = (propType: PropType, cellValue: CellValue) => {
  if (isString(cellValue) && cellsToSkip.includes(cellValue)) return true
  if (isNil(cellValue) && propType !== 'uuid') return true
  return false
}

export const cellWarning = (msg: string, cellMeta: cellMeta) =>  {
  console.warn(
    '\nParsing error:\n' +
    `   Worksheet: ${cellMeta.worksheetName}\n` +
    `   Row:${(cellMeta.rowNumber)} Col:${colNumToText(cellMeta.colNumber)}\n` +
    `   propName = '${cellMeta.propName}' | propType = '${cellMeta.propType}'\n` +
    `   ${msg}\n`
  )
  return `${msg} Row:${(cellMeta.rowNumber)} Col:${colNumToText(cellMeta.colNumber)}`
}

export const cellValueToString = (cellValue: CellValue, cellMeta: cellMeta) => {
  const cellText = cellValue?.toString()
  return isString(cellText)
    ? cellText
    : cellWarning(`Invalid string value: '${cellValue}'`, cellMeta)
}

export const cellValueToNumber = (cellValue: CellValue, cellMeta: cellMeta) => {
  const result = Number(cellValue)
  return isNotNaN(result)
    ? result
    : cellWarning(`Invalid number: ${cellValue}`, cellMeta)
}

export const cellValueToPasswordHash = (
  cellValue: CellValue,
  cellMeta: cellMeta
) => isStringOrNumber(cellValue)
  ? sha256().update(cellValue?.toString).digest('hex')
  : cellWarning(`Invalid password: ${cellValue}`, cellMeta)

export const cellValueToBool = (
  cellValue: CellValue,
  cellMeta: cellMeta) : boolean | string =>
{
  if (cellValueIsNotBoolean(cellValue))
    return cellWarning(`Invalid boolean value: '${cellValue}'`, cellMeta)
  if (isBoolean(cellValue)) return cellValue
  if (isString(cellValue)) {
    const boolText = cellValue.toLowerCase()
    return boolText === 'true'
  }
  // shoud not get here
  return cellWarning(`Invalid boolean value: '${cellValue}'`, cellMeta)
}

// If the cell has text, then we will prepend it to the uuid
export const cellValueToUuid = (cellValue: CellValue) =>
  isStringOrNumber(cellValue) ?  `${cellValue?.toString()}-${uuidv4()}` : uuidv4()

export const cellValueToDate = (cellValue: CellValue, cellMeta: cellMeta) =>
  isDate(cellValue) ? cellValue : cellWarning(`Invalid date: ${cellValue}`, cellMeta)

export const cellValueFromJson = (cellValue: CellValue, cellMeta: cellMeta) => {
  if (cellValue) {
    try {
      return JSON.parse(cellValue.toString())
    } catch (e) {
      return cellWarning(`Invalid JSON: ${cellValue}`, cellMeta)
    }
  }
  return cellWarning(`Cell had no JSON content: ${cellValue}`, cellMeta)
}


export const getWorksheetList: GetWorkSheetList = ({ wb,  filterFns = [] }) => {
  const workSheets: Worksheet[] = []
  wb.eachSheet((ws) => {
    if (filterFns.every(fn => fn(ws))) { workSheets.push(ws) }
  })
  return workSheets
}

// Allows usser to add worksheets to the file that won't be parsed
export const worksheetNotHidden = (ws: Worksheet) => ws.name[0] !== '.'

// By convention, the second cell in the first row of a worksheet is the
// type of data in the worksheet
export const getWorksheetType = (ws: Worksheet) =>
  ws.getRow(worksheetTypeCell[1]).getCell(worksheetTypeCell[0]).value

export const cellValueIsFormula = (cell: Cell) =>
  isObject(cell) && cell?.formula && cell?.result

export const cellValueIsBoolean = (cellValue: CellValue) => {
  if (isBoolean(cellValue)) return true
  if (isString(cellValue)) {
    const boolText = cellValue.toLowerCase()
    if (['true', 'false'].includes(boolText)) return true
  }
  return false
}
export const cellValueIsNotBoolean = complement(cellValueIsBoolean)

export const cellValue = (cell: Cell): CellValue =>
  cellValueIsFormula(cell) ? cell?.result : cell?.value

// Returnn values from a worksheet row
export const getRowValues: GetRowValues = row => {
  const cellValues: any[] = []
  row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    cellValues.push(cellValue(cell))
  })
  return cellValues
}

export const getPropNamesFromRow = (row: Row): string[] => {

  const propNames = getRowValues(row) || []

  if (propNames.length === 0 )
    throw new Error(`No property names found in worksheet ${row.worksheet.name}`)

  if (isNotValidPropNameList(propNames)) {
    throw new Error(
      `Invalid property name(s) found in worksheet ${row.worksheet.name}\n  ` +
      'one or more property names are empty or not strings\n  ' +
      propNames.join(', '))
  }
  return propNames as string[]
}

export const getPropTypesFromRow: GetPropTypesFromRow = (row: Row) => {

  const propTypes = getRowValues(row)

  if (propTypes.length === 0 )
    throw new Error(`No property names found in worksheet ${row.worksheet.name}`)

  if (isNotValidPropNameList(propTypes)) {
    throw new Error(
      `Invalid property name(s) found in worksheet ${row.worksheet.name}\n  ` +
      'one or more property names are empty or not strings\n  ' +
      propTypes.join(', '))
  }
  return propTypes as PropType[]
}

// export const getCellText = (cell: CellValue) => cell?.toString() || ''

export const isValidPropType = (propType: PropType) =>
  isString(propType) && validPropTypes.includes(propType)

export const isValidPropTypeList = (propTypes: PropType[]) : {
  valid: boolean;
  invalidTypes: PropType[];
} => {
  const valid = propTypes.every(isValidPropType)
  const invalidTypes = propTypes.filter(dt => !validPropTypes.includes(dt))
  return { valid, invalidTypes }
}

export const isValidPropName = (propName: string) => isString(propName) && propName.length > 0
export const isValidPropNameList = (propNames: CellValue[]) => propNames.every(isValidPropName)
export const isNotValidPropNameList = complement(isValidPropNameList)

export const colNumToText = (colNum: number) =>
  colNumToTextMap[colNum] || `invalid column number ${colNum}`

// currently supports A-BZ
export const colNumToTextMap: { [key: number]: string } = {
  0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G', 7: 'H', 8: 'I', 9: 'J',
  10: 'K', 11: 'L', 12: 'M', 13: 'N', 14: 'O', 15: 'P', 16: 'Q', 17: 'R', 18: 'S', 19: 'T',
  20: 'U', 21: 'V', 22: 'W', 23: 'X', 24: 'Y', 25: 'Z',

  26: 'AA', 27: 'AB', 28: 'AC', 29: 'AD', 30: 'AE', 31: 'AF', 32: 'AG', 33: 'AH', 34: 'AI', 35: 'AJ',
  36: 'AK', 37: 'AL', 38: 'AM', 39: 'AN', 40: 'AO', 41: 'AP', 42: 'AQ', 43: 'AR', 44: 'AS', 45: 'AT',
  46: 'AU', 47: 'AV', 48: 'AW', 49: 'AX', 50: 'AY', 51: 'AZ',

  52: 'BA', 53: 'BB', 54: 'BC', 55: 'BD', 56: 'BE', 57: 'BF', 58: 'BG', 59: 'BH', 60: 'BI', 61: 'BJ',
  62: 'BK', 63: 'BL', 64: 'BM', 65: 'BN', 66: 'BO', 67: 'BP', 68: 'BQ', 69: 'BR', 70: 'BS', 71: 'BT',
  72: 'BU', 73: 'BV', 74: 'BW', 75: 'BX', 76: 'BY', 77: 'BZ',
}

