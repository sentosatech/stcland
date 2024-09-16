import { ParsedSpreadheetCallBack, WorksheetParseOptions } from '@stcland/spreadsheet-parser'
import {
  ArangoHostConfig,
  IfDbDoesNotExistOnGet,
  IfCollectionDoesNotExistOnGet,
  DataBaseUser as ArangoDataBaseUser
} from '../utils/ArangoUtilsTypes'

export enum IfTargertDbDoesNotExist {
  ThrowError = IfDbDoesNotExistOnGet.ThrowError,
  Create =  IfDbDoesNotExistOnGet.Create
}

export enum IfTargetCollectionDoesNotExist {
  ThrowError = IfCollectionDoesNotExistOnGet.ThrowError,
  Create = IfCollectionDoesNotExistOnGet.Create
}

export type DataBaseUser = Pick<ArangoDataBaseUser, 'username' | 'passwd'>

export interface LoadSpreadsheetDataOpts extends
  Pick<WorksheetParseOptions, 'reportProgress' | 'reportWarnings'> {
  ifTargetDbDoesNotExist?: IfTargertDbDoesNotExist
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
