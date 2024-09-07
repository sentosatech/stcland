import path from 'path'
import { fileURLToPath } from 'url'

import { keys, omit } from 'ramda'
import { describe, test, expect, beforeEach, } from 'vitest'
import { Workbook, Worksheet } from 'exceljs'

import { objectsHaveSameKeys, toJson } from '@stcland/utils'

import { expectedTestWorkbookResults } from './expectedParsedWorkbookResults'
import { DataType, WorksheetParseOptions } from '../src/WorksheetParserTypes'
import { getWorksheetList } from '../src/spreadSheetParseUtils'
import { parseWorksheet } from '../src/parseWorksheet'
import type { ValidateOpts } from './testUtils'
import { propTypeToTestFns } from './testUtils'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const workbookPath = path.join(__dirname, 'test-ws-parsing.xlsx')

let workbook: Workbook
let worksheets: Worksheet[] = []

beforeEach(async () => {
  workbook = new Workbook()
  await workbook.xlsx.readFile(workbookPath)
  worksheets = getWorksheetList(workbook)
})

//-------------------------------------------------------------------------

describe('Test Worksheet Parser', () => {
  test('Basic Parsing', () => {

    expect(workbook).toBeDefined()
    expect(worksheets).toBeDefined()

    const parseOpts: WorksheetParseOptions = {
      reportProgress: false,
      reportWarnings: false
    }

    const firstRowOffset = 1
    for (const sheet of worksheets) {

      const parsedWorksheet = parseWorksheet(sheet, firstRowOffset, parseOpts)
      const expectedParsedWorksheet = expectedTestWorkbookResults[sheet.name]

      if (!expectedParsedWorksheet) {
        console.log(`    No expected data for worksheet: ${sheet.name} (skipping)`)
        continue
      }

      const {
        data: expectedData,
        dataTypes: expectedDataTypes,
        meta: expectedMeta,
        metaTypes: expectedMetaTypes
      } = expectedParsedWorksheet

      const {
        data: parsedData,
        dataTypes: parsedDataTypes,
        meta: parsedMeta,
        metaTypes: parsedMetaTypes
      } = parsedWorksheet

      assertParsedWorkSheetMetaTypes(
        expectedMetaTypes, parsedMetaTypes, sheet.name
      )

      assertParsedWorkSheetMeta(
        expectedMeta, parsedMeta, parsedMetaTypes, sheet.name
      )

      assertParsedWorksheetDataTypes(
        expectedDataTypes, parsedDataTypes, sheet.name
      )

      assertParsedWorksheetData(
        expectedData, parsedData, parsedDataTypes, sheet.name
      )

    }
  })
})

//-------------------------------------------------------------------------

const assertParsedWorkSheetMetaTypes = (
  expectedMetaTypes: Record<string, DataType> | undefined,
  parsedMetaTypes: Record<string, DataType> | undefined,
  worksheetName: string
) => {

  if (!expectedMetaTypes) {
    expect(parsedMetaTypes,
      `WS:${worksheetName}: \n` +
      '  Expected metaTypes is undefined but parsed metaTypes is defined'
    ).toBeUndefined()
    return
  }

  if (!parsedMetaTypes) {
    expect(parsedMetaTypes,
      `WS:${worksheetName}: \n` +
      '  Expected metaTypes is defined but parsed metaTypes is undefined'
    ).toBeDefined()
    return
  }

  const expectedMetaTypeKeys = keys(expectedMetaTypes)
  const parsedMetaTypeKeys = keys(parsedMetaTypes)

  expect(
    parsedMetaTypeKeys.length,
    `WS:${worksheetName}: \n` +
    `  Number of parsed metaType keys ${parsedMetaTypeKeys.length} does not match expected ${expectedMetaTypeKeys.length}\n` +
    `  Parsed keys: ${toJson(parsedMetaTypeKeys)}\n` +
    `  Expected keys: ${toJson(expectedMetaTypeKeys)}\n`
  ).toEqual(expectedMetaTypeKeys.length)

  for (const expectedKey of expectedMetaTypeKeys) {

    expect(
      parsedMetaTypeKeys,
      `WS:${worksheetName}: \n` +
      `  Expected metaTypes key ${expectedKey} data is missing in from parsed metaTypes`
    ).toContain(expectedKey)

    expect(
      parsedMetaTypes[expectedKey],
      `WS:${worksheetName}: \n` +
      `  Expected metaTypes type for key ${expectedKey}: ${parsedMetaTypes[expectedKey]}\n` +
      `  does not match parsed metaType type: ${parsedMetaTypes[expectedKey]}`
    ).toEqual(expectedMetaTypes[expectedKey])
  }
}

//-------------------------------------------------------------------------

