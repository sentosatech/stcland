//--- data types --------------------------------------------------------------

export type DataTableDataType =
'string' | 'number' | 'boolean' | 'bigint' | 'date' | 'password' | 'json' | 'uuid' | 'any'

export const validDataTableDataTypes: DataTableDataType[] = [
  'string', 'number', 'boolean', 'bigint', 'date', 'password', 'json', 'uuid', 'any'
]

export type HorizontalValueListType =
  'string:list' | 'number:list' | 'boolean:list' | 'bigint:list' | 'date:list' | 'password:list' | 'json:list' | 'uuid:list'

export const validHorizontalValueListTypes: HorizontalValueListType[] = [
  'string:list', 'number:list', 'boolean:list', 'bigint:list', 'date:list', 'password:list', 'json:list', 'uuid:list'
]

export type DataListDataType =  HorizontalValueListType | DataTableDataType

export const validDataListDataTypes: DataListDataType[] = [
  ...validHorizontalValueListTypes, ...validDataTableDataTypes
]

export type DataType = DataTableDataType | DataListDataType

// using a set to remove duplicates
export const validDataTypes: DataType[] = Array.from(new Set([
  ...validDataTableDataTypes,
  ...validDataListDataTypes
]))

export type DataTypes = Record<string, DataType>
export type Meta = Record<string, any>
export type MetaTypes = Record<string, DataType>
