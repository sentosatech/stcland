import { reverse } from 'ramda'

type PipeFunc = (arg: unknown) => unknown;

const _applyAsync =
  (acc: Promise<unknown>, val: (value: unknown) => unknown) => acc.then(val)

export const pipeAsync = (...funcs: PipeFunc[]) =>
  (x: unknown) => funcs.reduce(_applyAsync, Promise.resolve(x))

export const composeAsync = (...funcs: PipeFunc[]) =>
  (x: unknown) => reverse(funcs).reduce(_applyAsync, Promise.resolve(x))

export type PredFn<TData> = (arg: TData) => boolean

export const passthrough = (v: any) => v

// Custom async complement function
export const asyncComplement = <T extends any[]>(fn: (...args: T) => Promise<boolean>) => {
  return async (...args: T): Promise<boolean> => {
    const result = await fn(...args)
    return !result
  }
}