const assertParsedWorksheetDataTypes = (
  expectedDataTypes: Record<string, DataType>,
  parsedDataTypes: Record<string, DataType>,
  worksheetName: string
) => {

  const expectedDataKeys = keys(expectedDataTypes)
  const parsedDataKeys = keys(parsedDataTypes)

  expect(
    parsedDataKeys.length,
    `WS:${worksheetName}: \n` +
    `  Number of parsed dataType keys ${parsedDataKeys.length} does not match expected ${expectedDataKeys.length}\n` +
    `  Parsed keys: ${toJson(parsedDataKeys)}\n` +
    `  Expected keys: ${toJson(expectedDataKeys)}\n`
  ).toEqual(expectedDataKeys.length)

  for (const expectedKey of expectedDataKeys) {

    expect(
      parsedDataKeys,
      `WS:${worksheetName}: \n` +
      `  Expected data key ${expectedKey} data is missing in from parsed data`
    ).toContain(expectedKey)

    expect(
      parsedDataTypes[expectedKey],
      `WS:${worksheetName}: \n` +
      `  Expected data type for key ${expectedKey}: ${parsedDataTypes[expectedKey]}\n` +
      `  does not match parsed data type: ${parsedDataTypes[expectedKey]}`
    ).toEqual(expectedDataTypes[expectedKey])

  }
}

//-------------------------------------------------------------------------

const assertParsedWorkSheetMeta = (
  expectedMeta: Record<string, any> | undefined,
  parsedMeta: Record<string, any> | undefined,
  parsedMetaTypes: Record<string, DataType> | undefined = {},
  worksheetName: string
) => {

  if (!expectedMeta) {
    expect(
      parsedMeta,
      `WS:${worksheetName}: \n` +
      '  Expected meta is undefined but parsed meta is defined\n' +
      `  parseMeta: ${toJson(parsedMeta)}`
    ).toBeUndefined()
    return
  }

  if (!parsedMeta) {
    expect(
      parsedMeta,
      `WS:${worksheetName}: \n` +
      '  Expected meta is defined but parsed meta is undefined\n' +
      `  expectedMeta: ${toJson(expectedMeta)}`
    ).toBeDefined()
    return
  }

  expect(
    objectsHaveSameKeys(expectedMeta, parsedMeta),
    `WS:${worksheetName}: \n` +
    '  Expected meta does not have same keys as parsed meta\n' +
    `  expected meta keys: ${toJson(keys(expectedMeta))}` +
    `  parsed meta keys: ${toJson(keys(parsedMeta))}`
  ).toEqual(true)

  const expectedMetaKeys = keys(expectedMeta)
  const parsedMetaKeys = keys(parsedMeta || {})


  for (const expectedKey of expectedMetaKeys) {

    const propType = parsedMetaTypes[expectedKey]
    const expectedVal = expectedMeta[expectedKey]
    const parsedVal = parsedMeta[expectedKey]

    const {
      validateFn, expectedValForLoggingFn, parsedValForLoggingFn
    } = propTypeToTestFns(propType)

    expect(
      validateFn(expectedVal, parsedVal),
      `\nWS:${worksheetName}, meta key: ${expectedKey}\n` +
      `  expected meta value: ${expectedValForLoggingFn(expectedVal)}\n` +
      `  parsed meta value: ${parsedValForLoggingFn(parsedVal)}`
    ).toEqual(true)
  }
}

//-------------------------------------------------------------------------

const assertParsedWorksheetData = (
  expectedData: any[],
  data: any[],
  dataTypes: Record<string, DataType>,
  worksheetName: string
) => {

  expect(data.length).toEqual(expectedData.length)

  for (const [idx, expectedRowEntry] of expectedData.entries()) {

    const { expectAllUndefined, expectAllErrors } = expectedRowEntry
    const validateOpts: ValidateOpts = { expectAllUndefined,  expectAllErrors }

    const parsedRowData = data[idx]
    const expectedRowData = omit(['expectAllUndefined', 'expectAllErrors'], expectedRowEntry)

    expect(
      objectsHaveSameKeys(expectedRowData, parsedRowData),
      `\nWS:${worksheetName}: Parsed data does not have same keys as expected\n` +
      `  expected data keys: ${toJson(keys(expectedRowData))}\n` +
      `  parsed data keys: ${toJson(keys(parsedRowData))}\n`

    ).toEqual(true)

    assertParsedRow(
      parsedRowData, expectedRowData, dataTypes, worksheetName, validateOpts
    )
  }
}

const assertParsedRow = (
  parsedRowData: any,
  expectedRowData: any,
  dataTypes: Record<string, DataType>,
  worksheetName: string,
  validateOpts: ValidateOpts,
) => {

  const entryKey = expectedRowData.key

  // loop through each key in the expected data entry and validate the parsed data
  for (const propName of keys(expectedRowData).map(String)) {

    const expectedProp = expectedRowData[propName]
    const parsedProp = parsedRowData[propName]

    const propType = dataTypes[propName]
    const {
      validateFn, expectedValForLoggingFn, parsedValForLoggingFn
    } = propTypeToTestFns(propType, validateOpts)

    expect(
      validateFn(expectedProp, parsedProp),
      `\nWS:${worksheetName}, entry:${entryKey}, prop: ${propName}` +
      `\n  expected value: ${expectedValForLoggingFn(expectedProp)}` +
      `\n  parsed value: ${parsedValForLoggingFn(parsedProp)}\n`
    ).toEqual(true)
  }
}


