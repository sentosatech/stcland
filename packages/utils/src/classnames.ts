import clsx, { ClassValue } from 'clsx'
import { toPairs } from 'ramda'
import { twMerge } from 'tailwind-merge'

/**
 Parse className input using twMerge and clsx to allow conditions and prevent conflicts.
 */
export const cns = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs))
}


export const withCustomStyles = (baseStyles: Record<string, ClassValue>, customStyles: Record<string, ClassValue>) => {
  const newStyles: Record<string, string> = {}
  for (const [key, value] of toPairs(baseStyles))
    newStyles[key] = cns(value, customStyles?.[key])
  return newStyles
}

export default cns
