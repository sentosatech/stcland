import {
  describe, test, beforeAll, afterAll, expect
} from 'vitest'

import { values } from 'ramda'

import type {
  ArangoHostConfig,
  IfCollectionExistsOnCreate,
  IfCollectionDoesNotExistOnGet,
  IfDbDoesNotExistOnGet,
} from '../utils'

import {
  CollectionType,
  getSysDb,
  canConnectToServer, canNotConnectToServer,
  dbExists, dbDoesNotExist,
  dbIsConnected, dbIsNotConnected,
  createDb, getDb, dropDb,
  collectionExists, collectionDoesNotExist,
  createCollection, createDocCollection, createEdgeCollection,
  getCollection, getDocCollection, getEdgeCollection, getCollectionType,
  collectionDocCount, dropCollection,
  documentExistsById, documentDoesNotExistById,
  documentExists, documentDoesNotExist,
} from '../utils'

import { Database } from 'arangojs'
import { IfDbExistsOnCreate } from '../utils'

const hostConfig: ArangoHostConfig = {
  url: 'http://localhost:8529',
  username: 'root',
  password: 'pw',
}

const users = [
  { username: 'root', passwd: 'pw' },
]

let sysDb: Database

const dbNames = {
  db: 'arangoUtilsTestDb',
  docCollections: 'arangoUtilsTestDocCollections',
  getEdgeCollections: 'arangoUtilsTestEdgeCollections',
}

beforeAll(async () => {
  expect(await canConnectToServer(hostConfig)).toBe(true)
  expect(await canNotConnectToServer(hostConfig)).toBe(false)
  sysDb = await getSysDb(hostConfig, { checkConnection: true })
})

afterAll(async () => {
  for (const dbName of values(dbNames)) {
    await dropDb(sysDb, dbName)
  }
})

