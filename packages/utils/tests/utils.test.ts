import { assert, expect, describe, test } from 'vitest'

import {
  allUndefined, allNotUndefined, allDefined, allNotDefined, allDefinedOrAllUndefined
} from '../src'

describe('Testing @stcland/utils', () => {
  test('Test type utils', () => {

    expect(allUndefined(undefined, undefined, undefined)).toBe(true)
    expect(allUndefined(undefined, undefined, {})).toBe(false)
    expect(allNotUndefined(undefined, undefined, {})).toBe(true)
    expect (allNotUndefined(undefined, undefined, undefined)).toBe(false)

    expect(allDefined({}, [], 1)).toBe(true)
    expect(allDefined({}, [], 1, undefined)).toBe(false)
    expect(allNotDefined(undefined, undefined, 1)).toBe(true)
    expect(allNotDefined(1, 2, 3, 4)).toBe(false)

    expect(allDefinedOrAllUndefined(undefined, undefined, undefined)).toBe(true)
    expect(allDefinedOrAllUndefined(undefined, [], undefined)).toBe(false)
    expect(allDefinedOrAllUndefined('a', 1, {}, [])).toBe(true)
    expect(allDefinedOrAllUndefined('a', 1, undefined, [])).toBe(false)

    expect(allDefinedOrAllUndefined(undefined, undefined)).toBe(true)
    expect(allDefinedOrAllUndefined([], 'srv')).toBe(true)
    expect(allDefinedOrAllUndefined(undefined, 1)).toBe(false)
  })
})

