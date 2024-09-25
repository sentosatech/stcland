import { pathExists } from 'path-exists'

// import { canConnectToDbServer, documentDoesNotExistById, getDb } from '../utils/arangoUtils'
import { canConnectToServer, documentDoesNotExistById } from '../utils/arangoUtils'

import {
  type LoadWorksheetData, type LoadSpreadsheetData,
  type ArangoDataLoaderMeta, type ArangoDataLoaderClientData,
  IfTargetDbDoesNotExist, IfTargetCollectionDoesNotExist, ValidWorksheetTypes,
} from './ArangoDataLoaderTypes'

// import { DataTableData, forEachSheet } from '@stcland/spreadsheet-parser'
import { DataTableData } from '@stcland/spreadsheet-parser'

import {
  CollectionType,
  IfCollectionDoesNotExistOnGet,
  getCollection
} from '../utils'

import { throwIf } from '@stcland/errors'
import { toJson } from '@stcland/utils'

export const loadSpreadsheetData: LoadSpreadsheetData = async (
  excelFilePath, arangoHostConfig, dbName, loadDataOpts
) => {

  // const {dbUsers = [] } = loadDataOpts
  const ifTargetDbDoesNotExist: IfTargetDbDoesNotExist
    = loadDataOpts?.ifTargetDbDoesNotExist || 'Create'

  // Lets make sure the file actually exists
  const spreadsheetExists = await pathExists(excelFilePath)
  if (!spreadsheetExists)
    throw new Error(`Arango spreadsheet loader: Spreadsheet file not found: ${excelFilePath}`)

  // lets make sure that we can connect to the arango host
  const canConnect = await canConnectToServer(arangoHostConfig)
  if (!canConnect)
    throw new Error(`Arango spreadsheet loader: Cannot connect to Arango host: ${arangoHostConfig.url}`)

  // @ts-expect-error cause TS is a pain in the ass
  const ifDbDoesNotExist = ifTargetDbDoesNotExist as IfDbDoesNotExistOnGetOld

  // // TEMP TEMP TEMP until I improve spreadsheet loading opttions
  // const ifDbDoesNotExist: IfDbDoesNotExistOnGet = IfDbDoesNotExistOnGet.Create
  // const tempGetDbOpts: GetDbOptions = {
  //   ifDbDoesNotExist: 'create'
  // }
  // const db = await getDb(arangoHostConfig, dbName, ifDbExistsOnGet, dbUsers)

  // const clientData: ArangoDataLoaderClientData = { db, opts }

  // OK, loop through the worksheets and load the data appropriratly
  // await forEachSheet(loadWorksheetData, excelFilePath, clientData, opts)

  return 0
}

export const loadWorksheetData: LoadWorksheetData = async (
  parsedWorksheet,
  clientData: ArangoDataLoaderClientData,
) => {

  const {
    dataLayout, meta, data, worksheetName,
  } = parsedWorksheet

  // it is possible to have no data for front matter only worksheets
  if (dataLayout === 'frontMatterOnly') {
    console.warn(`Worsheet ${worksheetName} is front matter only, skipping`)
    return
  }

  throwIf(!data, `Worsheet ${worksheetName}: data not found`)
  throwIf(!meta, `Worsheet ${worksheetName}: metadata not found`)

  const { arangoType } = meta as ArangoDataLoaderMeta
  const { db, loadDataOpts } = clientData

  const {
    ifTargetCollectionDoesNotEist = IfTargetCollectionDoesNotExist.Create,
    validateEdgeTargets = true
  } = loadDataOpts

  throwIf(!arangoType,
    `ArangoSpreadSheet loader, worksheet ${worksheetName}:\n` +
    'does note have property "type" in its metadata section (or is missing metadata section)'
  )

  throwIf(!ValidWorksheetTypes.includes(arangoType),
    `ArangoSpreadSheet loader, worksheet ${worksheetName}:\n` +
    `  Invaaid worksheet type '${arangoType}'\n` +
    `  Must be one of ${toJson(ValidWorksheetTypes.join(', '))}`
  )

  if ( arangoType === 'graph') {
    console.warn(
      `ArangoSpreadSheet loader, worksheet ${worksheetName}:\n` +
      'Graphs are not yet supported'
    )
  }

  const collectionName = worksheetName

  const ifCollectionDoesNotExistOnGet =
    // @ts-expect-error cause TS is a pain in the ass
    ifTargetCollectionDoesNotEist as IfCollectionDoesNotExistOnGet

  const typeMap: Record<'docCollection' | 'edgeCollection', CollectionType> = {
    docCollection: CollectionType.DOCUMENT_COLLECTION,
    edgeCollection: CollectionType.EDGE_COLLECTION,
  }
  const collectionType: CollectionType = typeMap[arangoType]

  const collection = await getCollection(
    db, collectionName, ifCollectionDoesNotExistOnGet, collectionType
  )

  if (collectionType == CollectionType.EDGE_COLLECTION && validateEdgeTargets) {
    for (const { _from, _to } of data as DataTableData) { // TODO: temp typecast

      throwIf(
        await documentDoesNotExistById(db, _from),
        `ArangoSpreadSheet loader, worksheet ${worksheetName}:\n` +
        `  Attempting to create edge ${_from} -> ${_to}\n` +
        `  Source document does not exist '${_from}'`
      )

      throwIf(
        await documentDoesNotExistById(db, _to),
        `ArangoSpreadSheet loader, worksheet ${worksheetName}:\n` +
        `  attempting to create edge ${_from}  -> ${_to}\n` +
        `  destination document does not exist ${_to}`
      )

    }
  }


  await collection.import(data as DataTableData) // TODO: temp typecast

}
