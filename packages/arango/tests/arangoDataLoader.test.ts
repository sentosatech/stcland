import { describe, test, afterAll, beforeAll, expect, assert } from 'vitest'

import path from 'path'
import { fileURLToPath } from 'url'

import { pathExistsSync } from 'path-exists'
import { Database } from 'arangojs'

import {
  type ArangoHostConfig, // type DataBaseUser,
  getSysDb, nonSystemDbsExists, canConnectToDbServer, dropAllDatabases,
} from '../utils'

// import {
//   IfTargertDbDoesNotExist, loadSpreadsheetData
// } from '../data-loader'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const spreadsheetPath = path.join(__dirname, 'test-data-loading.xlsx')

const hostConfig: ArangoHostConfig = {
  url: 'http://localhost:8529',
  username: 'root',
  password: 'pw',
}

// const dbUsers: DataBaseUser[] = [
//   { username: 'root', passwd: 'pw' },
// ]

// const dbName = 'testDb'

let sysDb: Database

beforeAll(async () => {

  expect(await canConnectToDbServer(hostConfig)).toBe(true)

  sysDb = await getSysDb(hostConfig)
  if (await nonSystemDbsExists(sysDb)) {
    console.warn('WARNING: test start: non system databases exist, dropping them')
    await dropAllDatabases(sysDb)
  }

  assert(
    pathExistsSync(spreadsheetPath),
    `Arango spreadsheet loader: Spreadsheet file not found: ${spreadsheetPath}`
  )

})

afterAll(async () => {
  await dropAllDatabases(sysDb)
})

describe('Test @stcland/arango/spreadsheet-loader', async () => {
  test('Arango data loading', async () => {

    // const ifTargetDbDoesNotExist = IfTargertDbDoesNotExist.Create
    // const opts = {
    //   dbUsers, ifTargetDbDoesNotExist, reportWarnings: true
    // }


  })
})
