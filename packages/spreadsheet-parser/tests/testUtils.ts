import { validate as isValidUuid4 } from 'uuid'
import { passwordHash } from '../src/spreadSheetParseUtils'
import { isNotDate, isNotString } from 'ramda-adjunct'

export type ValidateFn = (expected: any, parsed: any) => boolean

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
