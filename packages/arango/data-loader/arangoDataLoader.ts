import { isNil } from 'ramda'
import { pathExists } from 'path-exists'

import type {
  IfDbDoesNotExistOnGet,
} from '../utils'

import {
  CollectionType,
  canConnectToServer,
  getDb,
  getCollectionType, getDocCollection, getEdgeCollection,
  collectionExists, documentDoesNotExistById,
} from '../utils'

import type {
  LoadWorksheetData, LoadSpreadsheetData,
  ArangoDataLoaderMeta, ArangoDataLoaderClientData,
  LoadSpreadsheetDataOpts,
  IfTargetCollectionDoesNotExist,
} from './ArangoDataLoaderTypes'

import {
  validWorksheetTypes
} from './ArangoDataLoaderTypes'

import { type DataTableData, forEachSheet } from '@stcland/spreadsheet-parser'

import { throwIf } from '@stcland/errors'
import { toJson } from '@stcland/utils'
import { Database } from 'arangojs'

//------------------------------------------------------------------------------

export const loadSpreadsheetData: LoadSpreadsheetData = async (
  excelFilePath, arangoHostConfig, dbName, dataLoadOpts = {}
) => {

  const { users = [] } = dataLoadOpts
  const ifDbDoesNotExist: IfDbDoesNotExistOnGet =
    dataLoadOpts?.ifTargetDbDoesNotExist || 'Create'

  // Lets make sure the file actually exists
  const spreadsheetExists = await pathExists(excelFilePath)
  if (!spreadsheetExists)
    throw new Error(`Arango spreadsheet loader: Spreadsheet file not found: ${excelFilePath}`)

  // lets make sure that we can connect to the arango host
  const canConnect = await canConnectToServer(arangoHostConfig)
  if (!canConnect)
    throw new Error(`Arango spreadsheet loader: Cannot connect to Arango host: ${arangoHostConfig.url}`)

  const db = await getDb(arangoHostConfig, dbName, { ifDbDoesNotExist, users })

  const clientData: ArangoDataLoaderClientData = { db, dataLoadOpts }

  // OK, loop through the worksheets and load the data appropriratly
  await forEachSheet(loadWorksheetData, excelFilePath, clientData, dataLoadOpts)

  return 0
}

//------------------------------------------------------------------------------

export const loadWorksheetData: LoadWorksheetData = async (
  parsedWorksheet,
  clientData: ArangoDataLoaderClientData,
) => {

  const {
    dataLayout, meta, data, worksheetName,
  } = parsedWorksheet

  // it is possible to have no data for front matter only worksheets
  if (dataLayout === 'frontMatterOnly') {
    console.warn(`Worsheet ${worksheetName} is front matter only, no data to load`)
    return
  }

  throwIf(isNil(data), `Worksheet ${worksheetName}: data not found`)
  throwIf(isNil(meta), `Worksheet ${worksheetName}: metadata not found`)

  const { arangoType } = meta as ArangoDataLoaderMeta
  const { db, dataLoadOpts } = clientData

  throwIf(!arangoType,
    `ArangoSpreadSheet loader, worksheet ${worksheetName}:\n` +
    'does note have property "type" in its metadata section (or is missing metadata section)'
  )

  throwIf(!validWorksheetTypes.includes(arangoType),
    `ArangoSpreadSheet loader, worksheet ${worksheetName}:\n` +
    `  Invaaid worksheet type '${arangoType}'\n` +
    `  Must be one of ${toJson(validWorksheetTypes.join(', '))}`
  )

  if ( arangoType === 'graph') {
    console.warn(
      `ArangoSpreadSheet loader, worksheet ${worksheetName}:\n` +
      'Graphs are not yet supported'
    )
    return
  }

  const collectionName = worksheetName

  // make sure we default to create dollection if no opts are provided
  switch (arangoType) {
  case 'docCollection':
    await loadDocCollection(
      worksheetName, db, collectionName, data as DataTableData, dataLoadOpts
    )
    break
  case 'edgeCollection':
    await loadEdgeCollection(
      worksheetName, db, collectionName, data as DataTableData, dataLoadOpts
    )
    break
  default:
    throw new Error(
      `ArangoSpreadSheet loader, worksheet ${worksheetName}:\n` +
      `  Invalid arangoType specified '${arangoType}'\n` +
      `  Must be one of ${validWorksheetTypes.join(', ')}`
    )
  }
}

//------------------------------------------------------------------------------

export const loadDocCollection = async (
  worksheetName: string,
  db: Database,
  collectionName: string,
  data: DataTableData,
  dataLoadOpts?: LoadSpreadsheetDataOpts,
) => { // TODO: what type to return

  // if collection exists, lets make sure it is indeed a document collection
  if (
    await collectionExists(db, collectionName) &&
    await getCollectionType(db, collectionName) !== CollectionType.DOCUMENT_COLLECTION
  )
    throw new Error(
      `ERROR: ArangoSpreadSheet loader, worksheet ${worksheetName}:\n` +
      `  Worsheet identified collection '${collectionName}' as a document collection\n` +
      `  ${collectionName} exists, but it is actually an edge collection`
    )

  // always default to creating the collection if it does not exist
  const ifTargetCollectionDoesNotEist: IfTargetCollectionDoesNotExist =
    dataLoadOpts?.ifTargetCollectionDoesNotEist || 'Create'

  const collection = await getDocCollection(db, collectionName, ifTargetCollectionDoesNotEist)
  await collection.import(data)
}

//------------------------------------------------------------------------------

export const loadEdgeCollection = async (
  worksheetName: string,
  db: Database,
  collectionName: string,
  data: DataTableData,
  dataLoadOpts?: LoadSpreadsheetDataOpts,
) => { // TODO: what type to return

  // if collection exists, lets make sure it is indeed a document collection
  if (
    await collectionExists(db, collectionName) &&
    await getCollectionType(db, collectionName) !== CollectionType.EDGE_COLLECTION
  )
    throw new Error(
      `ERROR: ArangoSpreadSheet loader, worksheet ${worksheetName}:\n` +
      `  Worsheet identified collection '${collectionName}' as an edge collection\n` +
      `  ${collectionName} exists, but it is actually a document collection`
    )

  // always default to creating the collection if it does not exist
  const ifTargetCollectionDoesNotEist: IfTargetCollectionDoesNotExist =
    dataLoadOpts?.ifTargetCollectionDoesNotEist || 'Create'

  const collection = await getEdgeCollection(db, collectionName, ifTargetCollectionDoesNotEist)

  // validate edge targets if reqested

  const validateEdgeTargets = dataLoadOpts?.validateEdgeTargets ?? true
  console.log('validateEdgeTargets: ', validateEdgeTargets)
  if (validateEdgeTargets) {
    for (const { _from, _to } of data ) {

      throwIf(
        await documentDoesNotExistById(db, _from),
        `ArangoSpreadSheet loader, worksheet ${worksheetName}:\n` +
        `  Attempting to create edge ${_from} -> ${_to}\n` +
        `  Source document does not exist '${_from}'`
      )

      throwIf(
        await documentDoesNotExistById(db, _to),
        `ArangoSpreadSheet loader, worksheet ${worksheetName}:\n` +
        `  attempting to create edge '${_from}'  -> '${_to}'\n` +
        `  destination document does not exist: '${_to}'`
      )
    }
  }

  // If we get here, we are good to load the data
  await collection.import(data)
}
