import { ParsedWorksheetResult } from '../src/SpreadsheetParserTypes'

export type ExpectedParsedSpreadsheetResults =
  Record<string, ParsedWorksheetResult>

export const expectedSpreadsheetResults: ExpectedParsedSpreadsheetResults = {
  BasicParsing: {
    worksheetName: 'BasicParsing',
    dataLayout: 'dataTable',
    numDataRowsParsed: 10,
    metaTypes: {
      name: 'string',
      someNumber: 'number',
      someBool: 'boolean'
    },
    meta: {
      name: 'test basic spreadsheet parsing',
      someNumber: 100,
      someBool: true
    },
    dataTypes : {
      key: 'string',
      numProp: 'number',
      stringProp: 'string',
      boolProp: 'boolean',
      dateProp: 'date',
      passwordHash: 'password',
      jsonProp: 'json',
      uuidProp: 'uuid'
    },
    data: [
      {
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
        key: 'partial1',
        stringProp: 'don’t skip me',
        dateProp: '1966-06-06T00:00:00.000Z',
        jsonProp: 'don\'t skip'
      },
      {
        key: 'partial2',
        numProp: 1,
        boolProp: false,
        passwordHash: 'dont skip me', // pre-hash
        uuidProp: []
      },
      {
        expectAllUndefined: true,
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
        expectAllErrors: true,
        key: 'invalid',
        numProp: 'Invalid number: not-num -> WS:BasicParsing, Row:18 Col:B',
        boolProp: 'Invalid boolean value: \'not-bool\' -> WS:BasicParsing, Row:18 Col:D',
        dateProp: 'Invalid date: not-date -> WS:BasicParsing, Row:18 Col:E',
        jsonProp: 'Invalid JSON: not-json -> WS:BasicParsing, Row:18 Col:G',
        uuidProp: 'Invalid UUID: invalid-uuid -> WS:BasicParsing, Row:18 Col:H'
      }
    ],
  },
  FormulaAndRefParsing: {
    worksheetName: 'FormulaAndRefParsing',
    dataLayout: 'dataTable',
    numDataRowsParsed: 1,
    dataTypes: {
      key: 'string',
      formulaProp: 'number',
      refProp1: 'number',
      refProp2: 'number'
    },
    data: [
      {
        key: 'valid1',
        formulaProp: 51,
        refProp1: 49,
        refProp2: 100,
      }
    ],
  },
  ErrorCasesParsing: {
    worksheetName: 'ErrorCasesParsing',
    dataLayout: 'dataTable',
    numDataRowsParsed: 1,
    metaTypes: {
      created: 'date',
    },
    meta: {
      created: '2024-09-07T00:00:00.000Z'
    },
    dataTypes: {
      key: 'string',
      divZeroProp: 'number',
      badRefProp: 'number'
    },
    data: [
      {
        expectAllErrors: true,
        key: 'errors',
        divZeroProp: 'Cell has an error: #DIV/0! -> WS:ErrorCasesParsing, Row:7 Col:B',
        badRefProp: 'Cell has an error: #REF! -> WS:ErrorCasesParsing, Row:7 Col:C',
      }
    ],
  },
  FrontMatterOnly: {
    worksheetName: 'FrontMatterOnly',
    dataLayout: 'frontMatterOnly',
    numDataRowsParsed: 0,
    metaTypes: {
      thisParserRocks: 'boolean',
      oneHundred: 'number',
      percent: 'string',

    },
    meta: {
      thisParserRocks: true,
      oneHundred: 100,
      percent: 'percent!',
    },
  }
}
