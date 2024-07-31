import { AxiosResponse } from 'axios'
import { describe, test, expect } from '@jest/globals'
import { setupServer } from 'msw/node'

import { handlers } from './handlers'

import { StcRest } from '../src/restHooksTypes'
import { StcRestTest } from './testTypes'
import { expandRestPath, createRestClient } from '../src/restClient'

const DEFAULT_BASE_URL = 'http://fakehost.com:5023'

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

  /**
    Helper handler to assert response details based on the REST METHOD.
   */
  const assertResponse = (
    method: StcRestTest.Request['method'],
    // The HTTP method used in the request.
    path: string,
    // Composed path, can container either query and/or path params.
    bodyData?: Record<string, unknown>
    // (Optional) The expected body data.
  ) => {
    
    expect(requestInfo?.url).toEqual(`${DEFAULT_BASE_URL}${path}`)
    expect(requestInfo?.method).toEqual(method)
    expect(requestInfo?.headers.authorization).toEqual('Bearer testing-access-token')

    // Verify the request body or ensure it's null for DELETE.
    if (method !== 'GET') {
      method === 'DELETE'  ? expect(responseBody?.body).toBeNull() : expect(requestInfo?.body).toEqual(bodyData)
    }

    expect(responseBody).toEqual({ message: `${method.toLowerCase()} succesful` })
  }

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
    defaultBaseUrl: DEFAULT_BASE_URL,
    timeout: 1000
  }
  // used accross multiple tests, so declared here
  let rsp: StcRestTest.TestResponse
  let requestInfo: StcRestTest.RequestInfo
  let responseBody: StcRestTest.ResponseBody
  let data: any
  let restParams: StcRest.RestParams

  test('Test Straight Get', async () => {
    const restClient = createRestClient(defaultClientConfig, defaultServerConfig)

    rsp = await restClient.get('/simple-get') as unknown as StcRestTest.TestResponse
    [ requestInfo, responseBody ] = rsp

    assertResponse('GET', '/simple-get')
  })

  test('Test GetFn', async () => {
    const restClient = createRestClient(defaultClientConfig, {
      ...defaultServerConfig,
      defaultBaseUrl: DEFAULT_BASE_URL
    })

    // simple gets

    const getManyFn = restClient.createGetFn('/simple-get')
    rsp = await getManyFn() as unknown as StcRestTest.TestResponse

    [ requestInfo, responseBody ] = rsp

    assertResponse('GET', '/simple-get')

    const getOneFn = restClient.createGetFn('/simple-get/88')

    rsp = await getOneFn() as unknown as StcRestTest.TestResponse;
    [ requestInfo, responseBody ] = rsp

    assertResponse('GET',  '/simple-get/88')

    // with path params

    const getOneFnWithPathParams = restClient.createGetFn('/simple-get/:id', {
      pathParams: { id: 33 }
    })

    rsp = await getOneFnWithPathParams() as unknown as StcRestTest.TestResponse;
    [ requestInfo, responseBody ] = rsp

    assertResponse('GET', '/simple-get/33')

    // with query params

    const getManyFnWithQueryParams = restClient.createGetFn('/simple-get', {
      queryParams: { hydrate: true, paginate: false }
    })

    rsp = await getManyFnWithQueryParams() as unknown as StcRestTest.TestResponse;
    [ requestInfo, responseBody ] = rsp

    assertResponse('GET', '/simple-get?hydrate=true&paginate=false')

    // with path params and query params

    const getOneFnWithQueryAndPathParams = restClient.createGetFn('/simple-get/:enityType', {
      pathParams: { enityType: 'users' },
      queryParams: { limit: 100, offset: 0 }
    })

    rsp = await getOneFnWithQueryAndPathParams() as unknown as StcRestTest.TestResponse;
    [ requestInfo, responseBody ] = rsp

    assertResponse('GET', '/simple-get/users?limit=100&offset=0')
  })

  test('Test Straight Post', async () => {
    const restClient = createRestClient(defaultClientConfig, defaultServerConfig)
    const postData = { name: 'bill' }
    rsp = await restClient.post(
      '/simple-post', postData) as unknown as StcRestTest.TestResponse

    [ requestInfo, responseBody ] = rsp

    assertResponse('POST', '/simple-post', postData)
  })

  test('Test PostFn', async () => {

    const restClient = createRestClient({
      ...defaultClientConfig,
      getAccessToken: () => 'testing-access-token'
    }, defaultServerConfig)

    // simple post

    const postFn = restClient.createPostFn('/simple-post')
    data = { species: 'dog', breed: 'lab' }
    rsp = await postFn({ data }) as unknown as StcRestTest.TestResponse;

    [ requestInfo, responseBody ] = rsp

    assertResponse('POST', '/simple-post', data)

    // with query params

    data = { species: 'cat', breed: 'siamese' }
    restParams = { queryParams: { pureBread: true, age: 3 } }
    rsp = await postFn({ data, restParams }) as unknown as StcRestTest.TestResponse;

    [ requestInfo, responseBody ] = rsp

    
    assertResponse('POST', '/simple-post?pureBread=true&age=3', data)

    // with path params

    const postFnWithPathParams = restClient.createPostFn('/simple-post/:species')
    data = { breed: 'golden', name: 'kona' }
    restParams = { pathParams: { species: 'dog' } }


    rsp = await postFnWithPathParams({ data, restParams }) as unknown as StcRestTest.TestResponse;

    [ requestInfo, responseBody ] = rsp

    assertResponse('POST', '/simple-post/dog', data)

    // with query and path params

    data = { breed: 'rattler', name: 'snuggles' }
    restParams = {
      pathParams: { species: 'snake' },
      queryParams: { region: 'rockies' }
    }
    rsp = await postFnWithPathParams(
      { data, restParams }) as unknown as StcRestTest.TestResponse;

    [ requestInfo, responseBody ] = rsp

    assertResponse('POST', '/simple-post/snake?region=rockies', data)
  })

  test('Test Straight Put', async () => {
    const restClient = createRestClient(
      defaultClientConfig,    
      defaultServerConfig
    )
    const putData = { songs: ['Graves', 'Fade Away', 'Anything Can Happen In The Next Half Hour'] }
    rsp = (await restClient.put(
      '/simple-put/user/favorite-songs',
      putData
    )) as unknown as StcRestTest.TestResponse;

    [requestInfo, responseBody] = rsp

    assertResponse('PUT', '/simple-put/user/favorite-songs', putData)
  })

  test('Test PutFn', async () => {
    
    const restClient = createRestClient({
      ...defaultClientConfig,
      getAccessToken: () => 'testing-access-token'
    }, defaultServerConfig)

    // simple put

    const putFn = restClient.createPutFn('/simple-put')
    data = { songName: 'Graves' }
    rsp = await putFn({ data }) as unknown as StcRestTest.TestResponse;

    [ requestInfo, responseBody ] = rsp

    assertResponse('PUT', '/simple-put', data)

    // with query params

    data = { songName: 'Lost' }
    restParams = { queryParams: { genre: 'metal' } }
    rsp = (await putFn({ data, restParams })) as unknown as StcRestTest.TestResponse;

    [requestInfo, responseBody] = rsp


    assertResponse('PUT', '/simple-put?genre=metal', data)

    // with path params

    const putFnWithPathParams = restClient.createPutFn('/simple-put/:id')
    data = { songName: 'Songs for No One' }
    const pathParams = { id: '123' }

    rsp = (await putFnWithPathParams({ data, restParams: { pathParams } })) as unknown as StcRestTest.TestResponse;

    [requestInfo, responseBody] = rsp

    assertResponse('PUT', '/simple-put/123', data)

    // with query and path params

    data = { songName: 'Capulet' }
    restParams = {
      pathParams: { id:'666' },
      queryParams: { genre: 'ballad' },
    }

    rsp = (await putFnWithPathParams({ data, restParams })) as unknown as StcRestTest.TestResponse;

    [requestInfo, responseBody] = rsp
  
    assertResponse('PUT','/simple-put/666?genre=ballad', data)
  })

  test('Test Straight Patch', async () => {
    const restClient = createRestClient(
      defaultClientConfig,    
      defaultServerConfig
    )
    const patchData = { artist: 'Caligulas Horse' }
    rsp = (await restClient.patch(
      '/simple-patch/user/favorite-song',
      patchData
    )) as unknown as StcRestTest.TestResponse;

    [requestInfo, responseBody] = rsp

    assertResponse('PATCH', '/simple-patch/user/favorite-song', patchData)
  })

  test('Test PatchFn', async () => {
    const restClient = createRestClient({
      ...defaultClientConfig,
      getAccessToken: () => 'testing-access-token'
    }, defaultServerConfig)

    // simple patch

    const patchFn = restClient.createPatchFn('/simple-patch')
    data = { artist: 'Enter Shikari' }
    rsp = await patchFn({ data }) as unknown as StcRestTest.TestResponse;

    [ requestInfo, responseBody ] = rsp

    assertResponse('PATCH', '/simple-patch', data)

    // with query params

    data = { artist: 'Maria Cristina Plata' }
    restParams = { queryParams: { genre: 'folk' } }
    rsp = (await patchFn({ data, restParams })) as unknown as StcRestTest.TestResponse;

    [requestInfo, responseBody] = rsp

    assertResponse('PATCH', '/simple-patch?genre=folk', data)

    // with path params

    const patchFnWithPathParams = restClient.createPatchFn('/simple-patch/:genre')
    data = { artist: 'Breaking Benjamin' }
    const pathParams = { genre: 'metal' }

    rsp = (await patchFnWithPathParams({ data, restParams: { pathParams } })) as unknown as StcRestTest.TestResponse;

    [requestInfo, responseBody] = rsp

    assertResponse('PATCH', '/simple-patch/metal', data)

    // with query and path params

    data = { artist: 'Esperanza Spalding' }
    restParams = {
      pathParams: { genre:'jazz' },
      queryParams: { song: 'radio song' },
    }

    rsp = (await patchFnWithPathParams({ data, restParams })) as unknown as StcRestTest.TestResponse;

    [requestInfo, responseBody] = rsp
  
    assertResponse('PATCH', '/simple-patch/jazz?song=radio%20song', data)
  })

  test.skip('Test Straight Delete', async () => {})
  test.skip('Test DeleteFn', async () => {})

})
