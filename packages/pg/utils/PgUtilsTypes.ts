import type { Sql } from 'postgres'

// re-export postgres types so clients can use directly
export type { Sql as SqlDb }


export const enum PostgresRolePrivilege {
  SUPERUSER = 'SUPERUSER',
  NOSUPERUSER = 'NOSUPERUSER',
  CREATEDB = 'CREATEDB',
  NOCREATEDB = 'NOCREATEDB',
  CREATEROLE = 'CREATEROLE',
  NOCREATEROLE = 'NOCREATEROLE',
  LOGIN = 'LOGIN',
  NOLOGIN = 'NOLOGIN',
  INHERIT = 'INHERIT',
  NOINHERIT = 'NOINHERIT',
  REPLICATION = 'REPLICATION',
  NOREPLICATION = 'NOREPLICATION',
  BYPASSRLS = 'BYPASSRLS',
  NOBYPASSRLS = 'NOBYPASSRLS',
}

// --- General utils ----------------------------------------------------------

export interface PgHostConfig {
  host?: string
  port?: number
  database?: string
  username?: string
  password?: string
  ssl?: boolean | object
}

// Fetch the postgres system database, throws error if connection fails
export type GetSysDb = (
  hostConfig: PgHostConfig,
  getSysDbOpts?: { checkConnection: boolean }
) => Promise<Sql>

export type CanConnectToServer = (hostConfig: PgHostConfig) => Promise<boolean>
export type CanNotConnectToServer = (hostConfig: PgHostConfig) => Promise<boolean>

// --- DB utils ----------------------------------------------------------------

export type DbIsConnected = (db: Sql) => Promise<boolean>
export type DbIsNotConnected = (db: Sql) => Promise<boolean>

export type IsSysDb = (db: Sql) => Promise<boolean>
export type IsNotSysDb = (db: Sql) => Promise<boolean>

export type DbExists = {
  (hostConfig: PgHostConfig, dbName: string): Promise<boolean>;
  (sysDb: Sql, dbName: string): Promise<boolean>;
}

export type DbDoesNotExist = DbExists
