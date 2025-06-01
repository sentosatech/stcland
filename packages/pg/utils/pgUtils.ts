import postgres from 'postgres'
import { complement } from 'ramda'

import { asyncComplement } from '@stcland/utils'

import type {
  PgHostConfig, GetSysDb,
  CanConnectToServer, CanNotConnectToServer,
  DbIsConnected, DbIsNotConnected, DbExists, DbDoesNotExist,
  IsSysDb, IsNotSysDb, SqlDb
} from './PgUtilsTypes'

const SYSTEM_DATABASES = ['postgres', 'template0', 'template1']

// --- General Utils ----------------------------------------------------------

export const canConnectToServer: CanConnectToServer = async (hostConfig: PgHostConfig) => {
  let sysDb: SqlDb | undefined = undefined
  try {
    sysDb = await getSysDb(hostConfig)
    return await dbIsConnected(sysDb)
  } catch (error) {
    return false
  } finally {
    if (sysDb) await sysDb.end()
  }
}
export const canNotConnectToServer: CanNotConnectToServer =
  asyncComplement(canConnectToServer)

// throws error if connection check is requested, and it fails
export const getSysDb: GetSysDb = async (
  hostConfig, getSysDbOpts
) => {
  const { host, port, username, password, ssl, ...otherOptions } = hostConfig || {}

  // Always connect to the 'postgres' system database for admin operations
  const sysDb = postgres({
    host, port, username, password, database: 'postgres', // Force system database
    ...otherOptions
  })

  if (getSysDbOpts?.checkConnection) {
    if (await dbIsNotConnected(sysDb)) {
      await sysDb.end()
      throw new Error('Sys database connection failed')
    }
  }
  return sysDb
}

// --- Database Utils ---------------------------------------------------------

export const dbIsConnected: DbIsConnected = async (db: SqlDb) => {
  try {
    await db`SELECT 1`
    return true
  }
  catch (error) {
    return false
  }
}

export const dbIsNotConnected: DbIsNotConnected =
  asyncComplement(dbIsConnected)

export const isSysDb: IsSysDb = async (db: SqlDb) => {
  try {
    const result = await db`SELECT current_database() as dbname`
    const dbName = result[0]?.dbname
    if (!dbName || typeof dbName !== 'string') return false
    return SYSTEM_DATABASES.includes(dbName)
  } catch (error) {
    return false
  }
}

export const isNotSysDb: IsNotSysDb =  asyncComplement(isSysDb)

export const dbExists: DbExists = async (
  sqlOrHostConfig: SqlDb | PgHostConfig,
  dbName: string
): Promise<boolean> => {
  const db = await getDbFromVarious(sqlOrHostConfig)
  const shouldCloseConnection = isHostConfig(sqlOrHostConfig)

  try {
    const result = await db`
      SELECT 1 FROM pg_database WHERE datname = ${dbName}
    `
    return result.length > 0
  } catch (error) {
    return false
  } finally {
    if (shouldCloseConnection) await db.end()
  }
}

export const dbDoesNotExist: DbDoesNotExist = asyncComplement(dbExists) as DbDoesNotExist


// --- Helper functions -------------------------------------------------------

export const isDbInstance = (arg: SqlDb | PgHostConfig): arg is SqlDb =>
  arg &&
  typeof arg === 'function' &&
  typeof arg.end === 'function' &&
  'options' in arg

export const isHostConfig = (arg: SqlDb | PgHostConfig): arg is PgHostConfig => {
  return !isDbInstance(arg)
}

export const isNotDbInstance = complement(isDbInstance)

const getDbFromVarious = async (
  dbOrHostConfig: SqlDb | PgHostConfig
): Promise<SqlDb> => {
  if (isDbInstance(dbOrHostConfig)) {
    return dbOrHostConfig
  }

  if (isHostConfig(dbOrHostConfig)) {
    return getSysDb(dbOrHostConfig)
  }

  // This should never happen with proper typing, but good for safety
  throw new Error('Invalid argument type')
}
