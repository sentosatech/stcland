import { isNotArray } from 'ramda-adjunct'
import { pathExists } from 'path-exists'

// import { toJson } from '@stcland/utils'

import {
  forEachSheet
} from '@stcland/spreadsheet-parser'


import {
  type CreateDbFromSqlScriptOptions,
  type DbCreationResult,
  createDbFromSqlScript,
  canConnectToServer,
  createDb,
  conditionValueForSql,
} from '../utils'

import type {
  LoadWorksheetData, LoadSpreadsheetData,
  // LoadSpreadsheetDataOpts,
} from './PgLoaderTypes'


//------------------------------------------------------------------------------

export const loadSpreadsheetData: LoadSpreadsheetData = async (
  excelFilePath,
  pgHostConfig,
  dbName,
  dataLoadOpts = {}
) => {
  const { sqlScript, scriptSource, ifTargetDBExists = 'Append' } = dataLoadOpts

  // first, lets make sure the spreadsheet actually exists
  const spreadsheetExists = await pathExists(excelFilePath)
  if (!spreadsheetExists)
    throw new Error(`Postgres spreadsheet loader: Spreadsheet file not found: ${excelFilePath}`)

  // lets make sure that we can connect to the arango host
  const canConnect = await canConnectToServer(pgHostConfig)
  if (!canConnect) {
    const hostInfo = `${pgHostConfig.host}:${pgHostConfig.port}`
    throw new Error(`Postgres spreadsheet loader: Cannot connect to postgres host: ${hostInfo}`)
  }

  let dbCreationResult: DbCreationResult | undefined
  try {
    const ifDbExistsAction =
      ifTargetDBExists === 'Append' ? 'ReturnExisting' : ifTargetDBExists

    if (sqlScript && scriptSource) {

      const opts: CreateDbFromSqlScriptOptions = {
        ifDbExists: ifDbExistsAction,
        scriptSource: scriptSource || 'string',
      }

      dbCreationResult = await createDbFromSqlScript(
        pgHostConfig, dbName, sqlScript || '', opts
      )
    }
    else {
      dbCreationResult = await createDb(
        pgHostConfig, dbName, { ifDbExists: ifDbExistsAction }
      )
    }

    const clientData = { sqlDb: dbCreationResult.sqlDb }

    await forEachSheet(loadWorksheetData, excelFilePath, clientData, dataLoadOpts)

    return 0
  } finally {
    if (dbCreationResult?.sqlDb) {
      try {
        await dbCreationResult.sqlDb.end()
      } catch (cleanupError) {
        console.error('Error closing database connection:', cleanupError)
      }
    }
  }
}

//------------------------------------------------------------------------------

export const loadWorksheetData: LoadWorksheetData = async (
  parsedWorksheet,
  clientData,
) => {

  const { sqlDb } = clientData
  const { data, worksheetName  } = parsedWorksheet

  const tableName = worksheetName

  if (isNotArray(data)) {
    console.warn(`loadWorksheetData: Worksheet ${worksheetName} data is not an array`)
    return
  }

  if (!data || data.length === 0) {
    console.warn(`loadWorksheetData: Worksheet ${worksheetName} did not contain any data`)
    return
  }

  const conditionedData = data.map((row) => {
    const conditionedRow: Record<string, any> = {}
    for (const [key, value] of Object.entries(row)) {
      conditionedRow[key] = conditionValueForSql(value)
    }
    return conditionedRow
  })

  const fullTableName = `core.${tableName}`
  try {
    await sqlDb`
      INSERT INTO ${sqlDb(fullTableName)} ${sqlDb(conditionedData)}
    `
  } catch (error) {
    console.error(`Error inserting into ${worksheetName}:`, error)
    throw error
  }
}
