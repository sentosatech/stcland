import { Worksheet, Workbook, Row, CellValue } from 'exceljs'

import type { PredFn } from '@stcland/utils'

export type DataType =
  'string' | 'number' | 'boolean' | 'bigint' | 'date' | 'password' | 'json' | 'uuid';

export const validDataTypes: DataType[] = [
  'string', 'number', 'boolean', 'bigint', 'date', 'password', 'json', 'uuid'
]

export interface WorksheetMeta  {
  worksheetName: string
}
export interface RowMeta extends WorksheetMeta {
  rowNumber: number;
}

export interface CellMeta extends RowMeta {
  colNumber: number;
}

export interface DataCellMeta extends CellMeta {
  propName: string;
  propType: DataType;
}

/*
  Given an exceljs worksheet returns the parsed data as an array of objects.
  This first row is used as the key for the correspnding value to be added.
  The second row is used to define the data type for that column
  The contents of the remaining rows hold values to be parsed
*/

export interface WorksheetParseOptions {
  reportProgress?: boolean
    // defaults to true
  reportWarnings?: boolean
    // defaults to true
}

export interface ParsedWorksheetResult {
  sheetName: string,
  numDataRowsParsed: number,
  data: any[]
  dataTypes: Record<string, DataType>
  meta?: Record<string, any>
  metaTypes?: Record<string, DataType>
}

export type ParseWorksheet = (
  ws: Worksheet,
  parseOpts?: WorksheetParseOptions,
  startingRowNum?: number, // defaults to 1
) => ParsedWorksheetResult;

export interface ParseFrontMatterResult {
  meta?: Record<string, any>
  metaTypes?: Record<string, DataType>
  dataStartRowNum: number
}

export type ParseFrontMatter = (
  ws: Worksheet,
  startingRowNum: number,
  parseOpts?: WorksheetParseOptions
) => ParseFrontMatterResult;

export type ParsedSpreadheetCallBack = (
  parsedWorksheet: ParsedWorksheetResult,
    // parsed worksheet data for your callback to proccess
  clientData?: any
    // data that you your cb may need
) => Promise<false | any>
    // client can return anything they want
    // client can return false if they want to stop the iteration

/**
 loads a spreadsheet from disk, iterates over each worksheet,
 and calls the callback for each parsed worksheet

 Throws Error if the spreadsheet does not exist
 */
export type ForEachSheet = (
  cb: ParsedSpreadheetCallBack,
    // called for each parsed worksheet, passed the parsed worksheet data
  spreadsheetPath: string,
    // path and filename for the spreadsheet to be parsed
  clientData?: any,
    // data that you your cb may need, will be passed as 2nd argument to cb
  parseOpts?: WorksheetParseOptions,
    // options to control parsing
  startingRowNum?: number,
    // if your data starts on a row other than 1
    // must the the same for all worksheets
) => Promise<void>

/*
  Given a workbook, returns an array of worksheets that pass all filter functions
*/
export interface GetWorkSheetListOptions {
  wb: Workbook;
  filterFns?: PredFn<Worksheet>[];
}
export type GetWorkSheetList = (
  wb: Workbook,
  filterFns?: PredFn<Worksheet>[] // list of functions to filter unwante worksheets
) => Worksheet[];

export type GetPropTypesFromRow = (row: Row) => DataType[];

// Returnn values from a worksheet row
export type GetRowValues = (row: Row) => CellValue[];

// TODO:
// - version of parseWorksheet that takes spreadsheet path and worksheet name
// - parseSpreadsheet by both spreadsheet path and workbook
