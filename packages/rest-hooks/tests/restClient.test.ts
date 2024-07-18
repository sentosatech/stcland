import { describe, test, expect } from '@jest/globals'
import { expandRestPath, createRestClient } from '../src/restClient'
import { ClientConfig, ServerConfig } from '../src/restClientTypes'

import { setupServer } from 'msw/node'
import { handlers } from './handlers'
import { AxiosResponse } from 'axios'

import { STC } from './testTypes'

describe('Test Rest Client Utils', () => {


  test('path expansion', () => {``

    expect(expandRestPath('/raw-path')).toEqual('/raw-path')
    expect(expandRestPath('/path/with/id/:id', {
      pathParams: { id: 1 }
    })
    ).toEqual(
      '/path/with/id/1'
    )
    expect(expandRestPath('/:version/path/with/multiple/:resourceType/:resourceId', {
      pathParams: { version: 'v22', resourceType: 'users', resourceId: 33 }
    })
    ).toEqual(
      '/v22/path/with/multiple/users/33'
    )
    expect(expandRestPath('/path-with-raw-query-params', {
      queryParams: '?name=bill&age=66'
    })
    ).toEqual(
      '/path-with-raw-query-params?name=bill&age=66'
    )
    expect(expandRestPath('/path-with-query-params', {
      queryParams: { verbose: true, sort: false, max: 100 }
    })
    ).toEqual(
      '/path-with-query-params?verbose=true&sort=false&max=100'
    )
    expect(expandRestPath('/:adjective/kitchen/:noun/number/:id', {
      pathParams: { adjective: 'yellow', noun: 'sink', id: 99 },
      queryParams: { isClogged: true, forDays: 33, material: 'chrome' }
    })
    ).toEqual(
      '/yellow/kitchen/sink/number/99?isClogged=true&forDays=33&material=chrome'
    )
    expect(expandRestPath('/test-non-existent-path-params/:id', {
      pathParams: { one: 'one', two: 2, id: 3 },
    })
    ).toEqual(
      '/test-non-existent-path-params/3'
    )
    expect(expandRestPath('/unfilled_params/:notFilled', {
        pathParams: { one: 'one', two: 2, id: 3 },
      })
      ).toEqual(
        '/unfilled_params/:notFilled'
      )
  })
})


describe('Test Rest Calls Without Hooks', () => {

  // start the test server
  const server = setupServer(...handlers)
  server.listen()

  const defaultClientConfig: ClientConfig = {
    verbose: false,
    getAccessToken: () => 'testing-access-token',
    responsePostProcessorFn: (rsp: AxiosResponse) => rsp?.data || rsp
      // NOTE: this fxn strips all of the AxiosResponse except for the data
  }

  const defaultServerConfig: ServerConfig = {
    defaultBaseUrl: 'http://fakehost.com:5023',
    timeout: 1000
  }

  const defaultRestClient = createRestClient(defaultClientConfig, defaultServerConfig)


  // used accross multiple tests, so declared here
  let rsp: STC.TestResponse
  let requestInfo: STC.Rest.RequestInfo
  let responseBody: STC.Rest.ResponseBody

  test('Test Straight Get', async () => {
    [ requestInfo, responseBody ] = <STC.TestResponse> await defaultRestClient.get('/simple-get')
    expect(requestInfo?.url).toEqual('http://fakehost.com:5023/simple-get')
    expect(requestInfo?.method).toEqual('GET')
    expect(requestInfo?.headers.authorization).toEqual('Bearer testing-access-token')
    expect(responseBody).toEqual({ simpleGet: 'data' })
  })

  test('Test Get', async () => {
    {
      const getManyFn = defaultRestClient.createGetFn('/simple-get')
      rsp = await getManyFn() as unknown as STC.TestResponse;

      [ requestInfo, responseBody ] = rsp as unknown as STC.TestResponse
      expect(requestInfo?.url).toEqual('http://fakehost.com:5023/simple-get')
      expect(requestInfo?.method).toEqual('GET')
      expect(requestInfo?.headers.authorization).toEqual('Bearer testing-access-token')
      expect(responseBody).toEqual({ simpleGet: 'data' })

      const getOneFn = defaultRestClient.createGetFn('/simple-get/88')
      rsp = await getOneFn() as unknown as STC.TestResponse;

      [ requestInfo, responseBody ] = rsp as unknown as STC.TestResponse
      expect(requestInfo?.url).toEqual('http://fakehost.com:5023/simple-get/88')
      expect(requestInfo?.method).toEqual('GET')
      expect(requestInfo?.headers.authorization).toEqual('Bearer testing-access-token')
      expect(responseBody).toEqual({ simpleGet: 'data' })

      const getOneFnWithPathParams = defaultRestClient.createGetFn('/simple-get/:id')
      rsp = await getOneFnWithPathParams({
        pathParams: { id: 33 }
      }) as unknown as STC.TestResponse;

      [ requestInfo, responseBody ] = rsp as unknown as STC.TestResponse
      expect(requestInfo?.url).toEqual('http://fakehost.com:5023/simple-get/33')
      expect(requestInfo?.method).toEqual('GET')
      expect(requestInfo?.headers.authorization).toEqual('Bearer testing-access-token')
      expect(responseBody).toEqual({ simpleGet: 'data' })

      const getManyFnWithQueryParams = defaultRestClient.createGetFn('/simple-get')
      rsp = await getManyFnWithQueryParams({
        queryParams: { hydrate: true, paginate: false }
      }) as unknown as STC.TestResponse;

      [ requestInfo, responseBody ] = rsp as unknown as STC.TestResponse
      expect(requestInfo?.url).toEqual(
        'http://fakehost.com:5023/simple-get?hydrate=true&paginate=false'
      )
      expect(requestInfo?.method).toEqual('GET')
      expect(requestInfo?.headers.authorization).toEqual('Bearer testing-access-token')
      expect(responseBody).toEqual({ simpleGet: 'data' })

      const getOneFnWithQueryAndPathParams = defaultRestClient.createGetFn('/simple-get/:enityType')
      rsp = await getOneFnWithQueryAndPathParams({
        pathParams: { enityType: 'users' },
        queryParams: { limit: 100, offset: 0 }
      }) as unknown as STC.TestResponse;

      [ requestInfo, responseBody ] = rsp as unknown as STC.TestResponse
      expect(requestInfo?.url).toEqual(
        'http://fakehost.com:5023/simple-get/users?limit=100&offset=0'
      )
      expect(requestInfo?.method).toEqual('GET')
      expect(requestInfo?.headers.authorization).toEqual('Bearer testing-access-token')
      expect(responseBody).toEqual({ simpleGet: 'data' })
    }
  })
})

