import clsx, { ClassValue } from 'clsx'
import { toPairs, mergeDeepWith, is } from 'ramda'
import { twMerge } from 'tailwind-merge'

/**
 Parse className input using twMerge and clsx to allow conditions and prevent conflicts.
 */
export const cns = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs))
}

// Helper function to merge styles using classnames
const mergeFn = (base: any, custom: any) => {
  return is(String, base) && is(String, custom) ? cns(base, custom) : custom
}

/**
   Generic `CustomStylesShape` type param used
   to determine `baseSytyles` and `customStyles` type params.
 */
type WithCustomStyles = <CustomStylesShape extends Record<string, ClassValue>>(
  baseStyles: CustomStylesShape,
  customStyles?: Partial<CustomStylesShape>
) => CustomStylesShape


export const withCustomStyles: WithCustomStyles = (baseStyles, customStyles = {}) => {
  const newStyles : Record<string, ClassValue> = {}
  for (const [key, value] of toPairs(baseStyles as Record<string, any>))
    newStyles[key] = cns(value, customStyles?.[key])
  return newStyles as typeof baseStyles
}


/**
 * Deep merges `baseStyles` and `customStyles`.
 * Utilizes Ramda's `mergeDeepWith` for nested object merging.
 */
export const mergeCustomStyles: WithCustomStyles = (baseStyles, customStyles = {}) => {
  return mergeDeepWith(mergeFn, baseStyles, customStyles) as typeof baseStyles
}

export default cns
