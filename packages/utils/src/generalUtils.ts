import { curry, equals, findIndex, keys } from 'ramda'

// if propName is on sourceObj, returns object with propName added to targetObj with value sourceObj[propName]
export const pasteProp: (
  propName: string,
  sourceObj: object,
  targetObj: object
) => object = curry((propName, sourceObj, targetObj) =>
  findIndex(v=>equals(v,propName), keys(sourceObj)) >= 0
    ? { ...targetObj, [propName]: sourceObj[propName] }
    : targetObj
)

// for all propNames in propNames, returns targetObj with propName added to targetObj with values source[propName]
export const pasteProps: (
  propNames: string[],
  sourceObj: object,
  targetObj: object
) => object = curry((propNames, sourceObj, targetObj ) =>
  propNames.reduce((acc: object, propName: string)=>pasteProp(propName,sourceObj,acc), targetObj ))

