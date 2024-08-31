import path from 'path'
import { fileURLToPath } from 'url'

import { Workbook, Worksheet } from 'exceljs'
import { describe, test, expect, beforeEach, assert } from 'vitest'

import { ParseWorksheetOptions } from '../src/SpreadSheetLoaderTypes'
import { getWorksheetList } from '../src/spreadSheetUtils'
import { parseWorksheet } from '../src/parseWorksheet'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const workbookPath = path.join(__dirname, 'test-wb-parsing.xlsx')

let workbook: Workbook
let worksheets: Worksheet[] = []

beforeEach(async () => {
  workbook = new Workbook()
  await workbook.xlsx.readFile(workbookPath)
  worksheets = getWorksheetList(workbook)
})

describe('Test Worksheet Parser', () => {
  test('Basic Parsing', () => {

    expect(workbook).toBeDefined()
    expect(worksheets).toBeDefined()

    const parseOpts: ParseWorksheetOptions = {
      reportProgress: true,
      reportWarnings: false
    }

    const firstRowOffset = 1
    for (const sheet of worksheets) {
      const parsedData = parseWorksheet(sheet, firstRowOffset, parseOpts)
    }
  })
})

