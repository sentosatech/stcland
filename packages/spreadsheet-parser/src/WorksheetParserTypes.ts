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
    // defaults to false
  reportWarnings?: boolean
    // defaults to true
}

export interface ParsedWorksheetResult {
  data: any[]
  dataTypes: Record<string, DataType>
  meta?: Record<string, any>
  metaTypes?: Record<string, DataType>
}

export type ParseWorksheet = (
  ws: Worksheet,
  startingRowNum: number,
  parseOpts?: WorksheetParseOptions
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

