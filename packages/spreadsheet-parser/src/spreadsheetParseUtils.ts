import { complement, isNil } from 'ramda'
import { isBoolean, isObject, isString, isNotNaN, isDate, isNotNil } from 'ramda-adjunct'

import { Worksheet, Row, Cell, CellValue } from 'exceljs'
import sha256 from 'hash.js/lib/hash/sha/256'
import { v4 as uuidv4, validate as isValidUuid4 } from 'uuid'

import { isStringOrNumber, isNonEmptyStr, strIsValidObjectKey, toJson } from '@stcland/utils'

import { validDataTypes } from './SpreadsheetParserTypes'
import type {
  GetWorkSheetList,
  GetRowValues,
  DataType,
  GetPropTypesFromRow,
  ParseOptions,
  DataCellMeta,
  CellMeta
} from './SpreadsheetParserTypes'

//*****************************************************************************
// Cell value parsers
//*****************************************************************************

export const cellValueToString = (
  cellValue: CellValue,
  dataCellMeta: DataCellMeta,
  parseOpts?: ParseOptions
) : string | undefined => {
  const cellText = cellValue?.toString()
  return isString(cellText)
    ? cellText
    : dataCellWarning(`Invalid string value: '${cellValue}'`, dataCellMeta, parseOpts)
}

export const cellValueToNumber = (
  cellValue: CellValue,
  dataCellMeta: DataCellMeta,
  parseOpts?: ParseOptions
) : number | string | undefined => {
  const result = Number(cellValue)
  return isNotNaN(result)
    ? result
    : dataCellWarning(`Invalid number: ${cellValue}`, dataCellMeta, parseOpts)
}

export const cellValueToPasswordHash = (
  cellValue: CellValue,
  dataCellMeta: DataCellMeta,
  parseOpts?: ParseOptions
) : string | undefined =>
  isStringOrNumber(cellValue)
    ? passwordHash(cellValue?.toString() || '')
    : dataCellWarning(`Invalid password: ${cellValue}`, dataCellMeta, parseOpts)

export const cellValueToBool = (
  cellValue: CellValue,
  dataCellMeta: DataCellMeta,
  parseOpts?: ParseOptions) : boolean | string | undefined =>
{
  if (cellValueIsNotBoolean(cellValue))
    return dataCellWarning(`Invalid boolean value: '${cellValue}'`, dataCellMeta, parseOpts)
  if (isBoolean(cellValue)) return cellValue
  if (isString(cellValue)) {
    const boolText = cellValue.toLowerCase()
    return boolText === 'true'
  }
  // shoud not get here
  return dataCellWarning(`Invalid boolean value: ${cellValue}`, dataCellMeta, parseOpts)
}

// If the cell has text, then we will prepend it to the uuid
export const cellValueToUuid = (
  cellValue: CellValue,
  dataCellMeta: DataCellMeta,
  parseOpts?: ParseOptions
) : string | undefined => {
  if (isNil(cellValue) || isNil(cellValue.valueOf())) return undefined
  const cellText = cellValue?.toString() || ''
  if (cellText.trim().indexOf('_auto_') > -1) {
    const forUuidInsertion = cellText
    return forUuidInsertion.replace('_auto_', uuidv4())
  } else if (isValidUuid4(cellText)) {
    return cellText
  } else {
    return dataCellWarning(`Invalid UUID: ${cellValue}`, dataCellMeta, parseOpts)
  }
}

export const cellValueToDate = (
  cellValue: CellValue,
  dataCellMeta: DataCellMeta,
  parseOpts?: ParseOptions
) : Date | string | undefined =>
  isDate(cellValue)
    ? cellValue
    : dataCellWarning(`Invalid date: ${cellValue}`, dataCellMeta, parseOpts)

