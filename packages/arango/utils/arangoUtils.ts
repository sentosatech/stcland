import { complement } from 'ramda'

import { Database } from 'arangojs'
import type {
  DocumentCollection,
  EdgeCollection,
} from 'arangojs/collection'

import { asyncComplement } from '@stcland/utils'
import { throwIf } from '@stcland/errors'

import {
  CollectionType,
  IfDbDoesNotExistOnGet,
  IfCollectionExistsOnCreate,   IfCollectionDoesNotExistOnGet,
} from './ArangoUtilsTypes'

import type {
  ArangoHostConfig, GetSysDb,
  CanConnectToServer, CanNotConnectToServer,
  DbIsConnected, DbIsNotConnected,
  CreateDb, CreateDbOptions, DropDb, GetDb, DropAllDatabases, GetDbOptions,
  DbExists, DbDoesNotExist, NonSystemDbsExists,
  CreateCollectionOpts, CreateCollection, CreateDocumentCollection, CreateEdgeCollection,
  CollectionExists, CollectionDoesNotExist, CollectionDocCount,
  GetCollection, GetDocCollection, GetEdgeCollection, DropCollection, GetCollectionType,
  DocumentExistsById, DocumentExists, DocumentDoesNotExist,
} from './ArangoUtilsTypes'
import { IfDbExistsOnCreate } from '../dist'

//*****************************************************************************
// General Utils
//*****************************************************************************

export const canConnectToServer : CanConnectToServer = async (hostConfig: ArangoHostConfig) => {
  const sysDb = await getSysDb(hostConfig)
  return dbIsConnected(sysDb)
}
export const canNotConnectToServer: CanNotConnectToServer =
  asyncComplement(canConnectToServer)

// throws error if connection fails
export const getSysDb: GetSysDb = async (
  hostConfig: ArangoHostConfig,
  opts?: { checkConnection: boolean }
) => {
  const { url = '', username = '', password = '' } = hostConfig || {}
  const sysDb = new Database({ url, auth: { username, password } })
  if (opts?.checkConnection) {
    if (await dbIsNotConnected(sysDb)) throw new Error('Sys database connection failed')
  }
  return sysDb
}

//*****************************************************************************
// Database Utils
//*****************************************************************************


export const dbIsConnected: DbIsConnected = async (db: Database) => {
  try { await db.get(); return true }
  catch (error) { return false }
}
export const dbIsNotConnected: DbIsNotConnected =
  asyncComplement(dbIsConnected)

export const isSysDb = (db: Database): boolean => db.name === '_system'
export const isNotSysDb = complement(isSysDb)


export const dbExists: DbExists = async (
  dbOrArangoHostConfig: ArangoHostConfig | Database,
  dbName: string
): Promise<boolean> => {
  const db = await getDbFromVarious(dbOrArangoHostConfig)
  if (isNotSysDb(db)) return db.exists()
  const existingDbs = await db.listDatabases()
  return existingDbs.includes(dbName)
}

// @ts-expect-error complement does not hanlde multiple signatures
export const dbDoesNotExist: DbDoesNotExist = asyncComplement(dbExists)

export const createDb: CreateDb = async (
  sysDbOrArangoHostConfig: ArangoHostConfig | Database,
  dbName: string,
  createDbOpts?: CreateDbOptions
) => {
  const sysDb = await getDbFromVarious(sysDbOrArangoHostConfig)
  if (isNotSysDb(sysDb))
    throw new Error('createArangoDb(): non system DB provided: ' + sysDb.name)

  const ifDbExists: IfDbExistsOnCreate = createDbOpts?.ifDbExists || 'ThrowError'

  let requestedDbExists = await dbExists(sysDb, dbName)

  if (requestedDbExists && ifDbExists === 'ThrowError')
    throw new Error(`Attempting to create arango database '${dbName}', but it already exists`)

  if (requestedDbExists && ifDbExists === 'Overwrite') {
    await sysDb.dropDatabase(dbName)
    requestedDbExists = false
  }

  if (!requestedDbExists)
    // actually create the database
    await sysDb.createDatabase(dbName, createDbOpts)

  // returns instance of already created database
  return sysDb.database(dbName)
}