describe('Test @stcland/arango/utils', async () => {

  test('DB creation', async () => {

    const dbName = dbNames.db
    if (await dbExists(sysDb, dbName)) {
      console.warn(`WARNING: test start: ${dbName} exists, dropping it`)
      await dropDb(sysDb, dbName)
    }

    // First creation

    let ifDbExists: IfDbExistsOnCreate = 'ThrowError'

    let db1 = await createDb(hostConfig, dbName, { users, ifDbExists })
    let db1Info = await db1.get()
    expect(await db1.exists()).toBe(true)
    expect(db1Info.name).toBe(dbName)
    expect(await dbExists(hostConfig, dbName)).toBe(true)
    expect(await dbDoesNotExist(hostConfig, dbName)).toBe(false)
    await sysDb.dropDatabase(dbName)

    db1 = await createDb(sysDb, dbName, { users, ifDbExists })
    db1Info = await db1.get()
    expect(await db1.exists()).toBe(true)
    expect(db1Info.name).toBe(dbName)
    expect(await dbIsConnected(db1)).toBe(true)
    expect(await dbIsNotConnected(db1)).toBe(false)
    expect(await dbExists(sysDb, dbName)).toBe(true)
    expect(await dbDoesNotExist(sysDb, dbName)).toBe(false)

    // 2nd creation w/o delete should throw error

    ifDbExists = 'ThrowError'

    expect(await dbExists(hostConfig, dbName)).toBe(true)
    await expect(createDb(hostConfig, dbName, { users, ifDbExists })).rejects.toThrow(Error)
    expect(await dbExists(sysDb, dbName)).toBe(true)
    await expect(createDb(sysDb, dbName, { users, ifDbExists })).rejects.toThrow(Error)

    // OK now lets just ask to have the existing db returned

    ifDbExists = 'ReturnExisting'

    expect(await dbExists(hostConfig, dbName)).toBe(true)
    let dbReturned = await createDb(hostConfig, dbName, { users, ifDbExists })
    let firstDbInfoReturedInfo = await dbReturned.get()
    expect(firstDbInfoReturedInfo.name).toBe(dbName)
    expect(firstDbInfoReturedInfo.id).toBe(db1Info.id)
    expect(await dbIsConnected(dbReturned)).toBe(true)
    expect(await dbIsNotConnected(dbReturned)).toBe(false)
    expect(await dbExists(hostConfig, dbName)).toBe(true)
    expect(await dbDoesNotExist(hostConfig, dbName)).toBe(false)

    expect(await dbExists(sysDb, dbName)).toBe(true)
    dbReturned = await createDb(sysDb, dbName, { users, ifDbExists })
    firstDbInfoReturedInfo = await dbReturned.get()
    expect(firstDbInfoReturedInfo.id).toBe(db1Info.id)
    expect(firstDbInfoReturedInfo.name).toBe(dbName)
    expect(await dbIsConnected(dbReturned)).toBe(true)
    expect(await dbIsNotConnected(dbReturned)).toBe(false)
    expect(await dbExists(sysDb, dbName)).toBe(true)
    expect(await dbDoesNotExist(sysDb, dbName)).toBe(false)


    // OK, now lets ask to overwrite the existing db

    ifDbExists = 'Overwrite'

    expect(await dbExists(hostConfig, dbName)).toBe(true)
    const db2 = await createDb(hostConfig, dbName, { users, ifDbExists })
    expect(await db2.exists()).toBe(true)
    const db2Info = await db2.get()
    expect(db2Info.name).toBe(dbName)
    expect (db2Info.id).not.toBe(db1Info.id)
    expect(await dbIsConnected(db2)).toBe(true)
    expect(await dbIsNotConnected(db2)).toBe(false)
    expect(await dbExists(hostConfig, dbName)).toBe(true)
    expect(await dbDoesNotExist(hostConfig, dbName)).toBe(false)

    expect(await dbExists(sysDb, dbName)).toBe(true)
    const db3 = await createDb(sysDb, dbName, { users, ifDbExists })
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
    await expect(getDb(hostConfig, dbName)).rejects.toThrow(Error)

    // create db if it does not exist
    const ifDbDoesNotExist: IfDbDoesNotExistOnGet = 'Create'
    const db5 = await getDb(hostConfig, dbName, { users, ifDbDoesNotExist })
    const db5Info = await db5.get()
    expect(db5Info.name).toBe(dbName)
    expect(db5Info.id).not.toBe(db4Info.id)
  })

  test('Document Collection creation', async () => {

    const dbName = dbNames.docCollections

    if (await dbExists(sysDb, dbName)) {
      console.warn(`WARNING: test start: ${dbName} exists, dropping it`)
      await dropDb(sysDb, dbName)
    }

    const collectionName = 'testDocCollection'
    const collectionType = CollectionType.DOCUMENT_COLLECTION

    const ifDbExists = 'ThrowError'
    const db = await createDb(hostConfig, dbName, { users, ifDbExists })
    expect(await dbExists(hostConfig, dbName)).toBe(true)

    expect(await collectionExists(db, collectionName)).toBe(false)
    expect(await collectionDoesNotExist(db, collectionName)).toBe(true)

    // First creation

    let ifExists: IfCollectionExistsOnCreate = 'ThrowError'
    const collection1 = await createDocCollection(db, collectionName, ifExists)
    expect(await collectionExists(db, collectionName)).toBe(true)
    expect(await collectionDoesNotExist(db, collectionName)).toBe(false)
    expect(await collectionDocCount(collection1)).toBe(0)
    expect(await getCollectionType(collection1)).toBe(CollectionType.DOCUMENT_COLLECTION)
    expect(await getCollectionType(db, collectionName)).toBe(CollectionType.DOCUMENT_COLLECTION)


    let _key = 'doc1'; let name = _key; let docId = `${collectionName}/${_key}`
    await collection1.save({ _key, name })
    expect(await documentExists(db, collectionName, _key)).toBe(true)
    expect(await documentExistsById(db, docId)).toBe(true)
    expect(await documentDoesNotExist(db, collectionName, _key)).toBe(false)
    expect(await documentDoesNotExistById(db, docId)).toBe(false)
    expect(await collectionDocCount(collection1)).toBe(1)

    // Error if collection aready exists

    ifExists = 'ThrowError'
    await expect(createCollection(db, collectionName, { type: collectionType, ifExists })).rejects.toThrow(Error)
    await expect(createDocCollection(db, collectionName, ifExists)).rejects.toThrow(Error)

    ifExists = 'Overwrite'
    const collection2 = await createDocCollection(db, collectionName, ifExists)
    expect(await collectionExists(db, collectionName)).toBe(true)
    expect(await collectionDoesNotExist(db, collectionName)).toBe(false)
    expect(await collectionDocCount(collection2)).toBe(0)
    expect(await getCollectionType(collection2)).toBe(CollectionType.DOCUMENT_COLLECTION)
    expect(await getCollectionType(db, collectionName)).toBe(CollectionType.DOCUMENT_COLLECTION)

    // Fetch collections

    _key = 'doc2'; name = _key; docId = `${collectionName}/${_key}`
    await collection1.save({ _key, name })
    expect(await documentExistsById(db, docId)).toBe(true)
    expect(await documentDoesNotExistById(db, docId)).toBe(false)
    expect(await collectionDocCount(collection2)).toBe(1)

    const collection3 = await getCollection(db, collectionName)
    expect(await collectionDocCount(collection3)).toBe(1)
    expect(await getCollectionType(collection3)).toBe(CollectionType.DOCUMENT_COLLECTION)
    expect(await getCollectionType(db, collectionName)).toBe(CollectionType.DOCUMENT_COLLECTION)

    expect(await dropCollection(db, collectionName)).toBe(true)
    expect(await collectionDoesNotExist(db, collectionName)).toBe(true)

    // When collection does not exist, and you specify create, but no type, it should throw
    let ifCollectionDoesNotExist: IfCollectionDoesNotExistOnGet = 'Create'
    await expect(getCollection(db, collectionName, ifCollectionDoesNotExist)).rejects.toThrow()

    // Throw on non existance is default
    await expect(getDocCollection(db, collectionName)).rejects.toThrow()

    // OK lets specify create when collection does not exist
    ifCollectionDoesNotExist = 'Create'
    const collection4 = await getDocCollection(db, collectionName, ifCollectionDoesNotExist)
    expect(await collectionExists(db, collectionName)).toBe(true)
    expect(await getCollectionType(db, collectionName)).toBe(CollectionType.DOCUMENT_COLLECTION)
    expect(await getCollectionType(collection4)).toBe(CollectionType.DOCUMENT_COLLECTION)
    await expect(getCollection(db, collectionName, ifCollectionDoesNotExist)).resolves.not.toThrow()
    expect(await collectionDocCount(collection4)).toBe(0)
    expect(await getCollectionType(collection3)).toBe(CollectionType.DOCUMENT_COLLECTION)
    expect(await getCollectionType(db, collectionName)).toBe(CollectionType.DOCUMENT_COLLECTION)

    // SHould throw if we attempt to get colleciton of wrong type
    await expect(getEdgeCollection(db, collectionName, ifCollectionDoesNotExist)).rejects.toThrow()

    ifCollectionDoesNotExist = 'ThrowError'
    expect(await dropCollection(db, collectionName)).toBe(true)
    await expect(getCollection(db, collectionName, ifCollectionDoesNotExist)).rejects.toThrow()
    await expect(getDocCollection(db, collectionName, ifCollectionDoesNotExist)).rejects.toThrow()
  })

  test('Edge Collection creation', async () => {

    const dbName = dbNames.getEdgeCollections

    if (await dbExists(sysDb, dbName)) {
      console.warn(`WARNING: test start: ${dbName} exists, dropping it`)
      await dropDb(sysDb, dbName)
    }
    const ifDbExists = 'ThrowError'
    const db = await createDb(hostConfig, dbName, { users, ifDbExists })
    expect(await dbExists(hostConfig, dbName)).toBe(true)

    // Create source and target collections and docs for edge creation

    const srcDocCollectionName = 'sourceDocs'
    const destDocCollectionName = 'destDocs'

    expect(await collectionExists(db, srcDocCollectionName)).toBe(false)
    expect(await collectionExists(db, destDocCollectionName)).toBe(false)

    const srcDocCollection = await createDocCollection(db, srcDocCollectionName)
    expect(await collectionExists(db, srcDocCollectionName)).toBe(true)
    expect(await getCollectionType(srcDocCollection)).toBe(CollectionType.DOCUMENT_COLLECTION)
    expect(await getCollectionType(db, srcDocCollectionName)).toBe(CollectionType.DOCUMENT_COLLECTION)


    let _key = 'sourceDoc1'; let name = _key; let docId = `${srcDocCollectionName}/${_key}`
    await srcDocCollection.save({ _key, name })
    expect(await documentExists(db, srcDocCollectionName, _key)).toBe(true)
    expect(await documentDoesNotExist(db, srcDocCollectionName, _key)).toBe(false)
    expect(await collectionDocCount(srcDocCollection)).toBe(1)


    const destDocCollection = await createDocCollection(db, destDocCollectionName)
    expect(await collectionExists(db, destDocCollectionName)).toBe(true)
    expect(await getCollectionType(destDocCollection)).toBe(CollectionType.DOCUMENT_COLLECTION)
    expect(await getCollectionType(db, destDocCollectionName)).toBe(CollectionType.DOCUMENT_COLLECTION)

    _key = 'destDoc1'; name = _key; docId = `${destDocCollectionName}/${_key}`
    await destDocCollection.save({ _key, name })
    expect(await documentExistsById(db, docId)).toBe(true)
    expect(await documentDoesNotExistById(db, docId)).toBe(false)
    expect(await collectionDocCount(destDocCollection)).toBe(1)

    const edgeCollectionName = 'testEdgeCollection1'

    expect(await collectionExists(db, edgeCollectionName)).toBe(false)

    // First creation

    let ifExists: IfCollectionExistsOnCreate = 'ThrowError'
    const edgeCollection1 = await createEdgeCollection(db, edgeCollectionName, ifExists)
    expect(await collectionExists(db, edgeCollectionName)).toBe(true)
    expect(await collectionDoesNotExist(db, edgeCollectionName)).toBe(false)
    expect(await getCollectionType(edgeCollection1)).toBe(CollectionType.EDGE_COLLECTION)
    expect(await getCollectionType(db, edgeCollectionName)).toBe(CollectionType.EDGE_COLLECTION)

    _key = 'edge1'; docId = `${edgeCollectionName}/${_key}`
    let from = 'sourceDoc1'; let _from = srcDocCollectionName + '/' + from
    let to = 'destDoc1'; let _to = destDocCollectionName + '/' + to
    await edgeCollection1.save({ _key, _from, _to })
    expect(await documentExistsById(db, docId)).toBe(true)
    expect(await documentDoesNotExistById(db, docId)).toBe(false)
    expect(await collectionDocCount(edgeCollection1)).toBe(1)

    // Error if collection aready exists

    ifExists = 'ThrowError'
    await expect(createEdgeCollection(db, edgeCollectionName, ifExists)).rejects.toThrow(Error)
    expect(await collectionExists(db, edgeCollectionName)).toBe(true)

    // Return existing collection

    ifExists = 'ReturnExisting'
    const returnedEdgeCollection = await createEdgeCollection(db, edgeCollectionName, ifExists)
    expect(await collectionExists(db, edgeCollectionName)).toBe(true)
    expect(edgeCollection1).toBe(returnedEdgeCollection)
    expect(await getCollectionType(returnedEdgeCollection)).toBe(CollectionType.EDGE_COLLECTION)
    expect(await getCollectionType(db, edgeCollectionName)).toBe(CollectionType.EDGE_COLLECTION)

    expect(await collectionDocCount(returnedEdgeCollection)).toBe(1)



    _key = 'edge2'; docId = `${edgeCollectionName}/${_key}`
    from = 'sourceDoc1'; _from = srcDocCollectionName + '/' + from
    to = 'destDoc1'; _to = destDocCollectionName + '/' + to
    await edgeCollection1.save({ _key, _from, _to })
    expect(await documentExistsById(db, docId)).toBe(true)
    expect(await documentDoesNotExistById(db, docId)).toBe(false)
    expect(await collectionDocCount(returnedEdgeCollection)).toBe(2)

    // overwrite existing collection

    ifExists = 'Overwrite'
    const overwrittenEdgeCollection = await createEdgeCollection(db, edgeCollectionName, ifExists)
    expect(await collectionExists(db, edgeCollectionName)).toBe(true)
    expect(await collectionDoesNotExist(db, edgeCollectionName)).toBe(false)
    expect(await collectionDocCount(overwrittenEdgeCollection)).toBe(0)
    expect(await getCollectionType(overwrittenEdgeCollection)).toBe(CollectionType.EDGE_COLLECTION)
    expect(await getCollectionType(db, edgeCollectionName)).toBe(CollectionType.EDGE_COLLECTION)

    // Fetch collections

    _key = 'edge2'; docId = `${edgeCollectionName}/${_key}`
    from = 'sourceDoc1'; _from = srcDocCollectionName + '/' + from
    to = 'destDoc1'; _to = destDocCollectionName + '/' + to
    await overwrittenEdgeCollection.save({ _key, _from, _to })
    expect(await documentExists(db, edgeCollectionName, _key)).toBe(true)
    expect(await documentDoesNotExist(db, edgeCollectionName, _key)).toBe(false)
    expect(await collectionDocCount(overwrittenEdgeCollection)).toBe(1)

    const edgeCollection2 = await getCollection(db, edgeCollectionName)
    expect(await collectionDocCount(edgeCollection2)).toBe(1)
    expect(await getCollectionType(edgeCollection2)).toBe(CollectionType.EDGE_COLLECTION)
    expect(await getCollectionType(db, edgeCollectionName)).toBe(CollectionType.EDGE_COLLECTION)

    expect(await dropCollection(db, edgeCollectionName)).toBe(true)
    expect(await collectionDoesNotExist(db, edgeCollectionName)).toBe(true)

    // When collection does not exist, and you specify create, but no type, it should throw
    let ifCollectionDoesNotExist: IfCollectionDoesNotExistOnGet = 'Create'
    await expect(getCollection(db, edgeCollectionName, ifCollectionDoesNotExist)).rejects.toThrow()

    // Throw on non existance is default
    await expect(getEdgeCollection(db, edgeCollectionName)).rejects.toThrow()

    // OK lets specify create when collection does not exist
    ifCollectionDoesNotExist = 'Create'
    const edgeCollection3 = await getEdgeCollection(db, edgeCollectionName, ifCollectionDoesNotExist)
    expect(await collectionExists(db, edgeCollectionName)).toBe(true)
    expect(await getCollectionType(db, edgeCollectionName)).toBe(CollectionType.EDGE_COLLECTION)
    expect(await getCollectionType(edgeCollection3)).toBe(CollectionType.EDGE_COLLECTION)
    await expect(getCollection(db, edgeCollectionName, ifCollectionDoesNotExist)).resolves.not.toThrow()
    expect(await collectionDocCount(edgeCollection3)).toBe(0)

    // SHould throw if we attempt to get colleciton of wrong type
    await expect(getDocCollection(db, edgeCollectionName, ifCollectionDoesNotExist)).rejects.toThrow()

    ifCollectionDoesNotExist = 'ThrowError'
    expect(await dropCollection(db, edgeCollectionName)).toBe(true)
    await expect(getCollection(db, edgeCollectionName, ifCollectionDoesNotExist)).rejects.toThrow()
    await expect(getEdgeCollection(db, edgeCollectionName, ifCollectionDoesNotExist)).rejects.toThrow()

  })
})
