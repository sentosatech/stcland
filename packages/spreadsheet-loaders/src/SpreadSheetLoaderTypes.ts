import { Worksheet, Workbook, Row, CellValue } from 'exceljs'

import type { PredFn } from '@stcland/utils'

export type PropType =
  'string' | 'number' | 'boolean' | 'bigint' | 'date' | 'password' | 'json' | 'uuid';

export const validPropTypes: PropType[] = [
  'string', 'number', 'boolean', 'bigint', 'date', 'password', 'json', 'uuid'
]

// export type ResolvedCellValue = string | number | boolean | object | Date | undefined | null

export interface RowMeta {
  worksheetName: string;
  rowNumber: number;
}

export interface DataCellMeta extends RowMeta {
  colNumber: number;
  propName: string;
  propType: PropType;
}

/*
  Given an exceljs worksheet returns the parsed data as an array of objects.
  This first row is used as the key for the correspnding value to be added.
  The second row is used to define the data type for that column
  The contents of the remaining rows hold values to be parsed
*/

export type ParseWorksheet = ({
  ws, firstRowOffset, log
}: {
  ws: Worksheet; // exceljs worksheet
  firstRowOffset?: number; // offset in the worksheet where data entries start
  log?: boolean; // default false
}) => any;

/*
  Given a workbook, returns an array of worksheets that pass all filter functions
*/
export interface GetWorkSheetListOptions {
  wb: Workbook;
  filterFns?: PredFn<Worksheet>[];
}
export type GetWorkSheetList = ({
  wb, filterFns
}:{
  wb: Workbook; // exceljs worksheet
  filterFns?: PredFn<Worksheet>[]; // list of functions to filter unwante worksheets
}) => Worksheet[];

export type GetPropTypesFromRow = (row: Row) => PropType[];

// Returnn values from a worksheet row
export type GetRowValues = (row: Row) => CellValue[];

