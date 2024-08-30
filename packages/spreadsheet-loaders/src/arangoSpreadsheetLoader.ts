import { Worksheet } from 'exceljs'
import { getWorksheetType, worksheetNotHidden } from './spreadSheetUtils'

export const startingRow = 3

export const isDocCollectionWorksheet = (ws: Worksheet) =>
  getWorksheetType(ws) === 'docCollection'

export const isEdgeCollectionWorksheet = (ws: Worksheet) =>
  getWorksheetType(ws) === 'edgeCollection'

export const isGraphWorksheet = (ws: Worksheet) =>
  getWorksheetType(ws) === 'graph'

export const worksheetHasArangoData = (ws: Worksheet) =>
  worksheetNotHidden(ws) &&
  (isEdgeCollectionWorksheet(ws) || isDocCollectionWorksheet(ws))
