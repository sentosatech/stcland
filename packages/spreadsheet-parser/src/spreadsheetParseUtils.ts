import { complement, isEmpty, isNil } from 'ramda'
import { isBoolean, isObject, isString, isNotNaN, isDate, isNotNil } from 'ramda-adjunct'

import { Worksheet, Row, Cell, CellValue } from 'exceljs'
import sha256 from 'hash.js/lib/hash/sha/256'
import { v4 as uuidv4, validate as isValidUuid4 } from 'uuid'

import {
  isStringOrNumber, isNonEmptyStr, strIsValidObjectKey, toJson
} from '@stcland/utils'

import {
  validDataTableDataTypes, validRowValueListTypes,
  validDataCollectionDataTypes, validDataTypes,
} from './SpreadsheetParserTypes'

import type {
  ParseOptions,
  GetWorkSheetList, GetRowValues, GetDataTypesFromRow,
  CellMeta, DataCellMeta, RowMeta,
  DataType, DataTableDataType, RowValueListType, DataCollectionDataType,
  InvalidTypeWarning,
} from './SpreadsheetParserTypes'


// --- Cell value parsers -----------------------------------------------------

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


//--- data/data-info getters --------------------------------------------------

export const getCellValue = (cell: Cell): CellValue =>
  cellValueIsFormula(cell) ? cell?.result : cell?.value

