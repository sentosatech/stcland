
import { any, complement, isNil, not, all } from 'ramda'
import {
  isNumber, isString, isObject, isBoolean, isArray, isFunction,
  isUndefined, isNotUndefined,
} from 'ramda-adjunct'

type TypeCheckPred = (toCheck: unknown) => boolean;

export const isStringOrNumber: TypeCheckPred = toCheck =>
  isString(toCheck) || isNumber(toCheck)

export const isNotStringOrNumber = complement(isStringOrNumber)

export const isStringOrNumberOrBool: TypeCheckPred = toCheck =>
  isString(toCheck) || isNumber(toCheck) || isBoolean(toCheck)

export const isNotStringOrNumberOrBool: TypeCheckPred = complement(isStringOrNumberOrBool)

export const isNilOrObject: TypeCheckPred = toCheck => isNil(toCheck) || isObject(toCheck)
export const isNotNilOrObject = complement(isNilOrObject)

export const isNilOrArray: TypeCheckPred = toCheck => isNil(toCheck) || isArray(toCheck)
export const isNotNilOrArray = complement(isNilOrArray)

export const isStringOrArrayOrFunction: TypeCheckPred = toCheck =>
  isString(toCheck) || isArray(toCheck) || isFunction(toCheck)

export const isNotStringOrArrayOrFunction = complement(
  isStringOrArrayOrFunction
)

export const isStringOrFunction: TypeCheckPred = toCheck =>
  isString(toCheck) || isFunction(toCheck)

export const isNotStringOrFunction = complement(isStringOrFunction)

export const isNilOrStringOrObject: TypeCheckPred = toCheck =>
  isNil(toCheck) || isString(toCheck) || isObject(toCheck)

export const isNotNilOrStringOrObject = complement(isNilOrStringOrObject)

export const isArrayType = (
  typeCheckPred: TypeCheckPred,
  arrayToCheck: unknown[]
) => isArray(arrayToCheck) && not(any(complement(typeCheckPred),arrayToCheck))

export const isStringArray = (array: unknown[]) => isArrayType(isString, array)
export const isNotStringArray = complement(isStringArray)
export const isObjArray = (array: unknown[]) => isArrayType(isObject, array)
export const isNotObjArray = complement(isObjArray)


export const allUndefined = (...args: unknown[]) => all(isUndefined, args)
export const allNotUndefined = complement(allUndefined)

export const allDefined = (...args: unknown[]) => all(isNotUndefined, args)
export const allNotDefined = complement(allDefined)

export const allDefinedOrAllUndefined = (...args: unknown[]) => {
  if (allDefined(...args)) return true
  if (allUndefined(...args)) return true
  return false
}

