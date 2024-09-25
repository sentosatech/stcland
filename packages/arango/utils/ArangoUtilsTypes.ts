// TODO:
// * convert enum options to string unions?
// * rename any raw 'opts' to be more descriptive of thier purspose, for example 'createDbOpts'

import type { Database } from 'arangojs'
import type { CreateDatabaseUser, CreateDatabaseOptions } from 'arangojs/database'

import  { CollectionType } from 'arangojs/collection'
import type {
  DocumentCollection,
  EdgeCollection
} from 'arangojs/collection'

// re-export arango types so clients can use directly
export { Database, CollectionType }
export type { DocumentCollection, EdgeCollection, CreateDatabaseUser }

// --- General utils ----------------------------------------------------------

export interface ArangoHostConfig {
  url: string
  username?: string
  password?: string
}

// Fetch the arango system database, throws error if connection fails
export type GetSysDb = (
  hostConfig: ArangoHostConfig,
  opts?: { checkConnection: boolean }
) => Promise<Database>

export type CanConnectToServer = ( hostConfig: ArangoHostConfig ) => Promise<boolean>
export type CanNotConnectToServer = ( hostConfig: ArangoHostConfig ) => Promise<boolean>

// --- DB utils ----------------------------------------------------------------

export type DbIsConnected = ( db: Database ) => Promise<boolean>
export type DbIsNotConnected = ( db: Database ) => Promise<boolean>

export type DbExists = {
  (hostConfig: ArangoHostConfig, dbName: string): Promise<boolean>;
  (sysDb: Database, dbName: string): Promise<boolean>;
  }

export type DbDoesNotExist = DbExists

export type IfDbExistsOnCreate = 'ThrowError' | 'Overwrite' | 'ReturnExisting'

export type CreateDbOptions = CreateDatabaseOptions & {
  ifDbExists?: IfDbExistsOnCreate // defaults to ThrowError
}

export type CreateDb = {
  ( hostConfig: ArangoHostConfig,
    dbName: string,
    createDbOpts?: CreateDbOptions
  ): Promise<Database>;
  ( sysDb: Database,
    dbName: string,
    createDbOpts?: CreateDbOptions
  ): Promise<Database>;
}


export const enum IfDbDoesNotExistOnGetOld {
  ThrowError = 'throw-error',
  Create = 'create',
}
export type IfDbDoesNotExistOnGet = 'ThrowError' | 'Create'


export type GetDbOptionsOld = CreateDatabaseOptions & {
  // note CreateDatabaseOptions props only needed if IfDbDoesNotExistOnGet is Create
  ifDbDoesNotExist?: IfDbDoesNotExistOnGetOld, // default is ThrowError
}

export type GetDbOptions = CreateDatabaseOptions & {
  // note CreateDatabaseOptions props only needed if IfDbDoesNotExistOnGet is Create
  ifDbDoesNotExist?: IfDbDoesNotExistOnGet, // default is ThrowError
}

export type GetDbOld = {
  ( hostConfig: ArangoHostConfig,
    dbName: string,
    getDbOpts?: GetDbOptionsOld, // only needed if IfDbDoesNotExistOnGet is Create
  ) : Promise<Database>;
  ( sysDb: Database,
    dbName: string,
    getDbOpts?: GetDbOptionsOld, // only needed if IfDbDoesNotExistOnGet is Create
  ) : Promise<Database>;
}

export type GetDb = {
  ( hostConfig: ArangoHostConfig,
    dbName: string,
    getDbOpts?: GetDbOptions, // only needed if IfDbDoesNotExistOnGet is Create
  ) : Promise<Database>;
  ( sysDb: Database,
    dbName: string,
    getDbOpts?: GetDbOptions, // only needed if IfDbDoesNotExistOnGet is Create
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

// --- Collection utils -------------------------------------------------------

export type CollectionExists =  (db: Database, collectionName: string) => Promise<boolean>;
export type CollectionDoesNotExist = CollectionExists

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

export type DocumentExists = (
  db: Database,
  collectionName: string,
  documentKey: string
) => Promise<boolean>

export type DocumentDoesNotExist = (
  db: Database,
  collectionName: string,
  documentKey: string
) => Promise<boolean>


export type DocumentExistsById = (
  db: Database,
  documentId: string
) => Promise<boolean>

export type DocumentDoesNotExistById = (
  db: Database,
  documentId: string
) => Promise<boolean>
