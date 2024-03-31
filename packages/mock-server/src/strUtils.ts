import stringify from 'json-stringify-safe'
import { isNotNaN, isString } from 'ramda-adjunct'
import { toLower } from 'ramda'

export const json  = (v: unknown) => stringify(v, null, 2)
export const str = (v: unknown) => stringify(v)

export const boolStrToBool = (boolStr: string | undefined) =>
  boolStr ? toLower(boolStr) === 'true' : false

export const isNonEmptyStr = (toCheck: unknown) =>
  isString(toCheck) && toCheck.length > 0

export const strCharCount = (char: string | RegExp, str: string) =>
  str.split(char).length - 1

export const numDots = (str: string) =>
  strCharCount('.', str)

export const strRepresentsFloat = (strToCheck: string) =>
  isNotNaN(Number.parseFloat(strToCheck))
