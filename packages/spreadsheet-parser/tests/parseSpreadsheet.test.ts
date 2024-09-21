import { describe, test, expect, beforeEach, beforeAll, assert } from 'vitest'

import path from 'path'
import { fileURLToPath } from 'url'

import { pathExists } from 'path-exists'
import { all, keys, omit } from 'ramda'

import { Workbook, Worksheet } from 'exceljs'

import {  allDefinedOrAllUndefined, objectsHaveSameKeys, toJson } from '@stcland/utils'

import { expectedSpreadsheetResults } from './expectedParsedSpreadsheetResults'
import {
  DataType, ParsedWorksheetResult, ParseOptions, MetaTypes, DataTypes,
  DataTableData, DataListData,
  Meta
} from '../src/SpreadsheetParserTypes'

import { getWorksheetList } from '../src/spreadsheetParseUtils'
import type { ValidateOpts } from './testUtils'
import { assertConsistentDefinedState, propTypeToTestFns } from './testUtils'
import { forEachSheet } from '../src/parseSpreadsheet'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const spreadsheetPath = path.join(__dirname, 'test-spreadsheet-parsing.xlsx')

let workbook: Workbook
let worksheets: Worksheet[] = []


beforeAll(async () => {
  const spreadsheetExists = await pathExists(spreadsheetPath)
  if (!spreadsheetExists)
    throw new Error(`Spreadsheet file not found: ${spreadsheetPath}`)
})


beforeEach(async () => {
  workbook = new Workbook()
  await workbook.xlsx.readFile(spreadsheetPath)
  worksheets = getWorksheetList(workbook)
})

//-------------------------------------------------------------------------

interface TestMeta { message: string }

const testMeta: TestMeta = { message: 'Im testing over here' }

describe('Test Spreadsheet Parser', () => {

  test('forEach worksheet', async () => {

    const parseOpts: ParseOptions = { reportProgress: false, reportWarnings: false  }
    await forEachSheet(assertParsedWorksheet, spreadsheetPath, testMeta, parseOpts)

  })
})

//-------------------------------------------------------------------------

const assertParsedWorksheet = async (
  parsedWorksheet: ParsedWorksheetResult,
  clientData: TestMeta
) => {

  const {
    worksheetName: sheetName,
    dataLayout,
    numDataRowsParsed,
    data: parsedData,
    dataTypes: parsedDataTypes,
    meta: parsedMeta,
    metaTypes: parsedMetaTypes
  } = parsedWorksheet

  const expectedParsedWorksheet = expectedSpreadsheetResults[sheetName]

  if (!expectedParsedWorksheet) {
    console.log(`No expected data for worksheet: ${sheetName} (skipping)`)
    return true
  }

  const {
    worksheetName: expectedSheetName,
    dataLayout: expectedDataLayout,
    numDataRowsParsed: expectedNumDataRowsParsed,
    data: expectedData,
    dataTypes: expectedDataTypes,
    meta: expectedMeta,
    metaTypes: expectedMetaTypes
  } = expectedParsedWorksheet

  expect(clientData.message).toEqual(testMeta.message)
  expect(sheetName).toEqual(expectedSheetName)
  expect(dataLayout).toEqual(expectedDataLayout)
  expect(numDataRowsParsed).toEqual(expectedNumDataRowsParsed)

  assertParsedWorkSheetMetaTypes(
    expectedMetaTypes, parsedMetaTypes, sheetName
  )

  assertParsedWorkSheetMeta(
    expectedMeta, expectedMetaTypes, parsedMeta, parsedMetaTypes, sheetName
  )

  assertParsedWorksheetDataTypes(
    expectedDataTypes, parsedDataTypes, sheetName
  )

  assertParsedWorksheetTableData(
    expectedData, parsedData, expectedDataTypes, parsedDataTypes, sheetName
  )

  return true
}

//-------------------------------------------------------------------------

