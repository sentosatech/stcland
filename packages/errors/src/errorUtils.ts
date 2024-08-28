import { StcError } from './stcError'

export const throwIf = (condition: boolean, errorMsg: string, code?: number) => {
  if (condition) {
    console.error(`ERROR: ${errorMsg}`)
    throw new StcError(`ERROR: ${errorMsg}`, code || 500)
  }
}
