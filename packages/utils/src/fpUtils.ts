import { reverse } from 'ramda'

type PipeFunc = (arg: unknown) => unknown;

const _applyAsync =
  (acc: Promise<unknown>, val: (value: unknown) => unknown) => acc.then(val)

export const pipeAsync = (...funcs: PipeFunc[]) =>
  (x: unknown) => funcs.reduce(_applyAsync, Promise.resolve(x))

export const composeAsync = (...funcs: PipeFunc[]) =>
  (x: unknown) => reverse(funcs).reduce(_applyAsync, Promise.resolve(x))
