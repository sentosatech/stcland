import { ParsedSpreadheetCallBack, ParseOptions } from '@stcland/spreadsheet-parser'


// import { Database } from 'arangojs'

// import type {
// } from '../utils/ArangoUtilsTypes'

// import type {
//   IfDbDoesNotExistOnGet,
//   IfCollectionDoesNotExistOnGet,
//   ArangoHostConfig,
//   CreateDatabaseUserOptions
// } from '../utils/ArangoUtilsTypes'


// import { CollectionType } from '../utils'

// // re-export arango types
// export { CreateDatabaseUserOptions }

// export type IfTargetDbDoesNotExist = IfDbDoesNotExistOnGet
// export type IfTargetCollectionDoesNotExist = IfCollectionDoesNotExistOnGet

export type LoadSpreadsheetDataOpts =
  Pick<ParseOptions, 'reportProgress' | 'reportWarnings'>

// export interface LoadSpreadsheetDataOpts extends
//   Pick<ParseOptions, 'reportProgress' | 'reportWarnings'> {
//   ifTargetDbDoesNotExist?: IfTargetDbDoesNotExist
    // defaults to create
  // users?: CreateDatabaseUserOptions[]
    // only needed if IfTargertDbDoesNotExist is Create
    // defaults to []
// }

export interface LoadSpreadsheetDataResult {
  numDocsLaoaded: Record<string, number> // { collectionName: numDocsLoaded }
  numGraphsCreated: number
}

export type LoadSpreadsheetData = (
  excelFilePath: string,
  dataLoadOpts?: LoadSpreadsheetDataOpts
// ) => Promise<LoadSpreadsheetDataResult>;
) => Promise<any>; // TODO: figure out how to get LoadSpreadsheetDataResult when working with forEachSheet

export type LoadWorksheetData = ParsedSpreadheetCallBack

// export interface ArangoDataLoaderMeta {
//   arangoType : 'docCollection' | 'edgeCollection' | 'graph'
//   [key: string]: any
// }

// export const collectionTypeMap: Record<'docCollection' | 'edgeCollection', CollectionType> = {
//   docCollection: CollectionType.DOCUMENT_COLLECTION,
//   edgeCollection: CollectionType.EDGE_COLLECTION,
// }

// export interface ArangoDataLoaderClientData {
//   db: Database
//   dataLoadOpts: LoadSpreadsheetDataOpts
// }

// export const validWorksheetTypes = [
//   'docCollection', 'edgeCollection','graph'
// ]