// Returnn values from a worksheet row
export const getRowValues: GetRowValues = row => {
  const cellValues: any[] = []
  row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    cellValues.push(getCellValue(cell))
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

export const getDataTypeFromCallValue = (
  cellValue: CellValue,
  cellMeta: CellMeta,
) => {

  if (isNil(cellValue))
    throw new Error(cellWarning('Empty property type', cellMeta))

  const dataType = cellValue.toString() as DataType
  if (isNotValidPropName(dataType)) {
    throw new Error(cellWarning(
      `Invalid property type: ${dataType}, should be one of ${toJson(validDataTypes)}`, cellMeta))
  }

  return dataType
}

export const getDataTypesFromRow: GetDataTypesFromRow = (row: Row) => {

  const dataTypes = getRowValuesAsStrings(row) as DataType[]

  if (dataTypes.length === 0 )
    throw new Error(`No property names found in worksheet ${row.worksheet.name}`)

  if (isNotValidDataTypeList(dataTypes)) {
    const invalidPropIdx = invalidDataTypeIdx(dataTypes)
    const invalidPropCol = colNumToText(invalidPropIdx)
    const invalidDataType = dataTypes[invalidPropIdx]
    throw new Error(
      `Invalid property type found in worksheet ${row.worksheet.name}:\n` +
      `  found: ${invalidDataType} (Column ${invalidPropCol})\n` +
      `  should be one of ${toJson(validDataTypes.join(', '))}`
    )
  }
  return dataTypes as DataType[]
}

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

// returns data type if valid or false if not a valid list
export const getRowValueListBaseType = (
  dataType: DataType
): DataType | 'invalid-list-type' => {

  if (!dataType.includes(':')) return 'invalid-list-type'
  const [subType] = dataType.split(':') as [DataType]
  return validDataTypes.includes(subType) ? subType : 'invalid-list-type'
}

export const getBaseDataType = (
  dataType: DataType,
): DataType | InvalidTypeWarning =>
  isValidRowValueListType(dataType) ? getRowValueListBaseType(dataType) :
  isValidDataTableDataType(dataType) ? dataType :
  'invalid-data-type'

export const getDataType = (
  dataType: DataType,
  cellMeta: CellMeta
): DataType | InvalidTypeWarning =>
  isReferencedDataType(dataType) ? getReferencedDataType(dataType, cellMeta) :
  isLinkedDataType(dataType) ? getLinkidDataType(dataType, cellMeta) :
  isValidRowValueListType(dataType) ? dataType :
  isValidDataTableDataType(dataType) ? dataType :
  'invalid-data-type'


export const getCellError = (cellValue: CellValue): string =>
  cellValueHasError(cellValue) ? (cellValue as any).error : ''

//--- data validation ---------------------------------------------------------

export const isValidDataTableDataType = (dataType: DataType) =>
  isString(dataType) && validDataTableDataTypes.includes(dataType as DataTableDataType)

export const isValidRowValueListType = (dataType: DataType) =>
  isString(dataType) && validRowValueListTypes.includes(dataType as RowValueListType)

export const isRowValueListType = isValidRowValueListType

export const isValidDataCollectionDataType = (dataType: DataType) =>
  isString(dataType) && validDataCollectionDataTypes.includes(dataType as DataCollectionDataType)

export const isValidDataType = (dataType: DataType) =>
  isString(dataType) && validDataTypes.includes(dataType)

export const isValidDataTypeList = (dataTypes: DataType[]) : {
  valid: boolean;
  invalidTypes: DataType[];
} => {
  const valid = dataTypes.every(isValidDataType)
  const invalidTypes = dataTypes.filter(dataType => !validDataTypes.includes(dataType))
  return { valid, invalidTypes }
}

export const isNotValidDataTableDataType = complement(isValidDataTableDataType)
export const isNotValidRowValueListType = complement(isValidRowValueListType)
export const isNotRowValueListType = isNotValidRowValueListType
export const isNotValidDataCollectionDataType = complement(isValidDataCollectionDataType)
export const isNotValidDataType = complement(isValidDataType)
export const isNotValidDataTypeList = complement(isValidDataTypeList)

export const invalidDataTypeIdx = (dataTypes: DataType[]) =>
  dataTypes.findIndex(isNotValidDataType)

export const isValidPropName = (propName: string) =>
  isNonEmptyStr(propName) && strIsValidObjectKey(propName)

export const isValidPropNameList = (propNames: CellValue[]) =>
  propNames.every(isValidPropName)

export const isNotValidPropName = complement(isValidPropName)
export const isNotValidPropNameList = complement(isValidPropNameList)

export const invalidPropNameIdx = (propNames: CellValue[]) =>
  propNames.findIndex(isNotValidPropName)

export const typeIsRowValueList = (dataType: DataType) =>
  getRowValueListBaseType(dataType) !== 'invalid-list-type'


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

export const dataTypeFromRowValueListType = (rowListType: RowValueListType) =>
  `list:${rowListType}`

export const isReferencedDataType = (dataType: DataType) =>
  isString(dataType) && dataType.includes(':ref')

export const isLinkedDataType = (dataType: DataType) =>
  isString(dataType) && dataType.includes(':link')

export const isNotReferencedDataType = complement(isReferencedDataType)
export const isNotLinkedDataType = complement(isLinkedDataType)

export const getReferencedDataType = (
  dataType: DataType,
  cellMeta: CellMeta,
) => {
  if (isNotReferencedDataType(dataType)) {
    throw new Error(cellWarning(
      `Non referenced data type provided '${dataType}'`, cellMeta))
  }

  const refTokens = dataType.split(':')
  if (refTokens.length !== 2 || refTokens[1] !== 'ref') {
    throw new Error(cellWarning(
      `Invalid referenced data type: '${dataType}', should be DATA_TYPE:ref`, cellMeta))
  }

  const referencedDataType = refTokens[0] as DataType
  if (isNotValidDataType(referencedDataType)) {
    throw new Error(cellWarning(
      `Invalid referenced data type: '${dataType}', should be one of ${toJson(validDataTypes)}`, cellMeta))
  }
  return referencedDataType
}

export const getLinkidDataType = (
  dataType: DataType,
  cellMeta: CellMeta,
) => {
  if (isNotLinkedDataType(dataType)) {
    throw new Error(cellWarning(
      `Non linked data type provided '${dataType}'`, cellMeta))
  }

  const linkTokens = dataType.split(':')
  if (linkTokens.length !== 2 || linkTokens[1] !== 'link') {
    throw new Error(cellWarning(
      `Invalid linked data type: '${dataType}', should be DATA_TYPE:link`, cellMeta))
  }

  const linkedDataType = linkTokens[0] as DataType
  if (isNotValidDataType(linkedDataType)) {
    throw new Error(cellWarning(
      `Invalid linked data type: '${dataType}', should be one of ${toJson(validDataTypes)}`, cellMeta))
  }
  return linkedDataType
}

export const getReferencedData = (cellValue: CellValue, cellMeta: CellMeta) => {

  const cellText = cellValue?.toString()
  if (isNil(cellText) || cellText.trim() === '')
    throw new Error(cellWarning('Empty referenced data value', cellMeta))

  const referencedDataTokens = cellText.split(':')
  if (referencedDataTokens.length !== 2) {
    throw new Error(cellWarning(
      `Invalid referenced data value: '${cellText}', should be REF_NAME:REF_VALUE`, cellMeta))
  }

  const referencedDataKey = referencedDataTokens[0]
  if (isEmpty(referencedDataKey) || !strIsValidObjectKey(referencedDataKey)) {
    throw new Error(cellWarning(
      `Invalid referenced data key: '${referencedDataKey}', should be a valid object key`, cellMeta))
  }

  const referencedDataValue = referencedDataTokens[1]
  if (isEmpty(referencedDataValue)) {
    throw new Error(cellWarning(
      `Invalid referenced data value: '${referencedDataValue}', should not be empty`, cellMeta))
  }

  return { referencedDataKey, referencedDataValue }
}

export const getLinkedDataRef = (cellValue: CellValue, cellMeta: CellMeta) => {

  const cellText = cellValue?.toString()
  if (isNil(cellText) || cellText.trim() === '')
    throw new Error(cellWarning('Empty linked data value', cellMeta))

  const linkedDataTokens = cellText.split('.')
  if (linkedDataTokens.length !== 2) {
    throw new Error(cellWarning(
      `Invalid linked data referemce: '${cellText}', should be WORKSHEET_NAME:REF_KEY`, cellMeta))
  }

  const linkedDataSheetName = linkedDataTokens[0]
  if (isEmpty(linkedDataSheetName) || !strIsValidObjectKey(linkedDataSheetName)) {
    throw new Error(cellWarning(
      `Invalid linked data worksheet: '${linkedDataSheetName}' should be string`, cellMeta))
  }

  const linkedDataRefKey = linkedDataTokens[1]
  if (isEmpty(linkedDataRefKey)) {
    throw new Error(cellWarning(
      `Invalid linked data ref key: '${linkedDataRefKey}', should not be empty`, cellMeta))
  }

  return { linkedDataSheetName, linkedDataRefKey }
}






//--- Logging -----------------------------------------------------------------

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
): string =>  {
  const { reportWarnings = true } = parseOpts || {}
  if (reportWarnings) {
    console.warn(
      '\nParsing error:\n' +
      `   Worksheet: ${dataCellMeta.worksheetName}\n` +
      `   Row:${(dataCellMeta.rowNumber)} Col:${colNumToText(dataCellMeta.colNumber)}\n` +
      `   propName = '${dataCellMeta.propName}' | dataType = '${dataCellMeta.dataType}'\n` +
      `   ${msg}\n`
    )
  }
  return `${msg} -> WS:${dataCellMeta.worksheetName}, Row:${(dataCellMeta.rowNumber)} Col:${colNumToText(dataCellMeta.colNumber)}`
}

