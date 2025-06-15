import { isNotArray } from 'ramda-adjunct'
// import { isNil } from 'ramda'
// import { pathExists } from 'path-exists'

// import { throwIf } from '@stcland/errors'
// import { toJson } from '@stcland/utils'

import {
  // type DataTableData, type DataCollectionData,
  forEachSheet
} from '@stcland/spreadsheet-parser'


import {
  type CreateDbFromSqlScriptOptions,
  createDbFromSqlScript,
  getTableList,
  tableExists
} from '../utils'



// import {
//   validWorksheetTypes
// } from './PgLoaderTypes'

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
  // excelFilePath, arangoHostConfig, dbName, dataLoadOpts = {}

) => {

  const { sqlScript, scriptSource } = dataLoadOpts
  // const dbList = await getDbList(pgHostConfig)
  // console.log('dbList: ', dbList)

  // const dbDoesExist = await dbExists(pgHostConfig, dbName  )
  // console.log('dbDoesExist: ', dbDoesExist)

// export const createDbFromSqlScript : CreateDbFromSqlScript = async (
//   hostConfig: PgHostConfig,
//   dbName: string,
//   sqlScript: string,
//   options?: CreateDbFromSqlScriptOptions
// ): Promise<SqlDb> => {

  // TODO: For now assume script exists, will make more flexible in a bit

  // const options: CreateDbFromSqlScriptOptions = {
  //     ifDbExists: 'ThrowError',
  //     scriptSource: 'filePath',
  //   }

  // TEMP: just dropping for new while I am tinkering


  // TODO: should i Just be using the incoming opts directly?
  const opts: CreateDbFromSqlScriptOptions = {
    ifDbExists: 'Overwrite',
    scriptSource: scriptSource || 'string',
  }

  const sqlDb = await createDbFromSqlScript(
    pgHostConfig, dbName, sqlScript || '',  opts
  )

  const tableList = await getTableList(sqlDb)
  console.log('tableList: ', tableList)

  // const { users = [] } = dataLoadOpts
  // const ifDbDoesNotExist: IfDbDoesNotExistOnGet =
  //   dataLoadOpts?.ifTargetDbDoesNotExist || 'Create'

  // // Lets make sure the file actually exists
  // const spreadsheetExists = await pathExists(excelFilePath)
  // if (!spreadsheetExists)
  //   throw new Error(`Arango spreadsheet loader: Spreadsheet file not found: ${excelFilePath}`)

  // // lets make sure that we can connect to the arango host
  // const canConnect = await canConnectToServer(arangoHostConfig)
  // if (!canConnect)
  //   throw new Error(`Arango spreadsheet loader: Cannot connect to Arango host: ${arangoHostConfig.url}`)

  // const db = await getDb(arangoHostConfig, dbName, { ifDbDoesNotExist, users })

  const clientData = { sqlDb }

  // OK, loop through the worksheets and load the data appropriratly
  await forEachSheet(loadWorksheetData, excelFilePath, clientData, dataLoadOpts)

  return 0
}

//------------------------------------------------------------------------------

export const loadWorksheetData: LoadWorksheetData = async (
  parsedWorksheet,
  clientData,
) => {

  const { sqlDb } = clientData
  const { data, worksheetName  } = parsedWorksheet

  const tableName = worksheetName
  const tableDoesExist = await tableExists(sqlDb, tableName)
  console.log(`\n ${tableName} tableDoesExist: `, tableDoesExist)

  if (isNotArray(data)) {
    console.warn(`loadWorksheetData: Worksheet ${worksheetName} data is not an array`)
    return
  }

  if (!data || data.length === 0) {
    console.warn(`loadWorksheetData: Worksheet ${worksheetName} did not contain any data`)
    return
  }


  const fullTableName = `core.${tableName}`
  try {
    const result = await sqlDb`
      INSERT INTO ${sqlDb(fullTableName)} ${sqlDb(data)}
    `
    console.log('result: ', result)
  } catch (error) {
    console.error(`Error inserting into ${worksheetName}:`, error)
    throw error
  }
}
