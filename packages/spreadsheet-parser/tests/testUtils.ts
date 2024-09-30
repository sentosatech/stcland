import { assert } from 'vitest'

import { equals } from 'ramda'
import { isNotDate, isNotString, isUndefined, isNotUndefined } from 'ramda-adjunct'
import { validate as isValidUuid4 } from 'uuid'

import { getBaseDataType, passwordHash } from '../src/spreadsheetParseUtils'
import { passthrough, toJson } from '@stcland/utils'
import { DataType } from '../src/SpreadsheetParserTypes'

export type ValidateFn = (expected: any, parsed: any) => boolean

export interface ValidateOpts {
  expectAllUndefined: boolean | undefined,
  expectAllErrors: boolean | undefined
}
export const dateEquals: ValidateFn = (
  execptedDataStr: string,
  date: Date
) => {
  if (isNotDate(date)) return false
  return date.getTime() === new Date(execptedDataStr).getTime()
}

export const passwordToHashEquals: ValidateFn = (
  expectedPassword: any,
  parsedPasswordHash: any,
) => {
  const expectedPasswordHash = passwordHash(expectedPassword)
  return parsedPasswordHash === expectedPasswordHash
}

export const uuidEquals : ValidateFn = (
  expectedModifiers: [string, string],
  parsedUuid: string,
) => {

  if (isNotString(parsedUuid)) return false

  const [pre, post] = expectedModifiers
  if (pre && !parsedUuid.startsWith(pre)) return false
  if (post && !parsedUuid.endsWith(post)) return false

  const preSlice = pre ? pre.length : 0
  const postSlice = post ? -post.length : undefined
  const uuid = parsedUuid.slice(preSlice, postSlice)
  return isValidUuid4(uuid)
}

export const expectedPasswordHashStr = (pw: string) =>
  `${pw} => ${passwordHash(pw)}`

export const expectedUuidString = (modifiers: [string, string]) => {
  const [pre, post] = modifiers
  return `${pre || ''}[vaiid-uuid]${post || ''}`
}

export const dataTypeToTestFns = (
  dataType: DataType,
  validateOpts?: ValidateOpts
) => {

  const { expectAllUndefined = false, expectAllErrors = false } = validateOpts || {}

  // defaults
  let validateFn: ValidateFn = equals
  let expectedValForLoggingFn = passthrough
  let parsedValForLoggingFn = passthrough

  // For special test casee defaults are correct
  if ( expectAllUndefined || expectAllErrors)
    return { validateFn, expectedValForLoggingFn, parsedValForLoggingFn }

  const baseDataType = getBaseDataType(dataType)

  switch (baseDataType) {

  case 'date':
    validateFn = dateEquals
    parsedValForLoggingFn = (d: Date) => d.toISOString()
    break
  case 'password':
    validateFn = passwordToHashEquals
    expectedValForLoggingFn = expectedPasswordHashStr
    break
  case 'json':
    parsedValForLoggingFn = toJson
    expectedValForLoggingFn = toJson
    break
  case 'uuid':
    validateFn = uuidEquals
    expectedValForLoggingFn = expectedUuidString
    break
  }

  return { validateFn, expectedValForLoggingFn, parsedValForLoggingFn }
}

export const assertConsistentDefinedState = (
  worksheetName: string,
  first: any | undefined,
  second: any | undefined,
  errMessages : {
    firstDefinedButNotSecondMsg: string,
    secondDefinedButNotFirstMsg: string
  }
) => {
  if (isNotUndefined(first) && isNotUndefined(second)) return
  if (isUndefined(first) && isUndefined(second)) return

  const { firstDefinedButNotSecondMsg, secondDefinedButNotFirstMsg } = errMessages
  if (isNotUndefined(first))
    assert(false, firstDefinedButNotSecondMsg)

  if (isNotUndefined(second))
    assert(false, `WS:${worksheetName}: \n` + secondDefinedButNotFirstMsg)
}










