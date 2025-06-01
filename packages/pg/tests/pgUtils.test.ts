import {
  describe, test, beforeAll, afterAll, expect
} from 'vitest'

import type {
  SqlDb,
  PgHostConfig,
} from '../utils'

import {
  getSysDb,
  canConnectToServer, canNotConnectToServer,
  dbIsConnected, dbIsNotConnected, isSysDb, isNotSysDb,
  dbExists, dbDoesNotExist,
  isDbInstance, isHostConfig  // Add these
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
})
