import { Worksheet, Workbook, Row, CellValue } from 'exceljs'

import type { PredFn } from '@stcland/utils'

//--- Common -------------------------------------------------------------------

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
  dataType: DataCollectionDataType;
}

export type DelimiterActions = 'stop' | 'continue'

export interface ParseOptions {
  reportProgress?: boolean
    // defaults to true
  reportWarnings?: boolean
    // defaults to true
  includeDataTypeMaps?: boolean
    // defaults to false
  onDelimiter?: DelimiterActions
    // 'stop' is used front matter parsing as collection

}

//--- Data Types --------------------------------------------------------------

export type BaseDataTypes =
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'password'
  | 'json'
  | 'uuid';

export type ListDataTypes =
  | 'string:list'
  | 'number:list'
  | 'boolean:list'
  | 'date:list'
  | 'password:list'
  | 'json:list'
  | 'uuid:list';

export const validBaseDataTypes: BaseDataTypes[] = [
  'string',
  'number',
  'boolean',
  'date',
  'password',
  'json',
  'uuid',
]

export const validListDataTypes: ListDataTypes[] = [
  'string:list',
  'number:list',
  'boolean:list',
  'date:list',
  'password:list',
  'json:list',
  'uuid:list',
]

export type DataCollectionDataType = BaseDataTypes | ListDataTypes;

export const validDataCollectionDataTypes: DataCollectionDataType[] = [
  ...validBaseDataTypes,
  ...validListDataTypes,
]

export const validDataTableDataTypes: BaseDataTypes[] = [
  'string', 'number', 'boolean', 'date', 'password', 'json', 'uuid'
]

export const validRowValueListTypes: ListDataTypes[] = [
  'string:list', 'number:list', 'boolean:list', 'date:list', 'password:list', 'json:list', 'uuid:list'
]

export type InvalidDataTypeWarning = 'invalid-data-type'
export type InvalidListTypeWarning = 'invalid-list-type'
export type InvalidTypeWarning = InvalidDataTypeWarning | InvalidListTypeWarning


export type DataType = DataCollectionDataType

// using a set to remove duplicates
export const validDataTypes: DataType[] = Array.from(new Set([
  ...validDataTableDataTypes,
  ...validDataCollectionDataTypes
]))

export type DataTypeMap = Record<string, DataCollectionDataType> | Record<string, DataCollectionDataType>[]
export type Meta = Record<string, any>
export type MetaTypeMap = Record<string, DataType>

//--- Data Layout -------------------------------------------------------------

export type DataLayout = 'dataCollection' | 'dataTable' | 'frontMatterOnly'

export const validDataLayouts: DataLayout[] = ['dataCollection', 'dataTable', 'frontMatterOnly']

export interface ParseDataLayoutResult {
  dataLayout: DataLayout
  nextRowNum: number
}

export type ParseDataLayout = (
  ws: Worksheet,
  rowNumber: number,
  parseOpts?: ParseOptions
) => ParseDataLayoutResult

export type Data = Record<string, any>


//--- Front Matter ------------------------------------------------------------

export interface ParseFrontMatterResult {
  meta?: Meta
  metaTypeMap?: MetaTypeMap
  nextRowNum: number
}

export type ParseFrontMatter = (
  ws: Worksheet,
  startingRowNum: number,
  parseOpts?: ParseOptions
) => ParseFrontMatterResult;


//--- Data Table --------------------------------------------------------------

// list of data objects
export type DataTableData = Data[]

export interface ParseDataTableResult {
  data: DataTableData
  dataTypeMap?: DataTypeMap
  numDataEntriesParsed: number
  nextRowNum: number
}

export type ParseDataTable = (
  ws: Worksheet,
  startingRowNum: number,
  parseOpts?: ParseOptions
) => ParseDataTableResult;


// --- Data Collections -------------------------------------------------------

// list of data objects
export type DataCollectionData = Data[]

export interface ParseDataCollectionResult {
  data?: DataCollectionData
  dataTypeMap?: DataTypeMap
  numDataEntriesParsed: number
  nextRowNum: number
}

export type ParseDataCollection = (
  ws: Worksheet,
  startingRowNum: number,
  parseOpts?: ParseOptions
) => ParseDataCollectionResult;


// --- Worksheet Parsing ------------------------------------------------------

export interface ParsedWorksheetResult {
  worksheetName: string,
  dataLayout: DataLayout,
  numDataEntriesParsed: number,
  meta?: Meta
  metaTypeMap?: MetaTypeMap
  data?: DataCollectionData | DataTableData
  dataTypeMap?: DataTypeMap
}

export type ParseWorksheet = (
  ws: Worksheet,
  parseOpts?: ParseOptions,
  startingRowNum?: number, // defaults to 1
) => ParsedWorksheetResult;

export type ParsedSpreadheetCallBack = (
  parsedWorksheet: ParsedWorksheetResult,
    // parsed worksheet data for your callback to proccess
  clientData?: any
    // data that you your cb may need
) => Promise<false | any>
    // client can return anything they want
    // client can return false if they want to stop the iteration

//--- spreadsheet (workbook) parsing -----------------------------------------

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
  parseOpts?: ParseOptions,
    // options to control parsing
  startingRowNum?: number,
    // if your data starts on a row other than 1
    // must the the same for all worksheets
) => Promise<void>

// TODO:
// - version of parseWorksheet that takes spreadsheet path and worksheet name
// - parseSpreadsheet by both spreadsheet path and workbook



// --- Utility functions ------------------------------------------------------

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

export type GetDataTypesFromRow = (row: Row) => BaseDataTypes[];

// Returnn values from a worksheet row
export type GetRowValues = (row: Row) => CellValue[];

