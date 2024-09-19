
import { pathExists } from 'path-exists'

import { canConnectToDbServer, getDb } from '../utils/arangoUtils'

import {
  type LoadWorksheetData, type LoadSpreadsheetData,
  type ArangoDataLoaderMeta, type ArangoDataLoaderClientData,
  IfTargetDbDoesNotExist, IfTargetCollectionDoesNotExist, ValidWorksheetTypes,
} from './ArangoDataLoaderTypes'

import { forEachSheet } from '@stcland/spreadsheet-parser'
import {
  CollectionType,
  IfCollectionDoesNotExistOnGet,
  IfDbDoesNotExistOnGet,
  getCollection
} from '../utils'
import { throwIf } from '@stcland/errors'
import { toJson } from '@stcland/utils'

export const loadSpreadsheetData: LoadSpreadsheetData = async (
  excelFilePath, arangoHostConfig, dbName, opts
) => {

  const {
    ifTargetDbDoesNotExist = IfTargetDbDoesNotExist.Create,
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
  const ifDbExistsOnGet = ifTargetDbDoesNotExist as IfDbDoesNotExistOnGet
  const db = await getDb(arangoHostConfig, dbName, ifDbExistsOnGet, dbUsers)

  const clientData: ArangoDataLoaderClientData = { db, opts }

  // OK, loop through the worksheets and load the data appropriratly
  await forEachSheet(loadWorksheetData, excelFilePath, clientData, opts)

  return 0
}

export const loadWorksheetData: LoadWorksheetData = async (
  parsedWorksheet,
  clientData: ArangoDataLoaderClientData,
) => {

  const {
    meta = {}, data, sheetName,
  } = parsedWorksheet

  const { type } = meta as ArangoDataLoaderMeta
  const { db, opts } = clientData

  const {
    ifTargetCollectionDoesNotEist = IfTargetCollectionDoesNotExist.Create,
    validateEdgeTargets = true
  } = opts

  throwIf(!type,
    `ArangoSpreadSheet loader -> worksheet ${sheetName}:\n` +
    'does note have property "type" in its metadata section (or is missing metadata section)'
  )

  throwIf(!ValidWorksheetTypes.includes(type),
    `ArangoSpreadSheet loader -> worksheet ${sheetName}:\n` +
    `  Invaaid worksheet type '${type}'\n` +
    `  Must be one of ${toJson(ValidWorksheetTypes.join(', '))}`
  )

  if ( type === 'graph') {
    console.warn(
      `ArangoSpreadSheet loader -> worksheet ${sheetName}:\n` +
      'Graphs are not yet supported'
    )
  }

  const collectionName = sheetName

  const ifCollectionDoesNotExistOnGet =
    // @ts-expect-error cause TS is a pain in the ass
    ifTargetCollectionDoesNotEist as IfCollectionDoesNotExistOnGet

  const typeMap: Record<'docCollection' | 'edgeCollection', CollectionType> = {
    docCollection: CollectionType.DOCUMENT_COLLECTION,
    edgeCollection: CollectionType.EDGE_COLLECTION,
  }
  const collectionType: CollectionType = typeMap[type]

  const collection = await getCollection(
    db, collectionName, ifCollectionDoesNotExistOnGet, collectionType
  )

  console.log('validateEdgeTargets: ', validateEdgeTargets)
  if (collectionType == CollectionType.EDGE_COLLECTION && validateEdgeTargets) {
    for (const { _from, _to } of data) {
      console.log('_from: ', _from)
      console.log('_to: ', _to)
      if (!collection) console.log('null connection dude')
      // const fromExists = await collection.documentExists(_from)
      // const toExists = await collection.documentExists(_to)
      // console.log('fromExists: ', fromExists)
      // console.log('toExists: ', toExists)
    }
  }


  await collection.import(data)

}
