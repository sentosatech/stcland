import { ParsedSpreadheetCallBack, WorksheetParseOptions } from '@stcland/spreadsheet-parser'
import {
  ArangoHostConfig,
  IfDbExistsOnCreate,
  IfCollectionDoesNotExistOnGet,
  DataBaseUser as ArangoDataBaseUser
} from '../utils/ArangoUtilsTypes'

// export const enum IfTargertDbDoesNotExist {
//   ThrowError = IfDbDoesNotExistOnGet.ThrowError,
//   Create =  IfDbDoesNotExistOnGet.Create
// }

export const enum IfTargetDbExists {
  ThrowError = IfDbExistsOnCreate.ThrowError,
  Overwrite =  IfDbExistsOnCreate.Overwrite,
  Append =  IfDbExistsOnCreate.ReturnExisting, // default
}

export const enum IfTargetCollectionDoesNotExist {
  ThrowError = IfCollectionDoesNotExistOnGet.ThrowError,
  Create = IfCollectionDoesNotExistOnGet.Create
}

export type DataBaseUser = Pick<ArangoDataBaseUser, 'username' | 'passwd'>

export interface LoadSpreadsheetDataOpts extends
  Pick<WorksheetParseOptions, 'reportProgress' | 'reportWarnings'> {
  // ifTargetDbDoesNotExist?: IfTargertDbDoesNotExist
  ifTargetDbExists: IfTargetDbExists
    // defaults to create
  dbUsers?: DataBaseUser[]
    // only needed if IfTargertDbDoesNotExist is Create
    // defaults to []
  ifTargetCollectionExists?: IfTargetCollectionDoesNotExist
    // defaults to Append
}

export type LoadSpreadsheetData = (
  excelFilePath: string,
  arangoHostConfig: ArangoHostConfig,
  dbName: string,
  opts: LoadSpreadsheetDataOpts
) => Promise<number>;
    // number of records loaded

export type LoadWorksheetData = ParsedSpreadheetCallBack
