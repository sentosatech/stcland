import postgres from 'postgres'
import { complement } from 'ramda'
import { isArray } from 'ramda-adjunct'

import {
  asyncComplement, readTextFile,
} from '@stcland/utils'

import type {
  PgHostConfig, GetSysDb,
  CanConnectToServer, CanNotConnectToServer,
  DbIsConnected, DbIsNotConnected, DbExists, DbDoesNotExist,
  IsSysDb, IsNotSysDb, SqlDb, DropDb, GetDbName,
  CreateDb, CreateDbOptions, GetDbList, GetTableList,
  CreateDbFromSqlScript, CreateDbFromSqlScriptOptions,
  TableExists, TableDoesNotExist, DropTable, DropTableOptions,
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

export const conditionValueForSql = (value: any) => {
  // postgres expects arrays to be formatted as PostgreSQL array literals
  // e.g. '{value1,value2,value3}'
  if (isArray(value)) {
    const formattedValues = value.map(item => {
      if (typeof item === 'object' && item !== null) {
        return JSON.stringify(item)
      } else if (typeof item === 'string') {
        // Escape quotes in strings for PostgreSQL
        return `"${item.replace(/"/g, '\\"')}"`
      }
      return item
    })
    return `{${formattedValues.join(',')}}`
  }
  return value
}

// --- Database Creation ---------------------------------------------------------

const isValidPostgresIdentifier = (name: string): boolean => {
  return /^[a-zA-Z_][a-zA-Z0-9_$]*$/.test(name) && name.length <= 63
}

const postgresIdentifierHint = (name: string): string => {
  if (!name || name.length === 0) {
    return 'name cannot be empty'
  }
  if (/^\d/.test(name)) {
    return 'names cannot start with a number'
  }
  if (!/^[a-zA-Z_]/.test(name)) {
    return 'names must start with a letter or underscore'
  }
  if (/[^a-zA-Z0-9_$]/.test(name)) {
    return 'names can only contain letters, numbers, underscores, and dollar signs'
  }
  if (name.length > 63) {
    return 'names must be 63 characters or less'
  }
  return ''
}

// Then use for both:
const isValidDbName = isValidPostgresIdentifier
const isValidTableName = isValidPostgresIdentifier
const dbNameHint = postgresIdentifierHint
const tableNameHint = postgresIdentifierHint

export const createDb : CreateDb = async (
  sysDbOrHostConfig: SqlDb | PgHostConfig,
  dbName: string,
  options?: CreateDbOptions
): Promise<boolean> => {

  if (!isValidDbName(dbName)) {
    throw new Error(`createDb(): Invalid database name: ${dbName} (${dbNameHint(dbName)})`)
  }

  const sysDb = await getSysDbFromVarious(sysDbOrHostConfig)
  const shouldCloseConnection = isHostConfig(sysDbOrHostConfig)

  const { ifDbExists = 'ThrowError' } = options || {}

  try {
    const dbAlreadyExists = await dbExists(sysDb, dbName)

    if (dbAlreadyExists && ifDbExists === 'ThrowError') {
      throw new Error(`Database '${dbName}' already exists`)
    }

    if (dbAlreadyExists && ifDbExists === 'ReturnExisting') {
      return false // didn't create, already existed
    }

    let needToCreate = !dbAlreadyExists

    if (dbAlreadyExists && ifDbExists === 'Overwrite') {
      await dropDb(sysDb, dbName)
      needToCreate = true
    }

    if (needToCreate) {
      await sysDb.unsafe(`CREATE DATABASE "${dbName}"`)
      return true // created
    }

    return false // didn't create

  } finally {
    if (shouldCloseConnection) await sysDb.end()
  }
}

export const createDbFromSqlScript : CreateDbFromSqlScript = async (
  hostConfig: PgHostConfig,
  dbName: string,
  sqlScript: string,
  options?: CreateDbFromSqlScriptOptions
): Promise<SqlDb> => {
  const { scriptSource = 'string', ...createDbOpts } = options || {}

  // Just pass through the createDb options directly
  await createDb(hostConfig, dbName, createDbOpts)

  // Handle script source
  const script = scriptSource === 'filePath'
    ? await readTextFile(sqlScript)
    : sqlScript

  const targetDb = postgres({ ...hostConfig, database: dbName })

  try {
    await targetDb.unsafe(script)
    return targetDb
  } catch (error) {
    await dropDb(hostConfig, dbName)
    throw error
  }
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
  if(isNotDbInstance(db)) return false
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
  const db = await getSysDbFromVarious(sqlOrHostConfig)
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

export const dropDb: DropDb = async (
  sysDbOrHostConfig: SqlDb | PgHostConfig,
  dbName: string
): Promise<boolean> => {

  if (!isValidDbName(dbName)) {
    const hint = dbNameHint(dbName)
    throw new Error(`dropDb(): Invalid database name: ${dbName}${hint ? ` (${hint})` : ''}`)
  }

  const sysDb = await getSysDbFromVarious(sysDbOrHostConfig)
  const shouldCloseConnection = isHostConfig(sysDbOrHostConfig)

  try {
    if (await dbDoesNotExist(sysDb, dbName)) {
      return false
    }

    // Terminate any active connections to the target database
    await sysDb.unsafe(`
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = '${dbName}' AND pid <> pg_backend_pid()
    `)

    await sysDb.unsafe(`DROP DATABASE "${dbName}"`)
    return true

  } catch (error) {
    return false
  } finally {
    if (shouldCloseConnection) await sysDb.end()
  }
}

export const getDbName : GetDbName = async (db: SqlDb): Promise<string> => {
  try {
    const result = await db`SELECT current_database() as dbname`
    return result[0]?.dbname || 'unknown'
  } catch (error) {
    return 'unknown'
  }
}

export const getDbList: GetDbList = async (
  sysDbOrHostConfig: SqlDb | PgHostConfig
): Promise<string[]> => {
  const sysDb = await getSysDbFromVarious(sysDbOrHostConfig)
  const shouldCloseConnection = isHostConfig(sysDbOrHostConfig)

  try {
    const result = await sysDb`
      SELECT datname as name
      FROM pg_database
      WHERE datallowconn = true
      ORDER BY datname
    `
    return result.map(row => row.name)

  } finally {
    if (shouldCloseConnection) await sysDb.end()
  }
}



// --- Table Utils -------------------------------------------------------------

export const tableExists: TableExists = async (
  db: SqlDb,
  tableName: string,
  schema?: string
): Promise<boolean> => {
  try {
    const schemaCondition = schema ? db`AND table_schema = ${schema}` : db``
    const result = await db`
      SELECT 1 FROM information_schema.tables
      WHERE table_name = ${tableName}
      ${schemaCondition}
    `
    return result.length > 0
  } catch (error) {
    return false
  }
}

export const tableDoesNotExist: TableDoesNotExist = asyncComplement(tableExists)


export const dropTable: DropTable = async (
  db: SqlDb,
  tableName: string,
  options?: DropTableOptions
): Promise<boolean> => {
  const { onNonExistentTable = 'Warn', schema } = options || {}

  if (!isValidTableName(tableName)) {
    throw new Error(`dropTable(): Invalid database name: ${tableName} (${tableNameHint(tableName)})`)

    throw new Error(`dropTable(): Invalid table name: ${tableName}`)
  }

  if (await tableDoesNotExist(db, tableName, schema)) {
    if (onNonExistentTable === 'ThrowError') {
      throw new Error(`dropTable(): Table '${tableName}' does not exist`)
    }

    if (onNonExistentTable === 'Warn') {
      const dbName = await getDbName(db)
      const schemaInfo = schema ? ` in schema '${schema}'` : ''
      console.warn(`dropTable(): Table '${tableName}' does not exist${schemaInfo} in database '${dbName}'`)
    }

    // For 'Silent', do nothing
    return false
  }

  try {
    const fullTableName = schema ? `"${schema}"."${tableName}"` : `"${tableName}"`
    await db.unsafe(`DROP TABLE ${fullTableName}`)
    return true
  } catch (error) {
    console.error(`dropTable(): Failed to drop table '${tableName}':`, error)
    return false
  }}

export const getTableList: GetTableList = async (
  db: SqlDb,
  schema?: string
): Promise<string[]> => {
  try {
    if (schema) {
      // Get tables from specific schema
      const result = await db`
        SELECT table_name as name
        FROM information_schema.tables
        WHERE table_schema = ${schema} AND table_type = 'BASE TABLE'
        ORDER BY table_name
      `
      return result.map(row => row.name)
    } else {
      // Get tables from user schemas only (exclude system schemas)
      const result = await db`
        SELECT table_name as name
        FROM information_schema.tables
        WHERE table_type = 'BASE TABLE'
        AND table_schema NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
        AND table_schema NOT LIKE 'pg_temp_%'
        AND table_schema NOT LIKE 'pg_toast_temp_%'
        ORDER BY table_name
      `
      return result.map(row => row.name)
    }
  } catch (error) {
    return []
  }
}

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

const getSysDbFromVarious = async (
  sysDbOrHostConfig: SqlDb | PgHostConfig
): Promise<SqlDb> => {

  if (isDbInstance(sysDbOrHostConfig)) {
    if (await isSysDb(sysDbOrHostConfig)) {
      return sysDbOrHostConfig
    } else {
      throw new Error('Non-system database provided. Database operations require connection to system database (postgres).')
    }
  }

  if (isHostConfig(sysDbOrHostConfig)) {
    return getSysDb(sysDbOrHostConfig)
  }

  throw new Error(`Invalid argument: Expected SqlDb or PgHostConfig, got ${typeof sysDbOrHostConfig}`)
}
