import { ParsedWorksheetResult } from '../src/SpreadsheetParserTypes'

export type ExpectedParsedSpreadsheetResults =
  Record<string, ParsedWorksheetResult>

export const expectedSpreadsheetResults: ExpectedParsedSpreadsheetResults = {
  BasicParsing: {
    worksheetName: 'BasicParsing',
    dataLayout: 'dataTable',
    numDataRowsParsed: 10,
    metaTypeMap: {
      name: 'string',
      someNumber: 'number',
      someBool: 'boolean'
    },
    meta: {
      name: 'test basic spreadsheet parsing',
      someNumber: 100,
      someBool: true
    },
    dataTypeMap : {
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
    dataTypeMap: {
      key: 'string',
      formulaProp: 'number',
      refProp1: 'number',
      refProp2: 'number',
      note: 'string',
    },
    data: [
      {
        key: 'valid1',
        formulaProp: 51,
        refProp1: 49,
        refProp2: 100,
        note: 'Note no front matter on this sheet'
      }
    ],
  },
  ErrorCasesParsing: {
    worksheetName: 'ErrorCasesParsing',
    dataLayout: 'dataTable',
    numDataRowsParsed: 1,
    metaTypeMap: {
      created: 'date',
    },
    meta: {
      created: '2024-09-07T00:00:00.000Z'
    },
    dataTypeMap: {
      key: 'string',
      divZeroProp: 'number',
      badRefProp: 'number',
      badStringList: 'string:list',
      badBoolList: 'boolean:list',
      badUuidList: 'uuid:list',
    },
    data: [
      {
        expectAllErrors: true,
        key: 'errors',
        divZeroProp: 'Cell has an error: #DIV/0! -> WS:ErrorCasesParsing, Row:7 Col:B',
        badRefProp: 'Cell has an error: #REF! -> WS:ErrorCasesParsing, Row:7 Col:C',
        badStringList: ['Invalid data type for table data: \'string:list\', row data lists not valid for table data -> WS:ErrorCasesParsing, Row:7 Col:D'],
        badBoolList: ['Invalid data type for table data: \'boolean:list\', row data lists not valid for table data -> WS:ErrorCasesParsing, Row:7 Col:E'],
        badUuidList: ['Invalid data type for table data: \'uuid:list\', row data lists not valid for table data -> WS:ErrorCasesParsing, Row:7 Col:F'],
      }
    ],
  },
  DataCollectionParsing: {
    worksheetName: 'DataCollectionParsing',
    dataLayout: 'dataCollection',
    numDataRowsParsed: 4,
    metaTypeMap: {
      note: 'string',
    },
    meta: {
      note: 'This spreadsheet represents a data list instead of a data table, returned as an object',
    },
    dataTypeMap: {
      prop1: 'string',
      prop2: 'number',
      prop3: 'json',
      prop4: 'uuid'
    },
    data:     {
      prop1: 'first prop in data list',
      prop2: 2,
      prop3:  { my: 'dude' },
      prop4: []
    }

  },
  RowValueListParsing : {
    worksheetName: 'RowValueListParsing',
    dataLayout: 'dataCollection',
    numDataRowsParsed: 7,
    meta: {
      note: 'This spreadsheet test row value list parsing'
    },
    metaTypeMap: {
      note: 'string'
    },
    dataTypeMap: {
      stringList: 'string:list',
      numberList: 'number:list',
      boolList: 'boolean:list',
      dateList: 'date:list',
      passwordList: 'password:list',
      jsonList: 'json:list',
      uuidList: 'uuid:list'
    },
    data: {
      stringList: [ 'a', 'b', 'c', 'd' ],
      numberList: [1, 2, 3 ],
      boolList: [ true, true, false, true, true ],
      dateList: [
        '2024-08-22T00:00:00.000Z',
        '2024-08-23T00:00:00.000Z'
      ],
      passwordList: [ 'pw1', 'pw2', 'pw3' ],
      jsonList: [ 'jlist' ],
      uuidList: [[],[],[],[],[],]
    },
  },
  FrontMatterOnly: {
    worksheetName: 'FrontMatterOnly',
    dataLayout: 'frontMatterOnly',
    numDataRowsParsed: 0,
    metaTypeMap: {
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
