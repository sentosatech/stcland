import { describe, test, afterAll, beforeAll, assert } from 'vitest'

import path from 'path'
import { fileURLToPath } from 'url'

import { pathExistsSync } from 'path-exists'

// import {
//   type ArangoHostConfig, type CreateDatabaseUserOptions,
//   getSysDb, dbExists, dropDb, canConnectToServer
// } from '../utils'

import type {
  PgHostConfig,
} from '../utils'

import {
  // IfTargetDbDoesNotExist,
  loadSpreadsheetData,
  PgLoadSpreadsheetDataOpts
} from '../data-loader'

const cwd = path.dirname(fileURLToPath(import.meta.url))
const spreadsheetPath = path.join(cwd, 'test-pg-data-loading.xlsx')
const sqlScriptPath = path.join(cwd, 'test-pg-data.sql')


// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)
// const sqlScriptPath = path.join(__dirname, 'test-pg-data.sql')


const hostConfig: PgHostConfig = {
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'pw',
}

// const dbUsers: CreateDatabaseUserOptions[] = [
//   { username: 'root', passwd: 'pw' },
// ]

// const dbName = 'arangoDataLoaderTestDb'

// let sysDb: Database

beforeAll(async () => {
  // expect(await canConnectToServer(hostConfig)).toBe(true)
  // sysDb = await getSysDb(hostConfig, { checkConnection: true })
  // if (await dbExists(sysDb, dbName)) {
  //   console.warn(`WARNING: test start: ${dbName} exists, dropping it`)
  //   await dropDb(sysDb, dbName)
  // }

  assert(
    pathExistsSync(spreadsheetPath),
    `Postgres spreadsheet loader test: Spreadsheet file not found: ${spreadsheetPath}`
  )
})

afterAll(async () => {
  // await dropDb(sysDb, dbName)
})

describe('Test @stcland/pg/spreadsheet-loader', async () => {
  test('postgres data loading', async () => {

    // const ifTargetDbDoesNotExist: IfTargetDbDoesNotExist = 'Create'
    const opts: PgLoadSpreadsheetDataOpts = {
      // dbUsers, ifTargetDbDoesNotExist,
      reportWarnings: true,
      reportProgress: false,
      includeDataTypeMaps: true,
      sqlScript: sqlScriptPath,
      scriptSource: 'filePath'
    }


    const dbName = 'pg_data_loader_test_db'
    // const results =

    await loadSpreadsheetData(spreadsheetPath, hostConfig, dbName, opts)
    // console.log('results: ', results)




  })
  // test.todo('DB/Collection existance cases', async () => {})
  // test.todo('Invalid worksheet contents', async () => {})
  // test.todo('Invalid Edges', async () => {})
  // test.todo('Mismatch in collection type specified in spreadsheet and actual collection type', async () => {})
})
