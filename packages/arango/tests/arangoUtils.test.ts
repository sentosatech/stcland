import {
  describe, test, beforeEach, afterEach, beforeAll, expect
} from 'vitest'

import type { ArangoHostConfig, DataBaseUser } from '../utils'
import {
  getSysDb, dropDb,
  canConnectToDbServer, canNotConnectToDbServer,
  dbExists, dbDoesNotExist,
  dbIsConnected, dbIsNotConnected,
  IfDbExistsOnCreate, createDb,
  IfDbDoesNotExistOnGet, getDb,
  collectionExists, collectionDoesNotExist,
  IfCollectionExistsOnCreate, CollectionType,
  createCollection, createDocCollection, createEdgeCollection,
  IfCollectionDoesNotExistOnGet,
  collectionDocCount,
  getCollection,
  dropCollection
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

const dbName = 'arangoUtilsTestDb'

let sysDb: Database

beforeAll(async () => {

  expect(await canConnectToDbServer(hostConfig)).toBe(true)
  expect(await canNotConnectToDbServer(hostConfig)).toBe(false)

  sysDb = await getSysDb(hostConfig, { checkConnection: true })
  if (await dbExists(sysDb, dbName)) {
    console.warn(`WARNING: test start: ${dbName} exists, dropping it`)
    await dropDb(sysDb, dbName)
  }
})

beforeEach(async () => {
})

afterEach(async () => {
  await dropDb(sysDb, dbName)
})

describe('Test @stcland/arango/utils', async () => {

  test('DB creation', async () => {

    // First creation

    let ifDbExists = IfDbExistsOnCreate.ThrowError

    let db1 = await createDb(hostConfig, dbName, dbUsers, ifDbExists)
    let db1Info = await db1.get()
    expect(await db1.exists()).toBe(true)
    expect(db1Info.name).toBe(dbName)
    expect(await dbExists(hostConfig, dbName)).toBe(true)
    expect(await dbDoesNotExist(hostConfig, dbName)).toBe(false)
    await sysDb.dropDatabase(dbName)

    db1 = await createDb(sysDb, dbName, dbUsers, ifDbExists)
    db1Info = await db1.get()
    expect(await db1.exists()).toBe(true)
    expect(db1Info.name).toBe(dbName)
    expect(await dbIsConnected(db1)).toBe(true)
    expect(await dbIsNotConnected(db1)).toBe(false)
    expect(await dbExists(sysDb, dbName)).toBe(true)
    expect(await dbDoesNotExist(sysDb, dbName)).toBe(false)

    // 2nd creation w/o delete should throw error

    ifDbExists = IfDbExistsOnCreate.ThrowError

    expect(await dbExists(hostConfig, dbName)).toBe(true)
    expect(createDb(hostConfig, dbName, dbUsers, ifDbExists)).rejects.toThrow(Error)
    expect(await dbExists(sysDb, dbName)).toBe(true)
    expect(createDb(sysDb, dbName, dbUsers, ifDbExists)).rejects.toThrow(Error)

    // OK now lets just ask to have the existing db returned

    ifDbExists = IfDbExistsOnCreate.ReturnExisting

    expect(await dbExists(hostConfig, dbName)).toBe(true)
    let dbReturned = await createDb(hostConfig, dbName, dbUsers, ifDbExists)
    let firstDbInfoReturedInfo = await dbReturned.get()
    expect(firstDbInfoReturedInfo.name).toBe(dbName)
    expect(firstDbInfoReturedInfo.id).toBe(db1Info.id)
    expect(await dbIsConnected(dbReturned)).toBe(true)
    expect(await dbIsNotConnected(dbReturned)).toBe(false)
    expect(await dbExists(hostConfig, dbName)).toBe(true)
    expect(await dbDoesNotExist(hostConfig, dbName)).toBe(false)

    expect(await dbExists(sysDb, dbName)).toBe(true)
    dbReturned = await createDb(sysDb, dbName, dbUsers, ifDbExists)
    firstDbInfoReturedInfo = await dbReturned.get()
    expect(firstDbInfoReturedInfo.id).toBe(db1Info.id)
    expect(firstDbInfoReturedInfo.name).toBe(dbName)
    expect(await dbIsConnected(dbReturned)).toBe(true)
    expect(await dbIsNotConnected(dbReturned)).toBe(false)
    expect(await dbExists(sysDb, dbName)).toBe(true)
    expect(await dbDoesNotExist(sysDb, dbName)).toBe(false)


    // OK, now lets ask to overwrite the existing db

    ifDbExists = IfDbExistsOnCreate.Overwrite

    expect(await dbExists(hostConfig, dbName)).toBe(true)
    const db2 = await createDb(hostConfig, dbName, dbUsers, ifDbExists)
    expect(await db2.exists()).toBe(true)
    const db2Info = await db2.get()
    expect(db2Info.name).toBe(dbName)
    expect (db2Info.id).not.toBe(db1Info.id)
    expect(await dbIsConnected(db2)).toBe(true)
    expect(await dbIsNotConnected(db2)).toBe(false)
    expect(await dbExists(hostConfig, dbName)).toBe(true)
    expect(await dbDoesNotExist(hostConfig, dbName)).toBe(false)

    expect(await dbExists(sysDb, dbName)).toBe(true)
    const db3 = await createDb(sysDb, dbName, dbUsers, ifDbExists)
    const db3Info = await db3.get()
    expect(db3Info.name).toBe(dbName)
    expect(db3Info.id).not.toBe(db2Info.id)
    expect(await dbIsConnected(db3)).toBe(true)
    expect(await dbIsNotConnected(db3)).toBe(false)
    expect(await dbExists(hostConfig, dbName)).toBe(true)
    expect(await dbDoesNotExist(hostConfig, dbName)).toBe(false)

    // Lets test database fetch

    const db4 = await getDb(hostConfig, dbName)
    const db4Info = await db4.get()
    expect(db4Info.name).toBe(dbName)
    expect(db4Info.id).toBe(db3Info.id)

    await dropDb(hostConfig, dbName)
    expect(await dbExists(hostConfig, dbName)).toBe(false)
    expect(getDb(hostConfig, dbName)).rejects.toThrow(Error)

    const db5 = await getDb(hostConfig, dbName, IfDbDoesNotExistOnGet.Create, dbUsers)
    const db5Info = await db5.get()
    expect(db5Info.name).toBe(dbName)
    expect(db5Info.id).not.toBe(db4Info.id)
  })

  test('Document Collection creation', async () => {

    const name = 'testDocCollection'
    const type = CollectionType.DOCUMENT_COLLECTION

    const db = await createDb(hostConfig, dbName, dbUsers, IfDbExistsOnCreate.ThrowError)
    expect(await dbExists(hostConfig, dbName)).toBe(true)

    expect(await collectionExists(db, name)).toBe(false)
    expect(await collectionDoesNotExist(db, name)).toBe(true)

    // First creation

    let ifExists = IfCollectionExistsOnCreate.ThrowError
    const collection1 = await createDocCollection(db, name, ifExists)
    expect(await collectionExists(db, name)).toBe(true)
    expect(await collectionDoesNotExist(db, name)).toBe(false)


    await collection1.save({ name: 'doc1' })
    expect(await collectionDocCount(collection1)).toBe(1)

    // Error if collection aready exists

    ifExists = IfCollectionExistsOnCreate.ThrowError
    expect(createCollection(db, name, { type, ifExists })).rejects.toThrow(Error)
    expect(createDocCollection(db, name, ifExists)).rejects.toThrow(Error)

    ifExists = IfCollectionExistsOnCreate.Overwrite
    const collection2 = await createDocCollection(db, name, ifExists)
    expect(await collectionExists(db, name)).toBe(true)
    expect(await collectionDoesNotExist(db, name)).toBe(false)
    expect(await collectionDocCount(collection2)).toBe(0)

    await collection1.save({ name: 'doc2' })
    expect(await collectionDocCount(collection2)).toBe(1)

    // Fetch collections

    const collection3 = await getCollection(db, name)
    expect(await collectionDocCount(collection3)).toBe(1)

    expect(await dropCollection(db, name)).toBe(true)
    expect(await collectionDoesNotExist(db, name)).toBe(true)
    expect(getCollection(db, name)).rejects.toThrow(Error)

    const collection4 = await getCollection(db, name, IfCollectionDoesNotExistOnGet.Create)
    expect(await collectionExists(db, name)).toBe(true)
    expect(await collectionDocCount(collection4)).toBe(0)
  })

  test('Edge Collection creation', async () => {

    const db = await createDb(hostConfig, dbName, dbUsers, IfDbExistsOnCreate.ThrowError)
    expect(await dbExists(hostConfig, dbName)).toBe(true)

    // Create source and target collections and docs for edge creation

    const srcDocCollectionName = 'sourceDocs'
    const destDocCollectionName = 'destDocs'
    expect(await collectionExists(db, srcDocCollectionName)).toBe(false)
    expect(await collectionExists(db, destDocCollectionName)).toBe(false)

    const srcDocCollection = await createDocCollection(db, srcDocCollectionName)
    expect(await collectionExists(db, srcDocCollectionName)).toBe(true)
    await srcDocCollection.save({ _key: 'sourceDoc1', name: 'sourceDoc1' })
    expect(await collectionDocCount(srcDocCollection)).toBe(1)

    const destDocCollection = await createDocCollection(db, destDocCollectionName)
    expect(await collectionExists(db, destDocCollectionName)).toBe(true)
    await destDocCollection.save({ _key: 'destDoc1', name: 'destDoc1' })
    expect(await collectionDocCount(destDocCollection)).toBe(1)

    const edgeCollectionName = 'testEdgeCollection1'

    expect(await collectionExists(db, edgeCollectionName)).toBe(false)

    // First creation

    let ifExists = IfCollectionExistsOnCreate.ThrowError
    const edgeCollection1 = await createEdgeCollection(db, edgeCollectionName, ifExists)
    expect(await collectionExists(db, edgeCollectionName)).toBe(true)
    expect(await collectionDoesNotExist(db, edgeCollectionName)).toBe(false)

    await edgeCollection1.save({
      _from: srcDocCollectionName + '/sourceDoc1',
      _to: destDocCollectionName + '/destDoc1'
    })

    expect(await collectionDocCount(edgeCollection1)).toBe(1)

    // Error if collection aready exists

    ifExists = IfCollectionExistsOnCreate.ThrowError
    expect(createEdgeCollection(db, edgeCollectionName, ifExists)).rejects.toThrow(Error)
    expect(await collectionExists(db, edgeCollectionName)).toBe(true)

    // Return existing collection

    ifExists = IfCollectionExistsOnCreate.ReturnExisting
    const returnedEdgeCollection = await createEdgeCollection(db, edgeCollectionName, ifExists)
    expect(await collectionExists(db, edgeCollectionName)).toBe(true)
    expect(edgeCollection1).toBe(returnedEdgeCollection)

    expect(await collectionDocCount(returnedEdgeCollection)).toBe(1)
    await edgeCollection1.save({
      _from: srcDocCollectionName + '/sourceDoc1',
      _to: destDocCollectionName + '/destDoc1'
    })
    expect(await collectionDocCount(returnedEdgeCollection)).toBe(2)

    // overwrite existing collection

    ifExists = IfCollectionExistsOnCreate.Overwrite
    const overwrittenCollection = await createEdgeCollection(db, edgeCollectionName, ifExists)
    expect(await collectionExists(db, edgeCollectionName)).toBe(true)
    expect(await collectionDoesNotExist(db, edgeCollectionName)).toBe(false)
    expect(await collectionDocCount(overwrittenCollection)).toBe(0)
  })
})
