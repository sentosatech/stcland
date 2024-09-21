import { describe, test, expect, beforeEach, beforeAll, assert } from 'vitest'

import path from 'path'
import { fileURLToPath } from 'url'

import { pathExists } from 'path-exists'
import { any, keys, omit } from 'ramda'

import { Workbook, Worksheet } from 'exceljs'

import {  allDefinedOrAllUndefined, objectsHaveSameKeys, toJson } from '@stcland/utils'

import { expectedSpreadsheetResults } from './expectedParsedSpreadsheetResults'
import {
  DataType, ParsedWorksheetResult, ParseOptions, MetaTypes, DataTypes,
  DataTableData, DataListData, Meta, Data
} from '../src/SpreadsheetParserTypes'

import { getWorksheetList } from '../src/spreadsheetParseUtils'
import type { ValidateOpts } from './testUtils'
import { assertConsistentDefinedState, propTypeToTestFns } from './testUtils'
import { forEachSheet } from '../src/parseSpreadsheet'
import { isUndefined } from 'ramda-adjunct'

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

    const parseOpts: ParseOptions = { reportProgress: true, reportWarnings: false  }
    await forEachSheet(assertParsedWorksheet, spreadsheetPath, testMeta, parseOpts)

  })
})

//-------------------------------------------------------------------------

