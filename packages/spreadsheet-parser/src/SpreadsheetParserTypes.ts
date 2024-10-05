import { Worksheet, Workbook, Row, CellValue } from 'exceljs'

import type { PredFn } from '@stcland/utils'

// In Progress
// - Metadata Type Map options
// - multple docs per DataCollection
//
// ... get tables to work first with type options
// ... then get collections to work with type options


// TODO
// - RowValueList -> RowList
// - DataType = for the core types, EhnahcedDataTypes for lists, forget the uinions with :list
// - support _skip_ in row value list (low priority)

//--- common -------------------------------------------------------------------

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
  dataType: DataType;
}

export type DelimiterActions = 'stop' | 'continue'

export interface ParseOptions {
  reportProgress?: boolean
    // defaults to true
  reportWarnings?: boolean
    // defaults to true
  includeTypeMaps?: boolean
    // defaults to false
  onDelimiter?: DelimiterActions
    // 'stop' front matter parsing as collection

}

//--- data types --------------------------------------------------------------

export type DataTableDataType =
'string' | 'number' | 'boolean' | 'date' | 'password' | 'json' | 'uuid'

export const validDataTableDataTypes: DataTableDataType[] = [
  'string', 'number', 'boolean', 'date', 'password', 'json', 'uuid'
]

export type RowValueListType =
  'string:list' | 'number:list' | 'boolean:list' | 'date:list' | 'password:list' | 'json:list' | 'uuid:list'

export const validRowValueListTypes: RowValueListType[] = [
  'string:list', 'number:list', 'boolean:list', 'date:list', 'password:list', 'json:list', 'uuid:list'
]

export type InvalidDataTypeWarning = 'invalid-data-type'
export type InvalidListTypeWarning = 'invalid-list-type'
export type InvalidTypeWarning = InvalidDataTypeWarning | InvalidListTypeWarning

export type DataCollectionDataType =  RowValueListType | DataTableDataType

export const validDataCollectionDataTypes: DataCollectionDataType[] = [
  ...validRowValueListTypes, ...validDataTableDataTypes
]

export type DataType = DataTableDataType | DataCollectionDataType

// using a set to remove duplicates
export const validDataTypes: DataType[] = Array.from(new Set([
  ...validDataTableDataTypes,
  ...validDataCollectionDataTypes
]))

export type DataTypeMap = Record<string, DataType>
export type Meta = Record<string, any>
export type MetaTypeMap = Record<string, DataType>


//--- data layout -------------------------------------------------------------

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

//--- front matter ------------------------------------------------------------

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


//--- data table --------------------------------------------------------------

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


// --- data collections -------------------------------------------------------

// list of data objects
export type DataCollectionData = Data[]

export interface ParseDataCollectionResult {
  data: DataCollectionData | undefined
  dataTypeMap: DataTypeMap | undefined
  numDataEntriesParsed: number
  nextRowNum: number
}

export type ParseDataCollection = (
  ws: Worksheet,
  startingRowNum: number,
  parseOpts?: ParseOptions
) => ParseDataCollectionResult;


// --- worksheet parsing ------------------------------------------------------

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


// --- utility functions ------------------------------------------------------

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

export type GetDataTypesFromRow = (row: Row) => DataType[];

// Returnn values from a worksheet row
export type GetRowValues = (row: Row) => CellValue[];

