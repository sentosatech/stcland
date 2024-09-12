import {
  describe, test, beforeEach, afterEach, beforeAll, afterAll, expect
} from 'vitest'

import type { ArangoHostConfig, DataBaseUser } from '../utils'
import {
  IfDbExists,
  getArangoSysDb, createArangoDb,
  dbExists, dbDoesNotExist,
  canConnectToDbServer, canNotConnectToDbServer,
  dbIsConnected, dbIsNotConnected
} from '../utils'

import { Database } from 'arangojs'

const hostConfig: ArangoHostConfig = {
  url: 'http://localhost:8529',
  username: 'root',
  password: 'pw',
}

const dbUsers: DataBaseUser[] = [
  { username: 'root', passwd: 'pw' },
]

let sysDb: Database

beforeAll(async () => {
  // TODO: util to drop all databases
  expect(await canConnectToDbServer(hostConfig)).toBe(true)
  expect(await canNotConnectToDbServer(hostConfig)).toBe(false)
  sysDb = await getArangoSysDb(hostConfig, { checkConnection: true })
})

afterAll(async () => {
  // TODO: util to drop all databases
})

beforeEach(async () => {
})

afterEach(async () => {
  if (await dbExists(hostConfig, 'testDb')) {
    await sysDb.dropDatabase('testDb')
  }
})

describe('Test @stcland/arango/utils', async () => {

  test('DB creation', async () => {

    // First creation

    let ifDbExists = IfDbExists.ThrowError

    let db1 = await createArangoDb(hostConfig, 'testDb', dbUsers, ifDbExists)
    let db1Info = await db1.get()
    expect(await db1.exists()).toBe(true)
    expect(db1Info.name).toBe('testDb')
    expect(await dbExists(hostConfig, 'testDb')).toBe(true)
    expect(await dbDoesNotExist(hostConfig, 'testDb')).toBe(false)
    await sysDb.dropDatabase('testDb')

    db1 = await createArangoDb(sysDb, 'testDb', dbUsers, ifDbExists)
    db1Info = await db1.get()
    expect(await db1.exists()).toBe(true)
    expect(db1Info.name).toBe('testDb')
    expect(await dbIsConnected(db1)).toBe(true)
    expect(await dbIsNotConnected(db1)).toBe(false)
    expect(await dbExists(sysDb, 'testDb')).toBe(true)
    expect(await dbDoesNotExist(sysDb, 'testDb')).toBe(false)

    // 2nd creation w/o delete should throw error

    ifDbExists = IfDbExists.ThrowError

    expect(await dbExists(hostConfig, 'testDb')).toBe(true)
    expect(createArangoDb(hostConfig, 'testDb', dbUsers, ifDbExists)).rejects.toThrow(Error)
    expect(await dbExists(sysDb, 'testDb')).toBe(true)
    expect(createArangoDb(sysDb, 'testDb', dbUsers, ifDbExists)).rejects.toThrow(Error)

    // OK now lets just ask to have the existing db returned

    ifDbExists = IfDbExists.ReturnExisting

    expect(await dbExists(hostConfig, 'testDb')).toBe(true)
    let dbReturned = await createArangoDb(hostConfig, 'testDb', dbUsers, ifDbExists)
    let firstDbInfoReturedInfo = await dbReturned.get()
    expect(firstDbInfoReturedInfo.name).toBe('testDb')
    expect(firstDbInfoReturedInfo.id).toBe(db1Info.id)
    expect(await dbIsConnected(dbReturned)).toBe(true)
    expect(await dbIsNotConnected(dbReturned)).toBe(false)
    expect(await dbExists(hostConfig, 'testDb')).toBe(true)
    expect(await dbDoesNotExist(hostConfig, 'testDb')).toBe(false)

    expect(await dbExists(sysDb, 'testDb')).toBe(true)
    dbReturned = await createArangoDb(sysDb, 'testDb', dbUsers, ifDbExists)
    firstDbInfoReturedInfo = await dbReturned.get()
    expect(firstDbInfoReturedInfo.id).toBe(db1Info.id)
    expect(firstDbInfoReturedInfo.name).toBe('testDb')
    expect(await dbIsConnected(dbReturned)).toBe(true)
    expect(await dbIsNotConnected(dbReturned)).toBe(false)
    expect(await dbExists(sysDb, 'testDb')).toBe(true)
    expect(await dbDoesNotExist(sysDb, 'testDb')).toBe(false)


    // OK, now lets ask to overwrite the existing db

    ifDbExists = IfDbExists.Overwrite

    expect(await dbExists(hostConfig, 'testDb')).toBe(true)
    const db2 = await createArangoDb(hostConfig, 'testDb', dbUsers, ifDbExists)
    expect(await db2.exists()).toBe(true)
    const db2Info = await db2.get()
    expect(db2Info.name).toBe('testDb')
    expect (db2Info.id).not.toBe(db1Info.id)
    expect(await dbIsConnected(db2)).toBe(true)
    expect(await dbIsNotConnected(db2)).toBe(false)
    expect(await dbExists(hostConfig, 'testDb')).toBe(true)
    expect(await dbDoesNotExist(hostConfig, 'testDb')).toBe(false)

    expect(await dbExists(sysDb, 'testDb')).toBe(true)
    const db3 = await createArangoDb(sysDb, 'testDb', dbUsers, ifDbExists)
    const db3Info = await db3.get()
    expect(db3Info.name).toBe('testDb')
    expect(db3Info.id).not.toBe(db2Info.id)
    expect(await dbIsConnected(db3)).toBe(true)
    expect(await dbIsNotConnected(db3)).toBe(false)
    expect(await dbExists(hostConfig, 'testDb')).toBe(true)
    expect(await dbDoesNotExist(hostConfig, 'testDb')).toBe(false)
  })

  test('Collection creation', async () => {
    expect(true).toBe(true)

  })
})
