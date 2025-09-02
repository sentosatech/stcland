import { ParsedSpreadheetCallBack, ParseOptions } from '@stcland/spreadsheet-parser'



import type {
  PgHostConfig, ScriptScource,
} from '../utils/PgUtilsTypes'

export interface LoadSpreadsheetDataOpts
    extends Pick<ParseOptions, 'reportProgress' | 'reportWarnings' | 'includeDataTypeMaps'> {
    ifTargetDBExists?: 'Append' | 'Overwrite' | 'ThrowError' // defaults to 'Append'
  }

export interface LoadSpreadsheetDataResult {
  numRecordsLaoaded: Record<string, number> // { tableName: numRecprdsLoaded }
}

export interface PgLoadSpreadsheetDataOpts extends LoadSpreadsheetDataOpts {
  sqlScript?: string // sql script to be executed prior to loading the data (optional)
  scriptSource?: ScriptScource // required if sqlScript is provided
}

export type LoadSpreadsheetData = (
  excelFilePath: string,
  pgHostConfig: PgHostConfig,
  dbName: string,
  dataLoadOpts?: PgLoadSpreadsheetDataOpts
) => Promise<any>;

export type LoadWorksheetData = ParsedSpreadheetCallBack
