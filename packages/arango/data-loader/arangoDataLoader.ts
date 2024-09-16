
import { pathExists } from 'path-exists'

import { canConnectToDbServer, createDb } from '../utils/arangoUtils'

import {
  type LoadWorksheetData, type LoadSpreadsheetData,
  IfTargertDbDoesNotExist, // IfTargetCollectionDoesNotExist,
} from './ArangoDataLoaderTypes'

import { forEachSheet } from '@stcland/spreadsheet-parser'

export const loadExcelData: LoadSpreadsheetData = async (
  excelFilePath, arangoHostConfig, dbName, opts
) => {

  const {
    ifTargetDbDoesNotExist = IfTargertDbDoesNotExist.Create,
    // ifTargetCollectionExists = IfTargetCollectionDoesNotExist.Create,
    dbUsers = [],
  } = opts

  // Lets make sure the file actually exists
  const spreadsheetExists = await pathExists(excelFilePath)
  if (!spreadsheetExists)
    throw new Error(`Arango spreadsheet loader: Spreadsheet file not found: ${excelFilePath}`)

  // lets make surfe that we can connect to the arango host
  const canConnect = await canConnectToDbServer(arangoHostConfig)
  if (!canConnect)
    throw new Error(`Arango spreadsheet loader: Cannot connect to Arango host: ${arangoHostConfig.url}`)

  // get the requeseted db
  const db = await createDb(
    arangoHostConfig, dbName, dbUsers, IfTargertDbDoesNotExist[ifTargetDbDoesNotExist]
  )

  const clientData: any = { db }

  // OK, loop through the worksheets and load the data appropriratly
  await forEachSheet(excelFilePath, loadWorksheetData, clientData, opts)

  return 0
}

export const loadWorksheetData: LoadWorksheetData = async (
  parsedWorksheet, clientData
) => {
  console.log('~~> loadWorksheetData()')

}
