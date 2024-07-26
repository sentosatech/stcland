import { AxiosResponse } from 'axios'
import { describe, test, expect } from '@jest/globals'
import { setupServer } from 'msw/node'

import { handlers } from './handlers'

import { StcRest} from '../src/restHooksTypes'
import { StcRestTest} from './testTypes'
import { expandRestPath, createRestClient } from '../src/restClient'

describe('Test Rest Client Utils', () => {

  test('path expansion', () => {

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

describe('Test Rest Client', () => {

  // start the test server
  const server = setupServer(...handlers)
  server.listen()

  const defaultClientConfig: StcRest.ClientConfig = {
    verbose: false,
    getAccessToken: () => 'testing-access-token',
    // This fxn strips all of the AxiosResponse except for the data
    responsePostProcessorFn: (rsp: AxiosResponse) => rsp?.data || rsp
  }

  const defaultServerConfig: StcRest.ServerConfig = {
    defaultBaseUrl: 'http://fakehost.com:5023',
    timeout: 1000
  }
  // used accross multiple tests, so declared here
  let rsp: StcRestTest.TestResponse
  let requestInfo: StcRestTest.RequestInfo
  let responseBody: StcRestTest.ResponseBody
  let postData: any

  test('Test Straight Get', async () => {
    const restClient = createRestClient(defaultClientConfig, defaultServerConfig)

    rsp = await restClient.get('/simple-get') as unknown as StcRestTest.TestResponse
    [ requestInfo, responseBody ] = rsp

    expect(requestInfo?.url).toEqual('http://fakehost.com:5023/simple-get')
    expect(requestInfo?.method).toEqual('GET')
    expect(requestInfo?.headers.authorization).toEqual('Bearer testing-access-token')
    expect(responseBody).toEqual({ simpleGet: 'data' })
  })

  test('Test GetFn', async () => {
    const restClient = createRestClient(defaultClientConfig, {
      ...defaultServerConfig,
      defaultBaseUrl: 'http://fakehost2.com:7777'
    })

    // simple gets

    const getManyFn = restClient.createGetFn('/simple-get')
    rsp = await getManyFn() as unknown as StcRestTest.TestResponse

    [ requestInfo, responseBody ] = rsp

    expect(requestInfo?.url).toEqual('http://fakehost2.com:7777/simple-get')
    expect(requestInfo?.method).toEqual('GET')
    expect(requestInfo?.headers.authorization).toEqual('Bearer testing-access-token')
    expect(responseBody).toEqual({ simpleGet: 'data' })

    const getOneFn = restClient.createGetFn('/simple-get/88')

    rsp = await getOneFn() as unknown as StcRestTest.TestResponse;
    [ requestInfo, responseBody ] = rsp

    expect(requestInfo?.url).toEqual('http://fakehost2.com:7777/simple-get/88')
    expect(requestInfo?.method).toEqual('GET')
    expect(requestInfo?.headers.authorization).toEqual('Bearer testing-access-token')
    expect(responseBody).toEqual({ simpleGet: 'data' })

    // // with path params

    const getOneFnWithPathParams = restClient.createGetFn('/simple-get/:id', {
      pathParams: { id: 33 }
    })

    rsp = await getOneFnWithPathParams() as unknown as StcRestTest.TestResponse;
    [ requestInfo, responseBody ] = rsp

    expect(requestInfo?.url).toEqual('http://fakehost2.com:7777/simple-get/33')
    expect(requestInfo?.method).toEqual('GET')
    expect(requestInfo?.headers.authorization).toEqual('Bearer testing-access-token')
    expect(responseBody).toEqual({ simpleGet: 'data' })

    // with query params

    const getManyFnWithQueryParams = restClient.createGetFn('/simple-get', {
      queryParams: { hydrate: true, paginate: false }
    })

    rsp = await getManyFnWithQueryParams() as unknown as StcRestTest.TestResponse;
    [ requestInfo, responseBody ] = rsp

    expect(requestInfo?.url).toEqual(
      'http://fakehost2.com:7777/simple-get?hydrate=true&paginate=false'
    )
    expect(requestInfo?.method).toEqual('GET')
    expect(requestInfo?.headers.authorization).toEqual('Bearer testing-access-token')
    expect(responseBody).toEqual({ simpleGet: 'data' })

    // with path params and query params

    const getOneFnWithQueryAndPathParams = restClient.createGetFn('/simple-get/:enityType', {
      pathParams: { enityType: 'users' },
      queryParams: { limit: 100, offset: 0 }
    })

    rsp = await getOneFnWithQueryAndPathParams() as unknown as StcRestTest.TestResponse;
    [ requestInfo, responseBody ] = rsp

    expect(requestInfo?.url).toEqual(
      'http://fakehost2.com:7777/simple-get/users?limit=100&offset=0'
    )
    expect(requestInfo?.method).toEqual('GET')
    expect(requestInfo?.headers.authorization).toEqual('Bearer testing-access-token')
    expect(responseBody).toEqual({ simpleGet: 'data' })
  })

  test('Test Straight Post', async () => {
    const restClient = createRestClient(defaultClientConfig, defaultServerConfig)
    const postData = { name: 'bill' }
    rsp = await restClient.post(
      '/simple-post', postData) as unknown as StcRestTest.TestResponse

    [ requestInfo, responseBody ] = rsp

    expect(requestInfo?.url).toEqual('http://fakehost.com:5023/simple-post')
    expect(requestInfo?.method).toEqual('POST')
    expect(requestInfo?.headers.authorization).toEqual('Bearer testing-access-token')
    expect(requestInfo?.body).toEqual(postData)
    expect(responseBody).toEqual({ message: 'post succesful' })
  })

  test('Test PostFn', async () => {

    const restClient = createRestClient({
      ...defaultClientConfig,
      getAccessToken: () => 'another-access-token'
    }, defaultServerConfig)

    // simple post

    const postFn = restClient.createPostFn('/simple-post')
    postData = { species: 'dog', breed: 'lab' }
    rsp = await postFn(postData) as unknown as StcRestTest.TestResponse;

    [ requestInfo, responseBody ] = rsp

    expect(requestInfo?.url).toEqual('http://fakehost.com:5023/simple-post')
    expect(requestInfo?.method).toEqual('POST')
    expect(requestInfo?.headers.authorization).toEqual('Bearer another-access-token')
    expect(requestInfo?.body).toEqual(postData)
    expect(responseBody).toEqual({ message: 'post succesful' })

    // with query params

    postData = { species: 'cat', breed: 'siamese' }
    rsp = await postFn(postData, {queryParams: {
      pureBread: true, age: 3
    }}) as unknown as StcRestTest.TestResponse;

    [ requestInfo, responseBody ] = rsp

    expect(requestInfo?.url).toEqual('http://fakehost.com:5023/simple-post?pureBread=true&age=3')
    expect(requestInfo?.method).toEqual('POST')
    expect(requestInfo?.headers.authorization).toEqual('Bearer another-access-token')
    expect(requestInfo?.body).toEqual(postData)
    expect(responseBody).toEqual({ message: 'post succesful' })

    // with path params

    const postFnWithPathParams = restClient.createPostFn('/simple-post/:species')
    postData = { breed: 'golden', name: 'knoa' }
    rsp = await postFnWithPathParams(postData, {
      pathParams: { species: 'dog' }
    }) as unknown as StcRestTest.TestResponse;

    [ requestInfo, responseBody ] = rsp

    expect(requestInfo?.url).toEqual('http://fakehost.com:5023/simple-post/dog')
    expect(requestInfo?.method).toEqual('POST')
    expect(requestInfo?.headers.authorization).toEqual('Bearer another-access-token')
    expect(requestInfo?.body).toEqual(postData)
    expect(responseBody).toEqual({ message: 'post succesful' })

    // with query and path params

    postData = { breed: 'rattler', name: 'snuggles' }
    rsp = await postFnWithPathParams(postData, {
      pathParams: { species: 'snake' },
      queryParams: { region: 'rockies' }
    }) as unknown as StcRestTest.TestResponse;

    [ requestInfo, responseBody ] = rsp

    expect(requestInfo?.url).toEqual('http://fakehost.com:5023/simple-post/snake?region=rockies')
    expect(requestInfo?.method).toEqual('POST')
    expect(requestInfo?.headers.authorization).toEqual('Bearer another-access-token')
    expect(requestInfo?.body).toEqual(postData)
    expect(responseBody).toEqual({ message: 'post succesful' })
  })

  test.skip('Test Straight Put', async () => {})
  test.skip('Test PutFn', async () => {})

  test.skip('Test Straight Patch', async () => {})
  test.skip('Test PatchFn', async () => {})

  test.skip('Test Straight Delete', async () => {})
  test.skip('Test DeleteFn', async () => {})

})
