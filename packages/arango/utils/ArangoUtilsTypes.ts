
import type { Database } from 'arangojs'
import type { CreateDatabaseOptions } from 'arangojs/databases'
import type { CreateDatabaseUserOptions } from 'arangojs/users'


import  { CollectionType } from 'arangojs/collections'
import type {
  DocumentCollection,
  EdgeCollection
} from 'arangojs/collections'

import {
  Graph, EdgeDefinitionOptions,
  CreateGraphOptions as ArangoCreateGraphOptions
} from 'arangojs/graphs'

// re-export arango types so clients can use directly
export { Graph, Database, CollectionType }
export type { DocumentCollection, EdgeCollection, CreateDatabaseUserOptions }


// --- General utils ----------------------------------------------------------

export interface ArangoHostConfig {
  url: string
  username?: string
  password?: string
}

// Fetch the arango system database, throws error if connection fails
export type GetSysDb = (
  hostConfig: ArangoHostConfig,
  getSysDbOpts?: { checkConnection: boolean }
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

export type IfDbDoesNotExistOnGet = 'ThrowError' | 'Create'

export type GetDbOptions =
  CreateDatabaseOptions & {
    // Note: CreateDatabaseOptions props only needed if
    // IfDbDoesNotExistOnGet is Create and the target db does not exist
  ifDbDoesNotExist?: IfDbDoesNotExistOnGet, // default is Create
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

export type IfCollectionExistsOnCreate = 'ThrowError' | 'Overwrite' | 'ReturnExisting'

export interface CreateCollectionOpts {
  type?: CollectionType // defaults to EDGE_COLLECTION
  ifExists?: IfCollectionExistsOnCreate // defaults to ThrowError
}

export type CreateCollection = (
  db: Database,
  collectionName: string,
  createCollectionOpts: CreateCollectionOpts
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

export type IfCollectionDoesNotExistOnGet = 'ThrowError' | 'Create'

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
  ) => Promise<EdgeCollection>;

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


// --- Graph Utils -------------------------------------------------------

export type GraphExists =  (db: Database, graphName: string) => Promise<boolean>;
export type GraphDoesNotExist = GraphExists

export type IfGraphExistsOnCreate = 'ThrowError' | 'Overwrite' | 'ReturnExisting'

export type CreateGraphOptions = ArangoCreateGraphOptions & {
  ifExists?: IfGraphExistsOnCreate // defaults to ThrowError
}

export type CreateGraph = (
  db: Database,
  graphName: string,
  edgeDefinitions: EdgeDefinitionOptions[],
  createGraphOpts?: CreateGraphOptions
) => Promise<Graph>;

export type CreateEmptyGraph = (
  db: Database,
  graphName: string,
  createGraphOpts?: CreateGraphOptions
) => Promise<Graph>;

// The edge definition has been added to the graph

// export type IfGraphDoesNotExistOnGet = 'ThrowError' | 'Create'

// export type GetGraphOptions = {
//   ifGraphDoesNotExist?: IfGraphDoesNotExistOnGet // default is ThrowError
// }
