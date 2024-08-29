import clsx, { ClassValue } from 'clsx'
import { toPairs } from 'ramda'
import { twMerge } from 'tailwind-merge'

/**
 Parse className input using twMerge and clsx to allow conditions and prevent conflicts.
 */
export const cns = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs))
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
  
export default cns
