import { Workbook } from 'exceljs'
import { pathExists } from 'path-exists'

import type { ForEachSheet } from './SpreadsheetParserTypes'
import { getWorksheetList } from './spreadsheetParseUtils'
import { parseWorksheet } from './parseWorksheet'

export const forEachSheet: ForEachSheet = async (
  cb, spreadsheetPath, clientDatas, parseOpts = {}, firstRowNum = 1
) => {

  const spreadsheetExists = await pathExists(spreadsheetPath)
  if (!spreadsheetExists)
    throw new Error(`forEachSheet(): Spreadsheet file not found: ${spreadsheetPath}`)

  const workbook = new Workbook()
  await workbook.xlsx.readFile(spreadsheetPath)
  const worksheets = getWorksheetList(workbook)

  const referencedData = {}

  for (const ws of worksheets) {
    const parsedWorksheet = parseWorksheet(ws, referencedData, parseOpts, firstRowNum)
    const rsp = await cb(parsedWorksheet, clientDatas)
    if (rsp === false) break
  }
}