export const getDb: GetDb = async (
  sysDbOrArangoHostConfig: ArangoHostConfig | Database,
  dbName: string,
  getDbOpts?: GetDbOptions
) => {
  const sysDb = await getDbFromVarious(sysDbOrArangoHostConfig)

  if (isNotSysDb(sysDb))
    throw new Error('getArangoDb(): non system DB provided: ' + sysDb.name)

  const ifDbDoesNotExist: IfDbDoesNotExistOnGet = getDbOpts?.ifDbDoesNotExist || 'ThrowError'
  const requestedDbExists = await dbExists(sysDb, dbName)

  if (!requestedDbExists && ifDbDoesNotExist === 'ThrowError' )
    throw new Error(`Attempting to fetch database '${dbName}', but it does not exit`)

  if (!requestedDbExists) {
    // this is OK, getDbOpts extends CreateDbOptions
    const createDbOpts = getDbOpts as CreateDbOptions
    await sysDb.createDatabase(dbName, createDbOpts)
  }

  return sysDb.database(dbName)
}

// If database does not exist, or an error was thrown by arango, returns false
export const dropDb: DropDb = async (
  sysDbOrArangoHostConfig: ArangoHostConfig | Database,
  dbName: string
): Promise<boolean> => {

  const sysDb = await getDbFromVarious(sysDbOrArangoHostConfig)

  if (isNotSysDb(sysDb))
    throw new Error('deleteArangoDb(): non system DB provided: ' + sysDb.name)

  if (await dbDoesNotExist(sysDb, dbName)) return false

  try {
    await sysDb.dropDatabase(dbName)
  }  catch (error) {
    console.warn(`deleteArangoDb(): Error deleting database '${dbName}': `, error)
    return false
  }
  return true
}

export const dropAllDatabases: DropAllDatabases = async (
  sysDbOrArangoHostConfig: ArangoHostConfig | Database
): Promise<boolean> => {

  let success = true
  const sysDb = await getDbFromVarious(sysDbOrArangoHostConfig)

  if (isNotSysDb(sysDb))
    throw new Error('deleteAllArangoDatabases(): non system DB provided: ' + sysDb.name)

  const existingDbs = await sysDb.listDatabases()
  for (const dbName of existingDbs) {

    // avoid system databases _system and _users (and possibly othersin the future)
    if (dbName.startsWith('_')) continue

    try {
      await sysDb.dropDatabase(dbName)
    }
    catch (error) {
      console.warn(`deleteAllArangoDatabases(): Error deleting database '${dbName}': `, error)
      success = false
    }
  }
  return success
}

export const nonSystemDbsExists: NonSystemDbsExists = async (
  sysDbOrArangoHostConfig: ArangoHostConfig | Database
): Promise<boolean> => {

  const sysDb = await getDbFromVarious(sysDbOrArangoHostConfig)

  if (isNotSysDb(sysDb))
    throw new Error('nonSystemDbsExists(): non system DB provided: ' + sysDb.name)

  const existingDbs = await sysDb.listDatabases()
  return existingDbs.some(dbName => !dbName.startsWith('_'))
}

export const documentExists: DocumentExists = async (
  db: Database,
  collectionName: string,
  documentKey: string
) => {
  try {
    const collection = db.collection(collectionName)
    const exists = await collection.documentExists(documentKey)
    return exists
  } catch (error) {
    return false
  }
}

export const documentDoesNotExist: DocumentDoesNotExist =
  asyncComplement(documentExists)

export const documentExistsById: DocumentExistsById = async (
  db, documentId
) => {
  const [collectionName, documentKey] = documentId.split('/')
  return documentExists(db, collectionName, documentKey)
}


export const documentDoesNotExistById: DocumentExistsById =
  asyncComplement(documentExistsById)

//*****************************************************************************
// Collcection Utils
//*****************************************************************************

export const collectionExists: CollectionExists = (
  db: Database,
  collectionName: string
) => db.collection(collectionName).exists()

export const collectionDoesNotExist: CollectionDoesNotExist =
  asyncComplement(collectionExists)

export const createCollection: CreateCollection = async (
  db: Database,
  collectionName: string,
  opts: CreateCollectionOpts
) => {
  const {
    ifExists = IfCollectionExistsOnCreate.ThrowError,
    type = CollectionType.EDGE_COLLECTION
  } = opts || {}

  const collection = db.collection(collectionName)
  let collectionExists = await collection.exists()

  if (collectionExists && ifExists === IfCollectionExistsOnCreate.ThrowError)
    throw new Error(`DB ${db.name}: Attempting to create collection '${collectionName}', but it already exists`)

  if (collectionExists && ifExists === IfCollectionExistsOnCreate.Overwrite) {
    await collection.drop()
    collectionExists = false
  }

  if (!collectionExists) await collection.create({ type })
  return collection
}

