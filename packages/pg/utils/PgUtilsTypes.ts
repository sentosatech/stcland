import type { Sql as SqlDb } from 'postgres'

// re-export postgres types so clients can use directly
export type { SqlDb }


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
) => Promise<SqlDb>

export type CanConnectToServer = (hostConfig: PgHostConfig) => Promise<boolean>
export type CanNotConnectToServer = (hostConfig: PgHostConfig) => Promise<boolean>

// --- DB utils ----------------------------------------------------------------

export type DbIsConnected = (db: SqlDb) => Promise<boolean>
export type DbIsNotConnected = (db: SqlDb) => Promise<boolean>

export type IsSysDb = (db: SqlDb) => Promise<boolean>
export type IsNotSysDb = (db: SqlDb) => Promise<boolean>

export type DbExists = {
  (hostConfig: PgHostConfig, dbName: string): Promise<boolean>;
  (sysDb: SqlDb, dbName: string): Promise<boolean>;
}

export type DbDoesNotExist = DbExists

export type DropDb = {
  (hostConfig: PgHostConfig, dbName: string): Promise<boolean>;
  (sysDb: SqlDb, dbName: string): Promise<boolean>;
}

export type GetDbName = (db: SqlDb) => Promise<string>

export type GetDbList = {
  (hostConfig: PgHostConfig): Promise<string[]>;
  (sysDb: SqlDb): Promise<string[]>;
}

// --- Table utils ----------------------------------------------------------------

export type TableExists = {
  (db: SqlDb, tableName: string, schema?: string): Promise<boolean>;
}

export type TableDoesNotExist = TableExists

export type OnNonExistentTable = 'ThrowError' | 'Silent' | 'Warning'

export type DropTableOptions = {
  onNonExistentTable ?: OnNonExistentTable // defaults to false
  schema?: string // defaults to 'public'
}

export type DropTable = (
  db: SqlDb,
  tableName: string,
  options?: DropTableOptions
) => Promise<boolean>

export type GetTableList = (
  db: SqlDb,
  schema?: string
) => Promise<string[]>

// --- DB creation ------------------------------------------------------------

export type IfDbExistsOnCreate = 'ThrowError' | 'Overwrite' | 'ReturnExisting'


export interface CreateDbOptions {
  ifDbExists?: IfDbExistsOnCreate
}

export type CreateDb = {
  (hostConfig: PgHostConfig, dbName: string, options?: CreateDbOptions): Promise<boolean>;
  (sysDb: SqlDb, dbName: string, options?: CreateDbOptions): Promise<boolean>;
}

export type ScriptScource = 'filePath' | 'string'

export interface CreateDbFromSqlScriptOptions extends CreateDbOptions{
  scriptSource: ScriptScource
}

export type CreateDbFromSqlScript = (
  hostConfig: PgHostConfig,
  dbName: string,
  sqlScript: string,
  options?: CreateDbFromSqlScriptOptions
) => Promise<SqlDb>
