import {
  describe, test, beforeAll, afterAll, expect
} from 'vitest'

import path from 'path'
import { fileURLToPath } from 'url'
import { pathExists } from 'path-exists'

import type {
  SqlDb, PgHostConfig,
} from '../utils'

import {
  type CreateDbFromSqlScriptOptions,
  getSysDb, isDbInstance, isHostConfig,
  canConnectToServer, canNotConnectToServer,
  dbIsConnected, dbIsNotConnected, isSysDb, isNotSysDb, getDbList,
  dbExists, dbDoesNotExist, createDb, dropDb, createDbFromSqlScript,
  tableExists, tableDoesNotExist, dropTable, getTableList,
} from '../utils'

const hostConfig: PgHostConfig = {
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'pw',
}

// Add invalid config for negative testing
const invalidHostConfig: PgHostConfig = {
  host: 'invalid-host-12345',
  port: 9999,
  username: 'postgres',
  password: 'pw',
}

const cwd = path.dirname(fileURLToPath(import.meta.url))
const sqlScriptPath = path.join(cwd, 'test-pg-data.sql')

let sysDb: SqlDb

beforeAll(async () => {
  expect(await canConnectToServer(hostConfig)).toBe(true)
  expect(await canNotConnectToServer(hostConfig)).toBe(false)
  sysDb = await getSysDb(hostConfig, { checkConnection: true })
})

afterAll(async () => {
  await sysDb.end() // Clean up system database connection
})

