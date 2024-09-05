import path from 'path'
import { fileURLToPath } from 'url'

import { equals, keys, omit } from 'ramda'
import { describe, test, expect, beforeEach, assert } from 'vitest'
import { Workbook, Worksheet } from 'exceljs'

import { objectsHaveSameKeys, passthrough, toJson } from '@stcland/utils'

import { expectedWorkbookData } from './expectedTestWorkbookData'
import { ParsedWorksheetResult, PropType, WorksheetParseOptions } from '../src/WorksheetParserTypes'
import { getWorksheetList } from '../src/spreadSheetParseUtils'
import { parseWorksheet } from '../src/parseWorksheet'
import {
  uuidEquals, dateEquals, passwordToHashEquals, expectedPasswordHashStr, ValidateFn,
  expectedUuidString
} from './testUtils'

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

interface ValidateOpts {
  expectAllUndefined: boolean | undefined,
  expectAllErrors: boolean | undefined
}

describe('Test Worksheet Parser', () => {
  test('Basic Parsing', () => {

    expect(workbook).toBeDefined()
    expect(worksheets).toBeDefined()

    const parseOpts: WorksheetParseOptions = {
      reportProgress: true,
      reportWarnings: false
    }

    const firstRowOffset = 1
    for (const sheet of worksheets) {

      const parsedWorksheet = parseWorksheet(sheet, firstRowOffset, parseOpts)
      const expectedWorksheetData = expectedWorkbookData[sheet.name]

      if (!expectedWorksheetData) {
        console.log(`    No expected data for worksheet: ${sheet.name} (skipping)`)
        continue
      }

      // console.log('parsedWorksheet: ', parsedWorksheet)
      assertParsedWorksheet(expectedWorksheetData, parsedWorksheet, sheet.name)
    }
  })
})

const assertParsedWorksheet = (
  expectedWorksheetData: any[],
  parsedWorksheet: ParsedWorksheetResult,
  worksheetName: string
) => {


  const { data: parsedData, dataTypes } = parsedWorksheet

  expect(parsedData.length).toEqual(expectedWorksheetData.length)

  for (const [idx, expectedRowEntry] of expectedWorksheetData.entries()) {

    const { expectAllUndefined, expectAllErrors } = expectedRowEntry
    const validateOpts: ValidateOpts = { expectAllUndefined,  expectAllErrors }

    const parsedRow = parsedData[idx]
    const expectedRow = omit(['expectAllUndefined', 'expectAllErrors'], expectedRowEntry)

    // Make sure that we have exact match in expected vs parsed properties
    const failureMsg =
      `\nWS:${worksheetName}: Parsed data does not have same keys as expected` +
      `\nexpected data keys: ${toJson(keys(expectedRow))}` +
      `\nparsed data keys: ${toJson(keys(parsedRow))}`

    expect(
      objectsHaveSameKeys(expectedRow, parsedRow), failureMsg
    ).toEqual(true)

    assertParsedRow(
      parsedRow, expectedRow, dataTypes, worksheetName, validateOpts
    )
  }
}

const assertParsedRow = (
  parsedRow: any,
  expectedRow: any,
  dataTypes: Record<string, any>,
  worksheetName: string,
  validateOpts: ValidateOpts,
) => {

  const entryKey = expectedRow.key

  // loop through each key in the expected data entry and validate the parsed data
  for (const propName of keys(expectedRow).map(String)) {

    const expectedProp = expectedRow[propName]
    const parsed = parsedRow[propName]

    const propType = dataTypes[propName]
    const {
      validateFn, expectedValForLoggingFn, parsedValForLoggingFn
    } = propTypeToTestFns(propType, validateOpts)


    const failureMsg =
      `\nWS:${worksheetName}, entry:${entryKey}, prop: ${propName}` +
      `\n  expected value: ${expectedValForLoggingFn(expectedProp)}` +
      `\n  parsed value: ${parsedValForLoggingFn(parsed)}\n`

    expect(
      validateFn(expectedProp, parsed), failureMsg
    ).toEqual(true)
  }
}

const propTypeToTestFns = (propType: PropType, validateOpts: ValidateOpts) => {

  const { expectAllUndefined, expectAllErrors } = validateOpts

  // defaults
  let validateFn: ValidateFn = equals
  let expectedValForLoggingFn = passthrough
  let parsedValForLoggingFn = passthrough

  // For special test casee defaults are correct
  if ( expectAllUndefined || expectAllErrors)
    return { validateFn, expectedValForLoggingFn, parsedValForLoggingFn }

  switch (propType) {

  case 'date':
    validateFn = dateEquals
    parsedValForLoggingFn = (d: Date) => d.toISOString()
    break
  case 'password':
    validateFn = passwordToHashEquals
    expectedValForLoggingFn = expectedPasswordHashStr
    break
  case 'json':
    parsedValForLoggingFn = toJson
    expectedValForLoggingFn = toJson
    break
  case 'uuid':
    validateFn = uuidEquals
    expectedValForLoggingFn = expectedUuidString
    break
  }

  return { validateFn, expectedValForLoggingFn, parsedValForLoggingFn }
}
