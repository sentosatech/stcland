import {
  curry, equals, findIndex, keys, complement
} from 'ramda'

// if propName is on sourceObj, returns object with propName added to targetObj with value sourceObj[propName]
export const copyPasteProp: (
  propName: string,
  sourceObj: object,
  targetObj: object
) => object = curry((propName, sourceObj, targetObj) =>
  findIndex(v=>equals(v,propName), keys(sourceObj)) >= 0
    ? { ...targetObj, [propName]: sourceObj[propName] }
    : targetObj
)

// for all propNames in propNames, returns targetObj with propName added to targetObj with values source[propName]
export const copyPasteProps: (
  propNames: string[],
  sourceObj: object,
  targetObj: object
) => object = curry((propNames, sourceObj, targetObj ) =>
  propNames.reduce((acc: object, propName: string)=>copyPasteProp(propName,sourceObj,acc), targetObj ))


export const setsAreEqual = <T = any >(set1: Set<T>, set2: Set<T>): boolean => {
  if (set1.size !== set2.size) return false
  return Array.from(set1).every(item => set2.has(item))
}

export const setsAreNotEqual = complement(setsAreEqual)

export const objectsHaveSameKeys = <T extends object>(obj1: T, obj2: T): boolean => {
  const keys1 = Object.keys(obj1) as Array<keyof T>
  const keys2 = Object.keys(obj2) as Array<keyof T>

  const keySet1 = new Set(keys1)
  const keySet2 = new Set(keys2)

  return setsAreEqual(keySet1, keySet2)
}

export const objectsDoNotHaveSameKeys = complement(objectsHaveSameKeys)

// add a propoerty as the first in an object
export const assocFront: Record<string, any> = curry((
  key: string,
  value: any,
  obj: Record<string, any>
) => ({ [key]: value, ...obj }))

// add a property to an object if a condition is met
// could not get @ts-expect-error to work, nor get the typing to work
// F typescript: TODO:
// export const assocIf = curry((
//   pred: boolean,
//   propKey: string,
//   propVal: any,
//   incomingObject: Record<string, any>
// ) => pred ? assoc(propKey, propVal, incomingObject) : incomingObject)

// add an item to an array if a condition is met
// could not get @ts-expect-error to work, nor get the typing to work
// F typescript: TODO:
// export const appendIf = curry((
//   condition: boolean,
//   toAppend: any[],
//   targetList: any[]
// ) => condition ? append(toAppend, targetList) : targetList)

// concatenate an array to another array if a condition is met
// could not get @ts-expect-error to work, nor get the typing to work
// F typescript: TODO:
// export const concatIf = curry((
//   condition: boolean, toConcat: any[], targetList: any[]
// ) => condition ? concat(toConcat, targetList) : targetList)