describe('Test @stcland/postgres/utils', async () => {

  test('Connection tests', async () => {
    // Valid connection
    expect(await canConnectToServer(hostConfig)).toBe(true)
    expect(await canNotConnectToServer(hostConfig)).toBe(false)

    // Invalid connection
    expect(await canConnectToServer(invalidHostConfig)).toBe(false)
    expect(await canNotConnectToServer(invalidHostConfig)).toBe(true)
  })

  test('Basic database tests', async () => {
    expect(await dbIsConnected(sysDb)).toBe(true)
    expect(await dbIsNotConnected(sysDb)).toBe(false)
    expect(await isSysDb(sysDb)).toBe(true)
    expect(await isNotSysDb(sysDb)).toBe(false)
  })

  test('Type guard tests', async () => {
    // Test isDbInstance
    expect(isDbInstance(sysDb)).toBe(true)
    expect(isDbInstance(hostConfig)).toBe(false)

    // Test isHostConfig
    expect(isHostConfig(hostConfig)).toBe(true)
    expect(isHostConfig(sysDb)).toBe(false)
  })

  test('Database existence tests', async () => {
    // Test with host config
    expect(await dbExists(hostConfig, 'postgres')).toBe(true)
    expect(await dbDoesNotExist(hostConfig, 'postgres')).toBe(false)
    expect(await dbExists(hostConfig, 'nonexistent_db_12345')).toBe(false)
    expect(await dbDoesNotExist(hostConfig, 'nonexistent_db_12345')).toBe(true)

    // Test with sysDb instance
    expect(await dbExists(sysDb, 'postgres')).toBe(true)
    expect(await dbDoesNotExist(sysDb, 'postgres')).toBe(false)
    expect(await dbExists(sysDb, 'nonexistent_db_12345')).toBe(false)
    expect(await dbDoesNotExist(sysDb, 'nonexistent_db_12345')).toBe(true)
  })

  test('getSysDb error handling', async () => {
    // Should throw on invalid connection with checkConnection: true
    await expect(
      getSysDb(invalidHostConfig, { checkConnection: true })
    ).rejects.toThrow('Sys database connection failed')
  })

  test('createDb - First creation', async () => {
    const dbName = 'test_create_db_first'

    // Clean up if exists
    if (await dbExists(sysDb, dbName)) {
      console.warn(`WARNING: createDb / initital, ${dbName} exists, dropping it`)
      await dropDb(sysDb, dbName)
    }

    const ifDbExists = 'ThrowError'

    // Test with hostConfig
    const created1 = await createDb(hostConfig, dbName, { ifDbExists })
    expect(created1.dbAlreadyExisted).toBe(false)
    expect(await dbExists(hostConfig, dbName)).toBe(true)
    expect(await dbDoesNotExist(hostConfig, dbName)).toBe(false)

    // Clean up
    await dropDb(sysDb, dbName)

  })

  test('createDb - Second creation should throw error', async () => {
    const dbName = 'test_create_db_throw'
    const ifDbExists = 'ThrowError'

    // Clean up if exists
    if (await dbExists(sysDb, dbName)) {
      console.warn(`WARNING: createDb / error on existing, ${dbName} exists, dropping it`)
      await dropDb(sysDb, dbName)
    }

    // Ensure database exists first
    await createDb(hostConfig, dbName, { ifDbExists })
    expect(await dbExists(sysDb, dbName)).toBe(true)

    await expect(
      createDb(hostConfig, dbName, { ifDbExists })
    ).rejects.toThrow(`Database '${dbName}' already exists`)

    // // Clean up
    await dropDb(sysDb, dbName)
  })

  test('createDb - Return existing database', async () => {
    const dbName = 'test_create_db_skip'

    // Clean up if exists
    if (await dbExists(sysDb, dbName)) {
      console.warn(`WARNING: createDb / return existing, ${dbName} exists, dropping it`)
      await dropDb(sysDb, dbName)
    }

    // Create database first
    const created1 = await createDb(hostConfig, dbName, { ifDbExists: 'ThrowError' })
    expect(created1.dbAlreadyExisted).toBe(false)
    expect(await dbExists(sysDb, dbName)).toBe(true)

    const ifDbExists = 'ReturnExisting'

    const skipped1 = await createDb(hostConfig, dbName, { ifDbExists })
    expect(skipped1.dbAlreadyExisted).toBe(true) // Didn't create, already existed
    expect(await dbExists(hostConfig, dbName)).toBe(true) // Still exists
    expect(await dbDoesNotExist(hostConfig, dbName)).toBe(false)

    // Clean up
    await dropDb(sysDb, dbName)
  })

  test('createDb - Overwrite existing database', async () => {
    const dbName = 'test_create_db_overwrite'

    // Clean up if exists
    if (await dbExists(sysDb, dbName)) {
      console.warn(`WARNING: createDb / overwrite existing, ${dbName} exists, dropping it`)
      await dropDb(sysDb, dbName)
    }

    // Create database first
    const created1 = await createDb(hostConfig, dbName, { ifDbExists: 'ThrowError' })
    expect(created1.dbAlreadyExisted).toBe(false)
    expect(await dbExists(sysDb, dbName)).toBe(true)

    const ifDbExists = 'Overwrite'

    const overwritten1 = await createDb(hostConfig, dbName, { ifDbExists })
    expect(overwritten1.dbAlreadyExisted).toBe(true)
    expect(await dbExists(hostConfig, dbName)).toBe(true)
    expect(await dbDoesNotExist(hostConfig, dbName)).toBe(false)

  // Clean up
    await dropDb(sysDb, dbName)
  })

  test.skip('createDbFromSqlScript - sql string', async () => {
    const dbName = 'test_create_db_from_sql_script_simple'

    // Clean up if exists
    if (await dbExists(sysDb, dbName)) {
      console.warn(`WARNING: createDbFromSqlScript simple: ${dbName} exists, dropping it`)
      await dropDb(sysDb, dbName)
    }

    const sql = `
    CREATE TABLE test_table (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL
    );
  `

    const options: CreateDbFromSqlScriptOptions = {
      ifDbExists: 'ThrowError',
      scriptSource: 'string',
    }
    const { sqlDb } = await createDbFromSqlScript(
      hostConfig, dbName, sql, options
    )

    try {
      expect(await dbExists(hostConfig, dbName)).toBe(true)
      expect(await dbIsConnected(sqlDb)).toBe(true)

      // Verify table was created
      expect(await tableExists(sqlDb, 'nonexistent_table')).toBe(false)
      expect(await tableDoesNotExist(sqlDb, 'nonexistent_table')).toBe(true)

    } finally {
      await sqlDb.end()
      await dropDb(hostConfig, dbName)
    }
  })

  test.skip('createDbFromSqlScript - sql file', async () => {
    const dbName = 'test_create_db_from_sql_file'

    // Clean up if exists
    if (await dbExists(sysDb, dbName)) {
      console.warn(`WARNING: createDbFromSqlScript sql file: ${dbName} exists, dropping it`)
      await dropDb(sysDb, dbName)
    }

    const sqlFileExists = await pathExists(sqlScriptPath) // Fixed function name
    if (!sqlFileExists) {
      throw new Error(`SQL file not found: ${sqlScriptPath}`)
    }

    const options: CreateDbFromSqlScriptOptions = {
      ifDbExists: 'ThrowError',
      scriptSource: 'filePath',
    }

    let dbToClose: SqlDb | undefined

    try {
      const { sqlDb } = await createDbFromSqlScript(
        hostConfig, dbName, sqlScriptPath, options
      )
      dbToClose = sqlDb // Save for cleanup

      // Verify database was created
      expect(await dbExists(hostConfig, dbName)).toBe(true)
      expect(await dbIsConnected(sqlDb)).toBe(true)

      // Verify all expected tables exist in core schema
      expect(await tableExists(sqlDb, 'organizations', 'core')).toBe(true)
      expect(await tableExists(sqlDb, 'users', 'core')).toBe(true)
      expect(await tableExists(sqlDb, 'users_organizations', 'core')).toBe(true)
      expect(await tableExists(sqlDb, 'players', 'core')).toBe(true)
      expect(await tableExists(sqlDb, 'hand_groups', 'core')).toBe(true)
      expect(await tableExists(sqlDb, 'hands', 'core')).toBe(true)
      expect(await tableExists(sqlDb, 'hands_players', 'core')).toBe(true)
      expect(await tableExists(sqlDb, 'hand_actions', 'core')).toBe(true)

      // Verify that public is clean
      expect(await tableExists(sqlDb, 'organizations', 'public')).toBe(false)
      expect(await tableExists(sqlDb, 'users', 'public')).toBe(false)
      expect(await tableExists(sqlDb, 'users_organizations', 'public')).toBe(false)
      expect(await tableExists(sqlDb, 'players', 'public')).toBe(false)
      expect(await tableExists(sqlDb, 'hand_groups', 'public')).toBe(false)
      expect(await tableExists(sqlDb, 'hands', 'public')).toBe(false)
      expect(await tableExists(sqlDb, 'hands_players', 'public')).toBe(false)
      expect(await tableExists(sqlDb, 'hand_actions', 'public')).toBe(false)

    } finally {

      // Always close connection if it was created
      if (dbToClose) {
        await dbToClose.end()
      }

      // Always clean up database
      await dropDb(hostConfig, dbName)
    }
  })

  test('getDbList - lists all databases', async () => {
  // Test with sysDb instance
    const databasesFromSysDb = await getDbList(sysDb)
    expect(Array.isArray(databasesFromSysDb)).toBe(true)
    expect(databasesFromSysDb.length).toBeGreaterThan(0)

  // Should include system databases
    expect(databasesFromSysDb).toContain('postgres')

  // Test with host config
    const databasesFromHostConfig = await getDbList(hostConfig)
    expect(Array.isArray(databasesFromHostConfig)).toBe(true)

    // Both methods should return the same results
    expect(databasesFromSysDb.sort()).toEqual(databasesFromHostConfig.sort())

    // Create a test database and verify it appears in the list
    const testDbName = 'test_list_databases'
    if (await dbExists(sysDb, testDbName)) {
      await dropDb(sysDb, testDbName)
    }

    await createDb(hostConfig, testDbName)

    try {
      const updatedList = await getDbList(sysDb)
      expect(updatedList).toContain(testDbName)
      expect(updatedList.length).toBe(databasesFromSysDb.length + 1)

    } finally {
      await dropDb(sysDb, testDbName)
    }
  })

  test('tableExists - verifies table existence with schema support', async () => {
    const dbName = 'test_table_exists'

    // Clean up if exists
    if (await dbExists(sysDb, dbName)) {
      await dropDb(sysDb, dbName)
    }

    const testSql = `
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100)
    );

    CREATE SCHEMA test_schema;

    CREATE TABLE test_schema.products (
      id SERIAL PRIMARY KEY,
      title VARCHAR(100)
    );

    CREATE TABLE test_schema.users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(100)
    );
  `

    const { sqlDb } = await createDbFromSqlScript(hostConfig, dbName, testSql)

    try {
      // Test table in public schema (no schema specified)
      expect(await tableExists(sqlDb, 'users')).toBe(true) // Finds any schema
      expect(await tableDoesNotExist(sqlDb, 'users')).toBe(false)

      // Test table in public schema (schema specified)
      expect(await tableExists(sqlDb, 'users', 'public')).toBe(true)
      expect(await tableDoesNotExist(sqlDb, 'users', 'public')).toBe(false)

      // Test table in test_schema (no schema specified)
      expect(await tableExists(sqlDb, 'products')).toBe(true) // Should find it regardless of schema
      expect(await tableDoesNotExist(sqlDb, 'products')).toBe(false)

      // Test table in test_schema (schema specified)
      expect(await tableExists(sqlDb, 'products', 'test_schema')).toBe(true)
      expect(await tableDoesNotExist(sqlDb, 'products', 'test_schema')).toBe(false)

      // Test same table name in different schemas
      expect(await tableExists(sqlDb, 'users', 'public')).toBe(true)
      expect(await tableExists(sqlDb, 'users', 'test_schema')).toBe(true)
      expect(await tableExists(sqlDb, 'users')).toBe(true) // Finds either one

      // Test table that doesn't exist anywhere
      expect(await tableExists(sqlDb, 'nonexistent_table')).toBe(false)
      expect(await tableDoesNotExist(sqlDb, 'nonexistent_table')).toBe(true)

      // Test table that doesn't exist in specific schema
      expect(await tableExists(sqlDb, 'products', 'public')).toBe(false) // products is only in test_schema
      expect(await tableDoesNotExist(sqlDb, 'products', 'public')).toBe(true)

      expect(await tableExists(sqlDb, 'users', 'nonexistent_schema')).toBe(false)
      expect(await tableDoesNotExist(sqlDb, 'users', 'nonexistent_schema')).toBe(true)

    } finally {
      await sqlDb.end()
      await dropDb(hostConfig, dbName)
    }
  })

  test('dropTable - handles different onNonExistentTable options with schema support', async () => {
    const dbName = 'test_drop_table_options'

  // Clean up if exists
    if (await dbExists(sysDb, dbName)) {
      await dropDb(sysDb, dbName)
    }

    const testSql = `
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100)
    );

    CREATE SCHEMA test_schema;

    CREATE TABLE test_schema.products (
      id SERIAL PRIMARY KEY,
      title VARCHAR(100)
    );

    CREATE TABLE test_schema.users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(100)
    );
  `

    const onNonExistentTable = 'Silent'
    const { sqlDb } = await createDbFromSqlScript(hostConfig, dbName, testSql)

    try {
      // Test successful drop from public schema
      expect(await tableExists(sqlDb, 'users', 'public')).toBe(true)
      const dropped = await dropTable(sqlDb, 'users', { onNonExistentTable })
      expect(dropped).toBe(true)
      expect(await tableExists(sqlDb, 'users', 'public')).toBe(false)

      // Verify users still exists in test_schema
      expect(await tableExists(sqlDb, 'users', 'test_schema')).toBe(true)

      // Test successful drop from specific schema
      expect(await tableExists(sqlDb, 'products', 'test_schema')).toBe(true)
      const droppedFromSchema = await dropTable(sqlDb, 'products', {
        schema: 'test_schema',
        onNonExistentTable
      })
      expect(droppedFromSchema).toBe(true)
      expect(await tableExists(sqlDb, 'products', 'test_schema')).toBe(false)

      // Test non-existent table (silent behavior)
      const nonExistentResult = await dropTable(sqlDb, 'nonexistent', { onNonExistentTable })
      expect(nonExistentResult).toBe(false)

      // Test non-existent table in specific schema (silent behavior)
      const nonExistentWithSchemaResult = await dropTable(sqlDb, 'products', {
        schema: 'test_schema',
        onNonExistentTable
      })
      expect(nonExistentWithSchemaResult).toBe(false) // Already dropped above

      // Test table exists in different schema (silent behavior)
      const differentSchemaResult = await dropTable(sqlDb, 'users', {
        schema: 'public',
        onNonExistentTable
      })
      expect(differentSchemaResult).toBe(false) // Already dropped from public

      // === ThrowError Tests ===

      // Test 'ThrowError' behavior - completely non-existent table
      await expect(
        dropTable(sqlDb, 'never_existed', { onNonExistentTable: 'ThrowError' })
      ).rejects.toThrow()

      // Test 'ThrowError' behavior - table doesn't exist in specific schema
      await expect(
        dropTable(sqlDb, 'products', {
          schema: 'test_schema',
          onNonExistentTable: 'ThrowError'
        })
      ).rejects.toThrow()

    // Test 'ThrowError' behavior - table exists in different schema
      await expect(
        dropTable(sqlDb, 'users', {
          schema: 'public',
          onNonExistentTable: 'ThrowError'
        })
      ).rejects.toThrow()

    // Test 'ThrowError' behavior - non-existent schema
      await expect(
        dropTable(sqlDb, 'users', {
          schema: 'nonexistent_schema',
          onNonExistentTable: 'ThrowError'
        })
      ).rejects.toThrow()

    } finally {
      await sqlDb.end()
      await dropDb(hostConfig, dbName)
    }
  })

  test('getTableList - lists tables with and without schema', async () => {
    const dbName = 'test_get_table_list'

  // Clean up if exists
    if (await dbExists(sysDb, dbName)) {
      await dropDb(sysDb, dbName)
    }

    const testSql = `
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100)
    );

    CREATE SCHEMA test_schema;

    CREATE TABLE test_schema.products (
      id SERIAL PRIMARY KEY,
      title VARCHAR(100)
    );
  `

    const { sqlDb } = await createDbFromSqlScript(hostConfig, dbName, testSql)

    try {
      // Test getting all tables (no schema specified)
      const allTables = await getTableList(sqlDb)
      expect(allTables).toContain('users')
      expect(allTables).toContain('products')
      expect(allTables.length).toBe(2)

      // Test getting tables from specific schema
      const publicTables = await getTableList(sqlDb, 'public')
      expect(publicTables).toContain('users')
      expect(publicTables).not.toContain('products')
      expect(publicTables.length).toBe(1)


      const testSchemaTables = await getTableList(sqlDb, 'test_schema')
      expect(testSchemaTables).toContain('products')
      expect(testSchemaTables).not.toContain('users')

      // Test non-existent schema
      const nonExistentSchemaTables = await getTableList(sqlDb, 'nonexistent_schema')
      expect(nonExistentSchemaTables).toEqual([])
      expect(testSchemaTables.length).toBe(1)

    } finally {
      await sqlDb.end()
      await dropDb(hostConfig, dbName)
    }
  })
})
