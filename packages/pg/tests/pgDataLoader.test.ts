import {
  describe, test, afterAll, beforeAll, assert, expect
} from 'vitest'

import path from 'path'
import { fileURLToPath } from 'url'

import { pathExistsSync } from 'path-exists'

import type { SqlDb } from '../utils/PgUtilsTypes'
import {
  canConnectToServer, getSysDb, dbExists, dropDb
} from '../utils'

import type {
  PgHostConfig,
} from '../utils'

import {
  loadSpreadsheetData,
  PgLoadSpreadsheetDataOpts
} from '../data-loader'

const cwd = path.dirname(fileURLToPath(import.meta.url))
const spreadsheetPath = path.join(cwd, 'test-pg-data-loading.xlsx')
const sqlScriptPath = path.join(cwd, 'test-pg-data.sql')

const hostConfig: PgHostConfig = {
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'pw',
}

const dbName = 'pg_data_loader_test_db'
let sysDb: SqlDb

beforeAll(async () => {
  expect(await canConnectToServer(hostConfig)).toBe(true)
  sysDb = await getSysDb(hostConfig, { checkConnection: true })
  if (await dbExists(sysDb, dbName)) {
    console.warn(`WARNING: test start: ${dbName} exists, dropping it`)
    await dropDb(sysDb, dbName)
  }

  assert(
    pathExistsSync(spreadsheetPath),
    `Postgres spreadsheet loader test: Spreadsheet file not found: ${spreadsheetPath}`
  )
})

afterAll(async () => {
  await dropDb(sysDb, dbName)
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

    await loadSpreadsheetData(spreadsheetPath, hostConfig, dbName, opts)
  })
})
