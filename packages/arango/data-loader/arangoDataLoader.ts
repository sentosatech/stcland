
import { pathExists } from 'path-exists'

import { canConnectToDbServer, createDb } from '../utils/arangoUtils'

import {
  type LoadWorksheetData, type LoadSpreadsheetData,
  // IfTargetDbDoesNotExist,
   // IfTargetCollectionDoesNotExist,
} from './ArangoDataLoaderTypes'

import { forEachSheet } from '@stcland/spreadsheet-parser'
import { IfDbExistsOnCreate } from '../utils'

export const loadSpreadsheetData: LoadSpreadsheetData = async (
  excelFilePath, arangoHostConfig, dbName, opts
) => {

  const {
    // ifTargetDbExistsDelMe = IfTargetDbExistsDelMe.Append,
    // ifTargetDbDoesNotExist = IfTargetDbDoesNotExist.Create,
    dbUsers = [],
  } = opts

  // Lets make sure the file actually exists
  const spreadsheetExists = await pathExists(excelFilePath)
  if (!spreadsheetExists)
    throw new Error(`Arango spreadsheet loader: Spreadsheet file not found: ${excelFilePath}`)

  // lets make sure that we can connect to the arango host
  const canConnect = await canConnectToDbServer(arangoHostConfig)
  if (!canConnect)
    throw new Error(`Arango spreadsheet loader: Cannot connect to Arango host: ${arangoHostConfig.url}`)

  // @ts-expect-error cause TS is a pain in the ass
  const ifDbExistsOnCreate = ifTargetDbExistsDelMe as IfDbExistsOnCreate
  const db = await createDb(
    arangoHostConfig, dbName, dbUsers, ifDbExistsOnCreate
  )

  const clientData: any = { db }

  // OK, loop through the worksheets and load the data appropriratly
  await forEachSheet(excelFilePath, loadWorksheetData, clientData, opts)

  return 0
}

export const loadWorksheetData: LoadWorksheetData = async (
  parsedWorksheet, clientData
) => {

  // const {
  //   rowsParsed, data, meta, sheetName: collectionName
  // } = parsedWorksheet

  // const { db } = clientData

  // get the collection

}