export const cellValueFromJson = (
  cellValue: CellValue,
  dataCellMeta: DataCellMeta,
  parseOpts?: ParseOptions
): any | undefined => {
  if (cellValue) {
    try {
      return JSON.parse(cellValue.toString())
    } catch (e) {
      return dataCellWarning(`Invalid JSON: ${cellValue}`, dataCellMeta, parseOpts)
    }
  }
  return dataCellWarning(`Cell had no JSON content: ${cellValue}`, dataCellMeta)
}

//*****************************************************************************
// Logging
//*****************************************************************************

export const parserWarning = (msg: string, parseOpts?: ParseOptions) => {
  const { reportWarnings = true } = parseOpts || {}
  if (reportWarnings) {
    console.warn(`\nParsing warning: ${msg}`)
  }
}

export const dataCellWarning = (
  msg: string,
  dataCellMeta: DataCellMeta,
  parseOpts?: ParseOptions
) =>  {
  const { reportWarnings = true } = parseOpts || {}
  if (reportWarnings) {
    console.warn(
      '\nParsing error:\n' +
      `   Worksheet: ${dataCellMeta.worksheetName}\n` +
      `   Row:${(dataCellMeta.rowNumber)} Col:${colNumToText(dataCellMeta.colNumber)}\n` +
      `   propName = '${dataCellMeta.propName}' | propType = '${dataCellMeta.propType}'\n` +
      `   ${msg}\n`
    )
  }
  return `${msg} -> WS:${dataCellMeta.worksheetName}, Row:${(dataCellMeta.rowNumber)} Col:${colNumToText(dataCellMeta.colNumber)}`
}

export const cellWarning = (
  msg: string,
  cellMeta: CellMeta,
  parseOpts?: ParseOptions
) =>  {
  const { reportWarnings = true } = parseOpts || {}
  if (reportWarnings) {
    console.warn(
      '\nParsing error:\n' +
      `   Worksheet: ${cellMeta.worksheetName}\n` +
      `   Row:${(cellMeta.rowNumber)} Col:${colNumToText(cellMeta.colNumber)}\n` +
      `   ${msg}\n`
    )
  }
  return `${msg} -> WS:${cellMeta.worksheetName}, Row:${(cellMeta.rowNumber)} Col:${colNumToText(cellMeta.colNumber)}`
}



//*****************************************************************************
// General Parsing Utils
//*****************************************************************************

export const rowIsFrontMatterDelimiter = (row: Row) =>
  row.getCell(1).value === '---'

export const worksheetHasFrontmatter = (ws: Worksheet, startingRow: number) => {
  const row = ws.getRow(startingRow)
  return rowIsFrontMatterDelimiter(row)
}

export const rowIsNotFrontMatterDelimiter = complement(rowIsFrontMatterDelimiter)
export const doesNotHaveFrontMatter = complement(worksheetHasFrontmatter)

export const passwordHash = (password: string) =>
  sha256().update(password).digest('hex')

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

export const isEmptyCell = (cellValue: CellValue) => {
  if (isNil(cellValue)) return true
  if (isNil(cellValue.valueOf())) return true
  return false
}

export const cellValueHasError = (cellValue: CellValue) =>
  isObject(cellValue) && isNotNil((cellValue as any)?.error)

export const getCellError = (cellValue: CellValue): string =>
  cellValueHasError(cellValue) ? (cellValue as any).error : ''

export const cellValue = (cell: Cell): CellValue =>
  cellValueIsFormula(cell) ? cell?.result : cell?.value

// Allows usser to add worksheets to the file that won't be parsed
export const worksheetNotHidden = (ws: Worksheet) => ws.name[0] !== '.'

// excludes 'hidden' worksheets (i.e. worksheet name begins with a '.')
export const getWorksheetList: GetWorkSheetList = (wb, filterFns = []) => {
  const workSheets: Worksheet[] = []
  const withHiddenFilter = [...filterFns, worksheetNotHidden]
  wb.eachSheet((ws) => {
    if (withHiddenFilter.every(fn => fn(ws)))
      workSheets.push(ws)
  })
  return workSheets
}