export const cellWarning = (
  msg: string,
  cellMeta: CellMeta,
  parseOpts?: ParseOptions
): string =>  {
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

export const rowWarning = (
  msg: string,
  rowMeta: RowMeta,
  parseOpts?: ParseOptions
): string =>  {
  const { reportWarnings = true } = parseOpts || {}
  if (reportWarnings) {
    console.warn(
      '\nParsing error:\n' +
      `   Worksheet: ${rowMeta.worksheetName} Row:${(rowMeta.rowNumber)}\n` +
      `   ${msg}\n`
    )
  }
  return `${msg} -> WS:${rowMeta.worksheetName}, Row:${(rowMeta.rowNumber)}`
}


//--- General Parsing Utils ---------------------------------------------------


export const rowIsDelimiter = (row: Row) =>
  row.getCell(1).toString().trim().startsWith('---')

export const worksheetHasFrontmatter = (ws: Worksheet, startingRow: number) => {
  const row = ws.getRow(startingRow)
  return rowIsDelimiter(row)
}

export const rowIsNotFrontMatterDelimiter = complement(rowIsDelimiter)
export const doesNotHaveFrontMatter = complement(worksheetHasFrontmatter)

export const passwordHash = (password: string) =>
  sha256().update(password).digest('hex')


// Allows usser to add worksheets to the file that won't be parsed
export const worksheetNotHidden = (ws: Worksheet) => ws.name[0] !== '.'

export const colNumToText = (colNum: number) =>
  colNumToTextMap[colNum] || `invalid column number ${colNum}`

export const shouldSkipDataCollectionRow = (rowValues: CellValue[]) =>
  rowValues[2]?.toString().trim() === '_skip_'

export const shouldSkipDataTableValue = (callValue: CellValue) =>
  callValue?.toString().trim() === '_skip_'

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