const assertParsedWorkSheetMetaTypes = (
  expectedMetaTypes: MetaTypes | undefined,
  parsedMetaTypes: MetaTypes | undefined,
  worksheetName: string
) => {


  assertConsistentDefinedState(
    worksheetName, expectedMetaTypes, parsedMetaTypes, {
      firstDefinedButNotSecondMsg: 'expectedMetaTypes is defined but parsedMetaTypes is undefined',
      secondDefinedButNotFirstMsg: 'expectedMetaTypes is undefined but parsed metaTypes is defined'
    })

  const expectedMetaTypeKeys = keys(expectedMetaTypes || {})
  const parsedMetaTypeKeys = keys(parsedMetaTypes  || {})

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
      parsedMetaTypes![expectedKey],
      `WS:${worksheetName}: \n` +
      `  Expected metaTypes type for key ${expectedKey}: ${parsedMetaTypes![expectedKey]}\n` +
      `  does not match parsed metaType type: ${parsedMetaTypes![expectedKey]}`
    ).toEqual(expectedMetaTypes![expectedKey])
  }
}

//-------------------------------------------------------------------------

const assertParsedWorksheetDataTypes = (
  expectedDataTypes: DataTypes | undefined,
  parsedDataTypes: DataTypes | undefined,
  worksheetName: string
) => {

  assertConsistentDefinedState(
    worksheetName, expectedDataTypes, parsedDataTypes, {
      firstDefinedButNotSecondMsg: 'expectedDataTypes is defined but parsedDataTypes is undefined',
      secondDefinedButNotFirstMsg: 'expectedDataTypes is undefined but parsed dataTypes is defined'
    })

  if (!expectedDataTypes) return

  const expectedDataKeys = keys(expectedDataTypes!)
  const parsedDataKeys = keys(parsedDataTypes!)

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
      parsedDataTypes![expectedKey],
      `WS:${worksheetName}: \n` +
      `  Expected data type for key ${expectedKey}: ${parsedDataTypes![expectedKey]}\n` +
      `  does not match parsed data type: ${parsedDataTypes![expectedKey]}`
    ).toEqual(expectedDataTypes![expectedKey])
  }
}

//-------------------------------------------------------------------------

const assertParsedWorkSheetMeta = (
  expectedMeta: Meta | undefined,
  expectedMetaTypes: MetaTypes | undefined,
  parsedMeta: Meta | undefined,
  parsedMetaTypes: MetaTypes | undefined,
  worksheetName: string
) => {


  assertConsistentDefinedState(
    worksheetName, expectedMeta, parsedMeta, {
      firstDefinedButNotSecondMsg: 'expectedMeta is defined but parsedMeta is undefined',
      secondDefinedButNotFirstMsg: 'expectedMeta is undefined but parsedMeta is defined'
    })

  assertConsistentDefinedState(
    worksheetName, expectedMetaTypes, parsedMetaTypes, {
      firstDefinedButNotSecondMsg: 'expectedMetaTypes is defined but parsedMetaTypes is undefined',
      secondDefinedButNotFirstMsg: 'expectedMetaTypes is undefined but parsed parsedMetaTypes is defined'
    })

  // all inputs should be eithyer all defined or all undefined
  const testInputs = [expectedMeta, parsedMeta, expectedMetaTypes, parsedMetaTypes]
  if (!allDefinedOrAllUndefined(...testInputs)) {
    assert(false,
      `WS:${worksheetName}: \n` +
      'All expectedMeta, parsedMeta, expectedMetaTypes, parsedMetaTypes ' +
      'should be defined or all should be undefined')
  }

  if (!expectedMeta) return

  expect(
    objectsHaveSameKeys(expectedMeta!, parsedMeta!),
    `WS:${worksheetName}: \n` +
    '  Expected meta does not have same keys as parsed meta\n' +
    `  expected meta keys: ${toJson(keys(expectedMeta!))}` +
    `  parsed meta keys: ${toJson(keys(parsedMeta!))}`
  ).toEqual(true)

  const expectedMetaKeys = keys(expectedMeta!)
  const parsedMetaKeys = keys(parsedMeta || {})


  for (const expectedKey of expectedMetaKeys) {

    const propType = parsedMetaTypes![expectedKey]
    const expectedVal = expectedMeta![expectedKey]
    const parsedVal = parsedMeta![expectedKey]

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

const assertParsedWorksheetTableData = (
  expectedData: DataTableData | DataListData | undefined,
  data: DataTableData | DataListData | undefined,
  dataTypes: DataTypes | undefined,
  worksheetName: string
) => {

  if (!expectedData) { expect(
    data, `WS:${worksheetName}: Expected data is undefined but parsed data is defined`
  ).toBeUndefined()
  return
  }

  if (!data) { expect(
    data, `WS:${worksheetName}: Expected data is defined but parsed data is undefined`
  ).toBeDefined()
  return
  }

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


