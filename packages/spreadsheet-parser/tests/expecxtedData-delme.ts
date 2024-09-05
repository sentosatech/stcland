import { equals } from 'ramda'
import { dateEquals, passwordToHashEquals, uuidEquals } from './testUtils'

const expecteWorksheetdData = {
  BasicParsing: {
    validateFns: {
      _key: equals,
      numProp: equals,
      stringProp: equals,
      boolProp: equals,
      dateProp: dateEquals,
      passwordHash: passwordToHashEquals,
      jsonProp: equals,
      uuidProp: uuidEquals
    },
    valid: [
      {
        _key: 'valid1',
        numProp: -100,
        stringProp: 'nospace',
        boolProp: true,
        dateProp: '2011-01-01T00:00:00.000Z',
        passwordHash: 'pw', // prehashed
        jsonProp: [ 1, 2, 3, 4 ],
        uuidProp: []
      },
      {
        _key: 'valid2',
        numProp: 9999,
        stringProp: 'with space',
        boolProp: false,
        dateProp: '2022-02-02T00:00:00.000Z',
        passwordHash: 'ariva', // prehashed
        jsonProp: { a: 1, b: 2 },
        uuidProp: ['dog-']
      },
      {
        _key: 'valid3',
        numProp: 9999,
        stringProp: 'with space',
        boolProp: false,
        dateProp: '2022-02-02T00:00:00.000Z',
        passwordHash: 'def', // prehashed
        jsonProp: { dog: 'kona', cat: 'mittens' },
        uuidProp: ['111']
      },
      {
        _key: 'valid4',
        numProp: 15.1515,
        stringProp: 'now is the time',
        boolProp: true,
        dateProp: '1933-03-03T00:00:00.000Z',
        passwordHash: 'h I j k',  // prehashed
        jsonProp: { arr: [ 'a', 'b', 'c' ] },
        uuidProp: [, '-cat']
      },
      {
        _key: 'valid5',
        numProp: -2000.1,
        stringProp: 'for-all-good-men',
        boolProp: false,
        dateProp: '1944-04-04T00:00:00.000Z',
        passwordHash: 'l-m-n:o-p',  // prehashed
        jsonProp: { o1: { c: 'c', d: [ 'e', 'f' ] } },
        uuidProp: ['black-', '-cat']
      },
      {
        _key: 'valid6',
        numProp: 0,
        stringProp: 'to.rise.and.fight',
        boolProp: true,
        dateProp: '1955-05-05T00:00:00.000Z',
        passwordHash: '123', // prehashed
        jsonProp: 'raw string',
        uuidProp: []
      }
    ],
    partial: [
      {
        _key: 'missing1',
        stringProp: 'don’t skip me',
        dateProp: '1966-06-06T00:00:00.000Z',
        jsonProp: 'don\'t skip'
      },
      {
        _key: 'missing2',
        numProp: 1,
        boolProp: false,
        passwordHash: '251ce003b4b7a614d176f3fdd1afea8b1e9ab8cf4c168d842ad73b568b20e6ca',
        uuidProp: []
      },
    ],
    empty: [
      {
        _key: 'empty',
        numProp: undefined,
        stringProp: undefined,
        boolProp: undefined,
        dateProp: undefined,
        passwordHash: undefined,
        jsonProp: undefined,
        uuidProp: undefined
      },
    ],
    invalid: [
      {
        _key: 'invalid',
        numProp: 'Invalid number: not-num -> WS:BasicParsing, Row:12 Col:B',
        boolProp: 'Invalid boolean value: \'not-bool\' -> WS:BasicParsing, Row:12 Col:D',
        dateProp: 'Invalid date: not-date -> WS:BasicParsing, Row:12 Col:E',
        jsonProp: 'Invalid JSON: not-json -> WS:BasicParsing, Row:12 Col:G',
        uuidProp: 'Invalid UUID: invalid-uuid -> WS:BasicParsing, Row:12 Col:H'
      }
    ],
  }
}
