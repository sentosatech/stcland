import { Workbook } from 'exceljs'
import { pathExists } from 'path-exists'

import type { ForEachSheet } from './SpreadsheetParserTypes'
import { getWorksheetList } from './spreadsheetParseUtils'
import { parseWorksheet } from './parseWorksheet'

export const forEachSheet: ForEachSheet = async (
  cb, spreadSheetPath, clientDatas, parseOpts = {}, firstRowNum = 1
) => {

  const spreadsheetExists = await pathExists(spreadSheetPath)
  if (!spreadsheetExists)
    throw new Error(`forEachSheet(): Spreadsheet file not found: ${spreadSheetPath}`)

  const workbook = new Workbook()
  await workbook.xlsx.readFile(spreadSheetPath)
  const worksheets = getWorksheetList(workbook)

  for (const ws of worksheets) {
    const parsedWorksheet = parseWorksheet(ws, parseOpts, firstRowNum)
    const rsp = await cb(parsedWorksheet, clientDatas)
    if (rsp === false) break
  }
}
