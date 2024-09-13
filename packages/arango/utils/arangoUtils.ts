import { complement } from 'ramda'

import { Database } from 'arangojs'
import type {
  DocumentCollection,
  EdgeCollection,
} from 'arangojs/collection'

import { asyncComplement } from '@stcland/utils'

import {
  IfDbExists, IfCollectionExists, CollectionType
} from './ArangoUtilsTypes'

import type {
  ArangoHostConfig, DataBaseUser, GetSysDb,
  CanConnectToDbServer, CanNotConnectToDbServer,
  DbIsConnected, DbIsNotConnected,
  CreateDb, DropDb, DropAllDatabases,
  DbExists, DbDoesNotExist, NonSystemDbsExists,
  CreateCollectionOpts, CreateCollection, CreateDocumentCollection,
  CollectionExists, CollectionDoesNotExist,
  CollectionDocCount,
  CreateEdgeCollection
} from './ArangoUtilsTypes'

//*****************************************************************************
// General Utils
//*****************************************************************************

export const canConnectToDbServer : CanConnectToDbServer = async (hostConfig: ArangoHostConfig) => {
  const sysDb = await getSysDb(hostConfig)
  return dbIsConnected(sysDb)
}
export const canNotConnectToDbServer: CanNotConnectToDbServer =
  asyncComplement(canConnectToDbServer)

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
  dbUsers: DataBaseUser[],
  ifDbExists: IfDbExists = IfDbExists.ThrowError
) => {
  const sysDb = await getDbFromVarious(sysDbOrArangoHostConfig)
  if (isNotSysDb(sysDb))
    throw new Error('createArangoDb(): non system DB provided: ' + sysDb.name)

  let requestedDbExists = await dbExists(sysDb, dbName)

  if (requestedDbExists && ifDbExists === IfDbExists.ThrowError)
    throw new Error(`Attempting to create arango database '${dbName}', but it already exists`)

  if (requestedDbExists && ifDbExists === IfDbExists.Overwrite) {
    await sysDb.dropDatabase(dbName)
    requestedDbExists = false
  }

  if (!requestedDbExists)
    await sysDb.createDatabase(dbName, { users: dbUsers })

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
    ifExists = IfCollectionExists.ThrowError,
    type = CollectionType.EDGE_COLLECTION
  } = opts || {}

  const collection = db.collection(collectionName)
  let collectionExists = await collection.exists()

  if (collectionExists && ifExists === IfCollectionExists.ThrowError)
    throw new Error(`DB ${db.name}: Attempting to create collection '${collectionName}', but it already exists`)

  if (collectionExists && ifExists === IfCollectionExists.Overwrite) {
    await collection.drop()
    collectionExists = false
  }

  if (!collectionExists) await collection.create({ type })
  return collection
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
  ifExists: IfCollectionExists = IfCollectionExists.ThrowError
) => {
  const opts = { ifExists, type: CollectionType.DOCUMENT_COLLECTION }
  return createCollection(db, collectionName, opts) as Promise<DocumentCollection>
}

export const createEdgeCollection: CreateEdgeCollection = async (
  db: Database,
  collectionName: string,
  ifExists: IfCollectionExists = IfCollectionExists.ThrowError
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