const assertParsedWorksheet = async (
  parsedWorksheet: ParsedWorksheetResult,
  clientData: TestMeta
) => {

  const {
    worksheetName,
    dataLayout,
    numDataRowsParsed,
    data: parsedData,
    dataTypes: parsedDataTypes,
    meta: parsedMeta,
    metaTypes: parsedMetaTypes
  } = parsedWorksheet

  const expectedParsedWorksheet = expectedSpreadsheetResults[worksheetName]

  if (!expectedParsedWorksheet) {
    console.log(`    No expected data for worksheet: ${worksheetName} (skipping)`)
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
  expect(worksheetName).toEqual(expectedSheetName)
  expect(dataLayout).toEqual(expectedDataLayout)
  expect(numDataRowsParsed).toEqual(expectedNumDataRowsParsed)

  assertParsedWorkSheetMetaTypes(
    expectedMetaTypes, parsedMetaTypes, worksheetName
  )

  assertParsedWorkSheetMeta(
    expectedMeta, expectedMetaTypes, parsedMeta, parsedMetaTypes, worksheetName
  )

  assertParsedWorksheetDataTypes(
    expectedDataTypes, parsedDataTypes, worksheetName
  )

  switch (dataLayout) {
  case 'dataList':
    assertParsedWorksheetListData(
      expectedData as DataListData,
      parsedData as DataListData,
      expectedDataTypes, parsedDataTypes, worksheetName
    )
    break
  case 'dataTable':
    assertParsedWorksheetTableData(
      expectedData as DataTableData,
      parsedData as DataTableData,
      expectedDataTypes, parsedDataTypes, worksheetName
    )
    break
  case 'frontMatterOnly':
    break // no data to check
  default:
    throw new Error(`Unknown data layout: ${dataLayout}`)
  }
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
      secondDefinedButNotFirstMsg: 'expectedMetaTypes is undefined but parsedMetaTypes is defined'
    })

  // all inputs should be eithyer all defined or all undefined
  const testInputs = [expectedMeta, parsedMeta, expectedMetaTypes, parsedMetaTypes]
  if (!allDefinedOrAllUndefined(...testInputs)) {
    assert(false,
      `assertParsedWorkSheetMeta(): WS:${worksheetName}: \n` +
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
  expectedData: DataTableData | undefined,
  pasredData: DataTableData | undefined,
  expectedDataTypes: DataTypes | undefined,
  parsedDataTypes: DataTypes | undefined,
  worksheetName: string
) => {

  assertConsistentDefinedState(
    worksheetName, expectedData, pasredData, {
      firstDefinedButNotSecondMsg: 'expectedData is defined but pasreedData is undefined',
      secondDefinedButNotFirstMsg: 'expectedData is undefined but pasreedData is defined'
    })

  assertConsistentDefinedState(
    worksheetName, expectedDataTypes, expectedDataTypes, {
      firstDefinedButNotSecondMsg: 'expectedDataTypes is defined but expectedDataTypes is undefined',
      secondDefinedButNotFirstMsg: 'expectedDataTypes is undefined but expectedDataTypes is defined'
    })

  // all inputs should be eithyer all defined or all undefined
  const testInputs = [expectedData, pasredData, expectedDataTypes, parsedDataTypes]
  if (!allDefinedOrAllUndefined(...testInputs)) {
    assert(false,
      `assertParsedWorksheetTableData(): WS:${worksheetName}: \n` +
      'All expectedMeta, parsedMeta, expectedMetaTypes, parsedMetaTypes ' +
      'should be defined or all should be undefined')
  }

  if (!expectedData) return

  expect(pasredData!.length).toEqual(expectedData.length)

  for (const [idx, expectedRowEntry] of expectedData.entries()) {

    const { expectAllUndefined, expectAllErrors } = expectedRowEntry
    const validateOpts: ValidateOpts = { expectAllUndefined,  expectAllErrors }

    const parsedRowData = pasredData![idx]
    const expectedRowData = omit(['expectAllUndefined', 'expectAllErrors'], expectedRowEntry)

    expect(
      objectsHaveSameKeys(expectedRowData, parsedRowData),
      `\nWS:${worksheetName}: Parsed data does not have same keys as expected\n` +
      `  expected data keys: ${toJson(keys(expectedRowData))}\n` +
      `  parsed data keys: ${toJson(keys(parsedRowData))}\n`

    ).toEqual(true)

    assertParsedData(
      parsedRowData, expectedRowData, expectedDataTypes, worksheetName, validateOpts
    )
  }
}

//-------------------------------------------------------------------------

const assertParsedData = (
  parsedRowData: Data | undefined,
  expectedRowData: Data | undefined,
  dataTypes: DataTypes | undefined,
  worksheetName: string,
  validateOpts: ValidateOpts,
) => {


  if (any(isUndefined, [parsedRowData, expectedRowData, dataTypes]))
    throw new Error('assertParsedRow(): All inputs should be defined')

  const entryKey = expectedRowData!.key

  // loop through each key in the expected data entry and validate the parsed data
  for (const propName of keys(expectedRowData!).map(String)) {

    const expectedProp = expectedRowData![propName]
    const parsedProp = parsedRowData![propName]

    const propType = dataTypes![propName]
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

//-------------------------------------------------------------------------

const assertParsedWorksheetListData = (
  expectedData: DataListData | undefined,
  parsedData: DataListData | undefined,
  expectedDataTypes: DataTypes | undefined,
  parsedDataTypes: DataTypes | undefined,
  worksheetName: string
) => {

  assertConsistentDefinedState(
    worksheetName, expectedData, parsedData, {
      firstDefinedButNotSecondMsg: 'expectedData is defined but pasreedData is undefined',
      secondDefinedButNotFirstMsg: 'expectedData is undefined but pasreedData is defined'
    })

  assertConsistentDefinedState(
    worksheetName, expectedDataTypes, expectedDataTypes, {
      firstDefinedButNotSecondMsg: 'expectedDataTypes is defined but expectedDataTypes is undefined',
      secondDefinedButNotFirstMsg: 'expectedDataTypes is undefined but expectedDataTypes is defined'
    })

  // all inputs should be either all defined or all undefined
  const testInputs = [expectedData, parsedData, expectedDataTypes, parsedDataTypes]
  if (!allDefinedOrAllUndefined(...testInputs)) {
    assert(false,
      `assertParsedWorksheetListData(): WS:${worksheetName}: \n` +
      'All expectedMeta, parsedMeta, expectedMetaTypes, parsedMetaTypes ' +
      'should be defined or all should be undefined')
  }

  if (!expectedData) return

  expect(
    objectsHaveSameKeys(expectedData, parsedData!),
    `\nWS:${worksheetName}: Parsed data does not have same keys as expected\n` +
    `  expected data keys: ${toJson(keys(expectedData))}\n` +
    `  parsed data keys: ${toJson(keys(parsedData!))}\n`
  ).toEqual(true)

  const { expectAllUndefined, expectAllErrors } = expectedData
  const validateOpts: ValidateOpts = { expectAllUndefined,  expectAllErrors }
  assertParsedData(
    parsedData, expectedData, expectedDataTypes, worksheetName, validateOpts
  )
}
