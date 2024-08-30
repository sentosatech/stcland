import path from 'path'
import { fileURLToPath } from 'url';

import { Workbook, Worksheet } from 'exceljs'
import { describe, test, expect, beforeEach, assert } from 'vitest'

import { getWorksheetList } from '../src/spreadSheetUtils'
import { parseWorksheet } from '../src/parseWorksheet'

import { startingRow, worksheetHasArangoData } from '../src/arangoSpreadsheetLoader'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workbookPath = path.join(__dirname, 'test-wb-arango.xlsx');

let workbook: Workbook
let sheets: Worksheet[] = []

beforeEach(async () => {
  workbook = new Workbook()
  await workbook.xlsx.readFile(workbookPath)
  sheets = getWorksheetList({
    wb: workbook,
    filterFns: [worksheetHasArangoData]})
})

describe('Test Worksheet Parser', () => {
  test('Basic Parsing', () => {

    expect(workbook).toBeDefined()
    expect(sheets).toBeDefined()

    const firstRowOffset = startingRow
    for (const sheet of sheets) {
      const parsedData = parseWorksheet({
        ws: sheet, firstRowOffset, log: true
      })
    }

  })
})

