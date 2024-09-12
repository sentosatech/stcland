import { Database } from 'arangojs'

import { asyncComplement } from '@stcland/utils'

import { IfDbExists,  } from './ArangoUtilsTypes'

import type {
  ArangoHostConfig,
  CanConnectToDbServer, DbIsConnected, GetArangoSysDb, DbExists,
  CanNotConnectToDbServer, DbIsNotConnected,
  CreateArangoDb, DataBaseUser,
  DbDoesNotExist
} from './ArangoUtilsTypes'


export const canConnectToDbServer : CanConnectToDbServer = async (hostConfig: ArangoHostConfig) => {
  const sysDb = await getArangoSysDb(hostConfig)
  return dbIsConnected(sysDb)
}
export const canNotConnectToDbServer: CanNotConnectToDbServer = asyncComplement(canConnectToDbServer)

export const dbIsConnected: DbIsConnected = async (db: Database) => {
  try { await db.get(); return true }
  catch (error) { return false }
}
export const dbIsNotConnected: DbIsNotConnected = asyncComplement(dbIsConnected)

export const dbExists: DbExists = async (
  sysDbOrArangoHostConfig: ArangoHostConfig | Database,
  dbName: string
): Promise<boolean> => {
  const sysDb = await getSysDbFromVarious(sysDbOrArangoHostConfig)
  const existingDbs = await sysDb.listDatabases()
  return existingDbs.includes(dbName)
}

// @ts-expect-error complement does not hanlde multiple signatures
export const dbDoesNotExist: DbDoesNotExist = asyncComplement(dbExists)

// throws error if connection fails
export const getArangoSysDb: GetArangoSysDb = async (
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


export const createArangoDb: CreateArangoDb = async (
  sysDbOrArangoHostConfig: ArangoHostConfig | Database,
  dbName: string,
  dbUsers: DataBaseUser[],
  ifDbExists: IfDbExists
) => {
  const sysDb = await getSysDbFromVarious(sysDbOrArangoHostConfig)
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

//*****************************************************************************
// module only functions
//*****************************************************************************

const isHostConfig = (arg: any): boolean => {
  return arg.url && typeof arg.url === 'string'
}

const getSysDbFromVarious = async (
  sysDbOrArangoHostConfig: ArangoHostConfig | Database
): Promise<Database> =>
  isHostConfig(sysDbOrArangoHostConfig)
    ? await getArangoSysDb(sysDbOrArangoHostConfig as ArangoHostConfig)
    : sysDbOrArangoHostConfig as Database
