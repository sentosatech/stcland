import type { Database } from 'arangojs'
import { CreateDatabaseUser } from 'arangojs/database'
import {
  CollectionType,
  DocumentCollection,
  EdgeCollection
} from 'arangojs/collection'

export interface ArangoHostConfig {
  url: string
  username?: string
  password?: string
}

//*****************************************************************************
// General utils
//*****************************************************************************

// Fetch the arango system database, throws error if connection fails
export type GetSysDb = (
  hostConfig: ArangoHostConfig,
  opts?: { checkConnection: boolean }
) => Promise<Database>

export type CanConnectToDbServer = ( hostConfig: ArangoHostConfig ) => Promise<boolean>
export type CanNotConnectToDbServer = ( hostConfig: ArangoHostConfig ) => Promise<boolean>

//*****************************************************************************
// DB utils
//*****************************************************************************

export type DbIsConnected = ( db: Database ) => Promise<boolean>
export type DbIsNotConnected = ( db: Database ) => Promise<boolean>

export type DbExists = {
  (hostConfig: ArangoHostConfig, dbName: string): Promise<boolean>;
  (sysDb: Database, dbName: string): Promise<boolean>;
  }

export type DbDoesNotExist = DbExists

export type DataBaseUser = CreateDatabaseUser

export const enum IfDbExistsOnCreate {
  ThrowError = 'throw-error',
  Overwrite = 'overwrite',
  ReturnExisting = 'return-existing',
}

// Create a new arango database, throws error if connection to db server fails
export type CreateDb = {
  ( hostConfig: ArangoHostConfig,
    dbName: string,
    dbUsers: DataBaseUser[],
    ifDbExists: IfDbExistsOnCreate): Promise<Database>;
  ( sysDb: Database,
    dbName: string,
    dbUsers: DataBaseUser[],
    ifDbExists: IfDbExistsOnCreate): Promise<Database>;
}

export const enum IfDbDoesNotExistOnGet {
  ThrowError = 'throw-error',
  Create = 'create',
}

export type GetDb = {
  ( hostConfig: ArangoHostConfig,
    dbName: string,
    ifDbDoesNotExist?: IfDbDoesNotExistOnGet, // default is ThrowError
    dbUsers?: DataBaseUser[], // only needed if IfDbDoesNotExistOnGet is Create
  ) : Promise<Database>;
  ( sysDb: Database,
    dbName: string,
    ifDbDoesNotExist?: IfDbDoesNotExistOnGet, // default is ThrowError
    dbUsers?: DataBaseUser[], // only needed if IfDbDoesNotExistOnGet is Create
  ) : Promise<Database>;
}

// if database does not exist, returns false
export type DropDb = {
  ( hostConfig: ArangoHostConfig, dbName: string ) : Promise<boolean>;
  ( sysDb: Database, dbName: string ) : Promise<boolean>;
}

// returns false if any errors occured during deletion
export type DropAllDatabases = {
  ( hostConfig: ArangoHostConfig) : Promise<boolean>;
  ( sysDb: Database ) : Promise<boolean>;
}

export type NonSystemDbsExists = {
  ( hostConfig: ArangoHostConfig ) : Promise<boolean>;
  ( sysDb: Database ) : Promise<boolean>;
}

//*****************************************************************************
// Collection utils
//*****************************************************************************

export type CollectionExists =  (db: Database, collectionName: string) => Promise<boolean>;
export type CollectionDoesNotExist = CollectionExists

export { CollectionType }

export const enum IfCollectionExistsOnCreate {
  ThrowError = 'throw-error',
  Overwrite = 'overwrite',
  ReturnExisting = 'return-existing',
}

export interface CreateCollectionOpts {
  type?: CollectionType // defaults to EDGE_COLLECTION
  ifExists?: IfCollectionExistsOnCreate // defaults to ThrowError
}

// Create a new arango database, throws error if connection to db server fails
export type CreateCollection = (
  db: Database,
  collectionName: string,
  opts: CreateCollectionOpts
) => Promise<DocumentCollection | EdgeCollection>;

export type CreateDocumentCollection = (
  db: Database,
  collectionName: string,
  ifExists?: IfCollectionExistsOnCreate
) => Promise<DocumentCollection>;

export type CreateEdgeCollection = (
  db: Database,
  collectionName: string,
  ifExists?: IfCollectionExistsOnCreate
) => Promise<EdgeCollection>;

export const enum IfCollectionDoesNotExistOnGet {
  ThrowError = 'throw-error',
  Create = 'create',
}

export type GetCollection = (
  db: Database,
  collectionName: string,
  ifCollectionDoesNotExist?: IfCollectionDoesNotExistOnGet, // default is ThrowError
  collectionType?: CollectionType,
    // If provided will throw error if collection exists but is not of the specified type
    // Mut be provided if collection does not exist and ifCollectionDoesNotExist is Create
    // defaults to DOCUMENT_COLLECTION
  ) => Promise<DocumentCollection | EdgeCollection>;

export type GetDocCollection = (
  db: Database,
  collectionName: string,
  ifCollectionDoesNotExist?: IfCollectionDoesNotExistOnGet, // default is ThrowError
  ) => Promise<DocumentCollection>;

export type GetEdgeCollection = (
  db: Database,
  collectionName: string,
  ifCollectionDoesNotExist?: IfCollectionDoesNotExistOnGet, // default is ThrowError
  ) => Promise<DocumentCollection>;

export type GetCollectionType = {
  (collection: DocumentCollection | EdgeCollection) : Promise<CollectionType>;
  (db: Database, collectionName: string): Promise<CollectionType>
}

// returns true if collection was dropped, false if collection does not exist
// reports warning if collection does not exist
export type DropCollection =( db: Database, collectionName: string ) => Promise<boolean>

export type CollectionDocCount = (
  collection: DocumentCollection | EdgeCollection
) => Promise<number>