const collectionTypeToString = (type: CollectionType): string =>
  type === CollectionType.DOCUMENT_COLLECTION ? 'document' : 'edge'

export const getCollection: GetCollection = async (
  db: Database,
  collectionName: string,
  ifCollectionDoesNotExist: IfCollectionDoesNotExistOnGet = IfCollectionDoesNotExistOnGet.ThrowError,
  collectionType: CollectionType
) => {

  const collection = db.collection(collectionName)
  const collectionExists = await collection.exists()

  const existingCollectionType =
    collectionExists ? (await collection.properties()).type : null

  throwIf(
    !collectionExists && ifCollectionDoesNotExist === IfCollectionDoesNotExistOnGet.ThrowError,
    `getCollection() DB ${db.name}: Attempting to fetch collection '${collectionName}', but it does not exist`
  )

  throwIf(
    !collectionExists && ifCollectionDoesNotExist === IfCollectionDoesNotExistOnGet.Create && !collectionType,
    `getCollection() DB ${db.name}: Need to create '${collectionName}', but collection type not provided`
  )

  throwIf(
    collectionExists && collectionType && collectionType !== existingCollectionType,
    'getCollection()\n' +
    `  DB ${db.name}: fetching collection '${collectionName}' \n` +
    `  Collection exists, but not of requested type: ${collectionTypeToString(collectionType)} collection`
  )

  if (!collectionExists) await collection.create({ type: collectionType })

  return collection
}

export const getDocCollection: GetDocCollection = async (
  db: Database,
  collectionName: string,
  ifCollectionDoesNotExist: IfCollectionDoesNotExistOnGet = IfCollectionDoesNotExistOnGet.ThrowError,
) => getCollection(
  db, collectionName, ifCollectionDoesNotExist, CollectionType.DOCUMENT_COLLECTION
)

export const getEdgeCollection: GetEdgeCollection = async (
  db: Database,
  collectionName: string,
  ifCollectionDoesNotExist: IfCollectionDoesNotExistOnGet = IfCollectionDoesNotExistOnGet.ThrowError,
) => getCollection(
  db, collectionName, ifCollectionDoesNotExist, CollectionType.EDGE_COLLECTION
)

export const getCollectionType: GetCollectionType = async (
  collectionOrDb: DocumentCollection | EdgeCollection | Database,
  collectionNameOrUndefined?: string
) => {
  // if only 1 argument, then first argument is a collection
  const collection = collectionNameOrUndefined
    ? (collectionOrDb as Database).collection(collectionNameOrUndefined)
    : collectionOrDb as DocumentCollection | EdgeCollection
  const type = (await collection.properties()).type
  return type
}

export const dropCollection: DropCollection = async (
  db: Database,
  collectionName: string
) => {
  const collection = db.collection(collectionName)
  if (await collection.exists()) {
    await collection.drop()
    return true
  }
  console.warn(`DB ${db.name}: Attempting to drop collection '${collectionName}', but it does not exist`)
  return false
}

export const collectionDocCount: CollectionDocCount = async (
  collection: DocumentCollection | EdgeCollection
) => {
  const c = await collection.count()
  return c.count
}

export const createDocCollection: CreateDocumentCollection = async (
  db: Database,
  collectionName: string,
  ifExists: IfCollectionExistsOnCreate = IfCollectionExistsOnCreate.ThrowError
) => {
  const opts = { ifExists, type: CollectionType.DOCUMENT_COLLECTION }
  return createCollection(db, collectionName, opts) as Promise<DocumentCollection>
}

export const createEdgeCollection: CreateEdgeCollection = async (
  db: Database,
  collectionName: string,
  ifExists: IfCollectionExistsOnCreate = IfCollectionExistsOnCreate.ThrowError
) => {
  const opts = { ifExists, type: CollectionType.EDGE_COLLECTION }
  return createCollection(db, collectionName, opts) as Promise<EdgeCollection>
}


//*****************************************************************************
// module only functions
//*****************************************************************************

const isHostConfig = (arg: any): boolean => {
  return arg.url && typeof arg.url === 'string'
}
const getDbFromVarious = async (
  sysDbOrArangoHostConfig: ArangoHostConfig | Database
): Promise<Database> =>
  isHostConfig(sysDbOrArangoHostConfig)
    ? await getSysDb(sysDbOrArangoHostConfig as ArangoHostConfig)
    : sysDbOrArangoHostConfig as Database