// Returnn values from a worksheet row
export const getRowValues: GetRowValues = row => {
  const cellValues: any[] = []
  row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    cellValues.push(cellValue(cell))
  })
  return cellValues
}

export const getRowValuesAsStrings = (row: Row): string[] => {
  const cellValues = getRowValues(row)
  return cellValues.map(cv => cv?.toString() || '')
}

export const getPropNamesFromRow = (row: Row): string[] => {

  const propNames = getRowValuesAsStrings(row)

  if (propNames.length === 0 )
    throw new Error(`No property names found in worksheet ${row.worksheet.name}`)

  if (isNotValidPropNameList(propNames)) {
    const invalidPropIdx = invalidPropNameIdx(propNames)
    const invalidPropCol = colNumToText(invalidPropIdx)
    const invalidPropName = propNames[invalidPropIdx]
    throw new Error(
      `Invalid property name found in worksheet ${row.worksheet.name}\n` +
      `Property name is empty or not strings: '${invalidPropName}' (Column ${invalidPropCol})\n`
    )
  }
  return propNames as string[]
}

export const getPropNameFromCallValue = (
  cellValue: CellValue,
  cellMeta: CellMeta,
) => {

  if (isNil(cellValue))
    throw new Error(cellWarning('Empty property name', cellMeta))

  const propName = cellValue.toString()
  if (isNotValidPropName(propName)) {
    throw new Error(cellWarning(`Invalid property name: ${propName}`, cellMeta))
  }

  return propName
}

export const getPropTypeFromCallValue = (
  cellValue: CellValue,
  cellMeta: CellMeta,
) => {

  if (isNil(cellValue))
    throw new Error(cellWarning('Empty property type', cellMeta))

  const propType = cellValue.toString() as DataType
  if (isNotValidPropName(propType)) {
    throw new Error(cellWarning(
      `Invalid property type: ${propType}, should be one of ${toJson(validDataTypes)}`, cellMeta))
  }

  return propType
}


export const getPropTypesFromRow: GetPropTypesFromRow = (row: Row) => {

  const propTypes = getRowValuesAsStrings(row) as DataType[]

  if (propTypes.length === 0 )
    throw new Error(`No property names found in worksheet ${row.worksheet.name}`)

  if (isNotValidPropTypeList(propTypes)) {
    const invalidPropIdx = invalidPropTypeIdx(propTypes)
    const invalidPropCol = colNumToText(invalidPropIdx)
    const invalidPropType = propTypes[invalidPropIdx]
    throw new Error(
      `Invalid property type found in worksheet ${row.worksheet.name}:\n` +
      `  found: ${invalidPropType} (Column ${invalidPropCol})\n` +
      `  should be one of ${toJson(validDataTypes.join(', '))}`
    )
  }
  return propTypes as DataType[]
}

export const isValidPropType = (propType: string) =>
  isString(propType) && validDataTypes.includes(propType as DataType)

export const isValidPropTypeList = (propTypes: DataType[]) : {
  valid: boolean;
  invalidTypes: DataType[];
} => {
  const valid = propTypes.every(isValidPropType)
  const invalidTypes = propTypes.filter(dt => !validDataTypes.includes(dt))
  return { valid, invalidTypes }
}

export const isNotValidPropType = complement(isValidPropType)
export const isNotValidPropTypeList = complement(isValidPropTypeList)

export const invalidPropTypeIdx = (propTypes: DataType[]) =>
  propTypes.findIndex(isNotValidPropType)

export const isValidPropName = (propName: string) =>
  isNonEmptyStr(propName) && strIsValidObjectKey(propName)

export const isValidPropNameList = (propNames: CellValue[]) =>
  propNames.every(isValidPropName)

export const isNotValidPropName = complement(isValidPropName)
export const isNotValidPropNameList = complement(isValidPropNameList)

export const invalidPropNameIdx = (propNames: CellValue[]) =>
  propNames.findIndex(isNotValidPropName)

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

