import { equals } from 'ramda'
import { toJson, passthrough } from '@stcland/utils'
import {
  dateEquals, passwordToHashEquals, uuidEquals, expectedPasswordHashStr, expectedUuidString
} from './testUtils'

export const entryTypes = [ 'all-valid', 'all-empty', 'all-invalid' ]

export const worksheetTestSpecs = {
  BasicParsing: {
    validateFns: {
      key: equals,
      numProp: equals,
      stringProp: equals,
      boolProp: equals,
      dateProp: dateEquals,
      passwordHash: passwordToHashEquals,
      jsonProp: equals,
      uuidProp: uuidEquals
    },
    expectedValueToLogFns: {
      key: passthrough,
      numProp: passthrough,
      stringProp: passthrough,
      boolProp: passthrough,
      dateProp: passthrough,
      passwordHash: expectedPasswordHashStr,
      jsonProp: toJson,
      uuidProp: expectedUuidString
    },
    parsedValueToLogFns: {
      key: passthrough,
      numProp: passthrough,
      stringProp: passthrough,
      boolProp: passthrough,
      dateProp: (d: Date) => d.toISOString(),
      passwordHash: passthrough,
      jsonProp: toJson,
      uuidProp: passthrough
    },
    expectedDataList: [
      {
        type: 'all-valid',
        key: 'valid1',
        numProp: -100,
        stringProp: 'nospace',
        boolProp: true,
        dateProp: '2011-01-01T00:00:00.000Z',
        passwordHash: 'pw', // pre-hash
        jsonProp: [ 1, 2, 3, 4 ],
        uuidProp: []
      },
      {
        type: 'all-valid',
        key: 'valid2',
        numProp: 9999,
        stringProp: 'with space',
        boolProp: false,
        dateProp: '2022-02-02T00:00:00.000Z',
        passwordHash: 'ariva', // pre-hash
        jsonProp: { a: 1, b: 2 },
        uuidProp: ['dog-']
      },
      {
        type: 'all-valid',
        key: 'valid3',
        numProp: 9999,
        stringProp: 'with space',
        boolProp: false,
        dateProp: '2022-02-02T00:00:00.000Z',
        passwordHash: 'def', // pre-hash
        jsonProp: { dog: 'kona', cat: 'mittens' },
        uuidProp: ['111-']
      },
      {
        type: 'all-valid',
        key: 'valid4',
        numProp: 15.1515,
        stringProp: 'now is the time',
        boolProp: true,
        dateProp: '1933-03-03T00:00:00.000Z',
        passwordHash: 'h I j k',  // pre-hash
        jsonProp: { arr: [ 'a', 'b', 'c' ] },
        uuidProp: [, '-cat']
      },
      {
        type: 'all-valid',
        key: 'valid5',
        numProp: -2000.1,
        stringProp: 'for-all-good-men',
        boolProp: false,
        dateProp: '1944-04-04T00:00:00.000Z',
        passwordHash: 'l-m-n:o-p',  // pre-hash
        jsonProp: { o1: { c: 'c', d: [ 'e', 'f' ] } },
        uuidProp: ['black-', '-cat']
      },
      {
        type: 'all-valid',
        key: 'valid6',
        numProp: 0,
        stringProp: 'to.rise.and.fight',
        boolProp: true,
        dateProp: '1955-05-05T00:00:00.000Z',
        passwordHash: '123', // pre-hash
        jsonProp: 'raw string',
        uuidProp: []
      },
      {
        type: 'all-valid',
        key: 'partial1',
        stringProp: 'don’t skip me',
        dateProp: '1966-06-06T00:00:00.000Z',
        jsonProp: 'don\'t skip'
      },
      {
        type: 'all-valid',
        key: 'partial2',
        numProp: 1,
        boolProp: false,
        passwordHash: 'dont skip me', // pre-hash
        uuidProp: []
      },
      {
        type: 'all-empty',
        key: 'empty',
        numProp: undefined,
        stringProp: undefined,
        boolProp: undefined,
        dateProp: undefined,
        passwordHash: undefined,
        jsonProp: undefined,
        uuidProp: undefined
      },
      {
        type: 'all-invalid',
        key: 'invalid',
        numProp: 'Invalid number: not-num -> WS:BasicParsing, Row:12 Col:B',
        boolProp: 'Invalid boolean value: \'not-bool\' -> WS:BasicParsing, Row:12 Col:D',
        dateProp: 'Invalid date: not-date -> WS:BasicParsing, Row:12 Col:E',
        jsonProp: 'Invalid JSON: not-json -> WS:BasicParsing, Row:12 Col:G',
        uuidProp: 'Invalid UUID: invalid-uuid -> WS:BasicParsing, Row:12 Col:H'
      }
    ],
  }
}
