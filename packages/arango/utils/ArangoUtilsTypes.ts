import type { Database } from 'arangojs'
import { CreateDatabaseUser } from 'arangojs/database'

export interface ArangoHostConfig {
  url: string
  username?: string
  password?: string
}

export type CanConnectToDbServer = ( hostConfig: ArangoHostConfig ) => Promise<boolean>
export type CanNotConnectToDbServer = ( hostConfig: ArangoHostConfig ) => Promise<boolean>

export type DbIsConnected = ( db: Database ) => Promise<boolean>
export type DbIsNotConnected = ( db: Database ) => Promise<boolean>

export interface ArangoHostConfig {
  url: string
  username?: string
  password?: string
}

export type DbExists = {
  (hostConfig: ArangoHostConfig, dbName: string): Promise<boolean>;
  (sysDb: Database, dbName: string): Promise<boolean>;
  }

export type DbDoesNotExist = {
  (hostConfig: ArangoHostConfig, dbName: string): Promise<boolean>;
  (sysDb: Database, dbName: string): Promise<boolean>;
}

// Fetch the arango system database, throws error if connection fails
export type GetArangoSysDb = (
  hostConfig: ArangoHostConfig,
  opts?: { checkConnection: boolean }
) => Promise<Database>

export enum IfDbExists {
  ThrowError = 'throw-error',
  Overwrite = 'overwrite',
  ReturnExisting = 'return-existing',
}

export type DataBaseUser = CreateDatabaseUser

// Create a new arango database, throws connection to db server fails
export type CreateArangoDb = {
  ( hostConfig: ArangoHostConfig,
    dbName: string,
    dbUsers: CreateDatabaseUser[],
    ifDbExists: IfDbExists): Promise<Database>;
  ( sysDb: Database,
    dbName: string,
    dbUsers: CreateDatabaseUser[],
    ifDbExists: IfDbExists): Promise<Database>;
}
