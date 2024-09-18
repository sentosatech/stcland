// import { StcError } from './stcError'

export const throwIf = (condition: boolean, errorMsg: string, code?: number) => {
  if (condition) {
    // console.error(`ERROR: ${errorMsg}`) // TEMP
    // throw new StcError(`ERROR: ${errorMsg}`, code || 500)
    throw new Error(`ERROR: ${errorMsg}`)
  }
}

export const logAndthrowIf = (condition: boolean, errorMsg: string, code?: number) => {
  if (condition) {
    console.error(`ERROR: ${errorMsg}`)
    // throw new StcError(`ERROR: ${errorMsg}`, code || 500)
    throw new Error(`ERROR: ${errorMsg}`)
  }
}
