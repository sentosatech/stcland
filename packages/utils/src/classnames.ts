import clsx, { ClassValue } from 'clsx'
import { toPairs, mergeDeepWith } from 'ramda'
import { twMerge } from 'tailwind-merge'

/**
 Parse className input using twMerge and clsx to allow conditions and prevent conflicts.
 */
export const cns = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs))
}

/**
 * TODO: remove when replaced in all usages.
   Generic `CustomStylesShape` type param used
   to determine `baseSytyles` and `customStyles` type params.
 */
type WithCustomStyles = <CustomStylesShape extends Record<string, ClassValue>>(
  baseStyles: CustomStylesShape,
  customStyles?: Partial<CustomStylesShape>,
) => CustomStylesShape

export const WithCustomStyles: WithCustomStyles = (baseStyles, customStyles = {}) => {
  const newStyles : Record<string, ClassValue> = {}
  for (const [key, value] of toPairs(baseStyles as Record<string, any>))
    newStyles[key] = cns(value, customStyles?.[key])
  return newStyles as typeof baseStyles
}


const mergeFn = (baseValue: any, customValue: any): any => {
  if (typeof customValue === 'string' && customValue.startsWith('replace ')) {
    // Replace the base value entirely with the custom value.
    return customValue.replace('replace ', '').trim()
  }

  // Recursively merge objects
  if (typeof baseValue === 'object' && typeof customValue === 'object' && !Array.isArray(customValue)) {
    return mergeDeepWith(mergeFn, baseValue, customValue)
  }

  // Fallback: Concatenate or return custom value
  return cns(baseValue, customValue)
}


export type AppliedStyles = <CustomStylesShape extends Record<string, any>>(
  baseStyles: CustomStylesShape,
  customStyles?: Partial<CustomStylesShape>,
) => CustomStylesShape

/**
 * Deep merges `baseStyles` and `customStyles`, with support for replacing classNames.
 */
export const appliedStyles: AppliedStyles = (baseStyles, customStyles = {}) => {
  return mergeDeepWith(mergeFn, baseStyles, customStyles)
}

export default cns
