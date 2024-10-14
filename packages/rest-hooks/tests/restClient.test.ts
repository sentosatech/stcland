import { AxiosResponse } from 'axios'
import { describe, test, expect } from 'vitest'
import { setupServer } from 'msw/node'

import { handlers } from './handlers'

import { StcRest } from '../src/restHooksTypes'
import { StcRestTest } from './testTypes'
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

  /**
    Helper handler to assert response details based on the REST METHOD.
   */
  const assertResponse = (
    response: StcRestTest.TestResponse,
    // The response which contains requestInfo and responseBody.
    expectedResponse: StcRestTest.TestResponse
    // The expected response, varying depending on the test case.
  ) => {

    const { meta: restCallInputs } = response
    const { meta: expectedRestCallInputs } = expectedResponse

    expect(response.data).toEqual(expectedResponse.data)

    expect(restCallInputs?.url).toEqual(expectedRestCallInputs?.url)
    expect(restCallInputs?.method).toEqual(expectedRestCallInputs?.method)
    expect(restCallInputs?.headers.authorization).toEqual(expectedRestCallInputs?.headers.authorization)

    if ( expectedRestCallInputs?.method === 'GET' || expectedRestCallInputs?.method === 'DELETE')
      expect(restCallInputs?.body).toBeNull()
    else
      expect(restCallInputs?.body).toEqual(expectedRestCallInputs?.body)
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
    defaultBaseUrl: 'http://fakehost.com:5023',
    timeout: 1000
  }

  // used accross multiple tests, so declared here
  let rsp: StcRestTest.TestResponse
  let body: any
  let restParams: StcRest.RestParams
  let expectedRsp: StcRestTest.TestResponse

  test('Test Straight Get', async () => {
    const restClient = createRestClient(defaultClientConfig, defaultServerConfig)

    rsp = await restClient.get('/simple-get') as unknown as StcRestTest.TestResponse
    expectedRsp = {
      data: { 'simpleGet': 'data' },
      meta: {
        url: 'http://fakehost.com:5023/simple-get',
        method: 'GET',
        headers: { authorization: 'Bearer testing-access-token' },
      }
    }
    assertResponse(rsp, expectedRsp)
  })

  test('Test GetFn', async () => {
    const restClient = createRestClient(defaultClientConfig, {
      ...defaultServerConfig,
      defaultBaseUrl: 'http://fakehost2.com:7777'
    })

    // simple gets

    const getManyFn = restClient.createGetFn('/simple-get')
    rsp = await getManyFn() as unknown as StcRestTest.TestResponse

    expectedRsp = {
      data: { 'simpleGet': 'data' },
      meta: {
        url: 'http://fakehost2.com:7777/simple-get',
        method: 'GET',
        headers: { authorization: 'Bearer testing-access-token' },
      }
    }
    assertResponse(rsp, expectedRsp)

    const getOneFn = restClient.createGetFn('/simple-get/88')

    rsp = await getOneFn() as unknown as StcRestTest.TestResponse

    expectedRsp = {
      data: { 'simpleGet': 'data' },
      meta: {
        url: 'http://fakehost2.com:7777/simple-get/88',
        method: 'GET',
        headers: { authorization: 'Bearer testing-access-token' },
      }
    }
    assertResponse(rsp,  expectedRsp)

    // with path params

    const getOneFnWithPathParams = restClient.createGetFn('/simple-get/:id', {
      pathParams: { id: 33 }
    })

    rsp = await getOneFnWithPathParams() as unknown as StcRestTest.TestResponse

    expectedRsp = {
      data:  { 'simpleGet': 'data' },
      meta: {
        url: 'http://fakehost2.com:7777/simple-get/33',
        method: 'GET',
        headers: { authorization: 'Bearer testing-access-token' },
      }
    }
    assertResponse(rsp, expectedRsp)

    // with query params

    const getManyFnWithQueryParams = restClient.createGetFn('/simple-get', {
      queryParams: { hydrate: true, paginate: false }
    })

    rsp = await getManyFnWithQueryParams() as unknown as StcRestTest.TestResponse

    expectedRsp = {
      data: { 'simpleGet': 'data' },
      meta: {
        url: 'http://fakehost2.com:7777/simple-get?hydrate=true&paginate=false',
        method: 'GET',
        headers: { authorization: 'Bearer testing-access-token' },
      }
    }
    assertResponse(rsp, expectedRsp)

    // with path params and query params

    const getOneFnWithQueryAndPathParams = restClient.createGetFn('/simple-get/:enityType', {
      pathParams: { enityType: 'users' },
      queryParams: { limit: 100, offset: 0 }
    })

    rsp = await getOneFnWithQueryAndPathParams() as unknown as StcRestTest.TestResponse

    expectedRsp = {
      data: { 'simpleGet': 'data' },
      meta: {
        url: 'http://fakehost2.com:7777/simple-get/users?limit=100&offset=0',
        method: 'GET',
        headers: { authorization: 'Bearer testing-access-token' },
      }
    }
    assertResponse(rsp, expectedRsp)
  })

  test('Test Straight Post', async () => {
    const restClient = createRestClient(defaultClientConfig, defaultServerConfig)
    const postData = { name: 'bill' }

    rsp = await restClient.post(
      '/simple-post', postData) as unknown as StcRestTest.TestResponse

    expectedRsp = {
      data: {
        message: 'post successful'
      },
      meta: {
        url: 'http://fakehost.com:5023/simple-post',
        method: 'POST',
        headers: { authorization: 'Bearer testing-access-token' },
        body: postData,
      }
    }
    assertResponse(rsp, expectedRsp)
  })

  test('Test PostFn', async () => {

    const restClient = createRestClient({
      ...defaultClientConfig,
      getAccessToken: () => 'another-access-token'
    }, defaultServerConfig)

    // simple post

    const postFn = restClient.createPostFn('/simple-post')
    body = { species: 'dog', breed: 'lab' }
    rsp = await postFn({ data: body }) as unknown as StcRestTest.TestResponse

    expectedRsp = {
      data:  {
        message: 'post successful'
      },
      meta: {
        url: 'http://fakehost.com:5023/simple-post',
        method: 'POST',
        headers: { authorization: 'Bearer another-access-token' },
        body,
      }
    }
    assertResponse(rsp, expectedRsp)

    // with query params

    body = { species: 'cat', breed: 'siamese' }
    restParams = { queryParams: { pureBread: true, age: 3 } }

    rsp = await postFn({ data: body, restParams }) as unknown as StcRestTest.TestResponse

    expectedRsp = {
      data: {
        message: 'post successful'
      },
      meta:{
        url: 'http://fakehost.com:5023/simple-post?pureBread=true&age=3',
        method: 'POST',
        headers: { authorization: 'Bearer another-access-token' },
        body,
      }
    }
    assertResponse(rsp, expectedRsp)

    // with path params

    const postFnWithPathParams = restClient.createPostFn('/simple-post/:species')
    body = { breed: 'golden', name: 'kona' }
    restParams = { pathParams: { species: 'dog' } }

    rsp = await postFnWithPathParams({ data: body, restParams }) as unknown as StcRestTest.TestResponse

    expectedRsp = {
      data: {
        message: 'post successful'
      },
      meta: {
        url: 'http://fakehost.com:5023/simple-post/dog',
        method: 'POST',
        headers: { authorization: 'Bearer another-access-token' },
        body,
      }
    }
    assertResponse(rsp, expectedRsp)

    // with query and path params

    body = { breed: 'rattler', name: 'snuggles' }
    restParams = {
      pathParams: { species: 'snake' },
      queryParams: { region: 'rockies' }
    }

    rsp = await postFnWithPathParams(
      { data: body, restParams }) as unknown as StcRestTest.TestResponse

    expectedRsp = {
      data: {
        message: 'post successful'
      },
      meta: {
        url: 'http://fakehost.com:5023/simple-post/snake?region=rockies',
        method: 'POST',
        headers: { authorization: 'Bearer another-access-token' },
        body,
      }
    }
    assertResponse(rsp, expectedRsp)
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
    )) as unknown as StcRestTest.TestResponse

    expectedRsp = {
      data: {
        message: 'put successful'
      },
      meta:{
        url: 'http://fakehost.com:5023/simple-put/user/favorite-songs',
        method: 'PUT',
        headers: { authorization: 'Bearer testing-access-token' },
        body: putData
      }
    }
    assertResponse(rsp, expectedRsp)
  })

  test('Test PutFn', async () => {

    const restClient = createRestClient({
      ...defaultClientConfig,
      getAccessToken: () => 'another-access-token'
    }, defaultServerConfig)

    // simple put

    const putFn = restClient.createPutFn('/simple-put')
    body = { songName: 'Graves' }

    rsp = await putFn({ data: body }) as unknown as StcRestTest.TestResponse

    expectedRsp = {
      data:  {
        message: 'put successful'
      },
      meta: {
        url: 'http://fakehost.com:5023/simple-put',
        method: 'PUT',
        headers: { authorization: 'Bearer another-access-token' },
        body,
      }
    }
    assertResponse(rsp, expectedRsp)

    // with query params

    body = { songName: 'Lost' }
    restParams = { queryParams: { genre: 'metal' } }

    rsp = (await putFn({ data: body, restParams })) as unknown as StcRestTest.TestResponse

    expectedRsp = {
      data: {
        message: 'put successful'
      },
      meta: {
        url: 'http://fakehost.com:5023/simple-put?genre=metal',
        method: 'PUT',
        headers: { authorization: 'Bearer another-access-token' },
        body,
      }
    }
    assertResponse(rsp, expectedRsp)

    // with path params

    const putFnWithPathParams = restClient.createPutFn('/simple-put/:id')
    body = { songName: 'Songs for No One' }
    const pathParams = { id: '123' }

    rsp = (await putFnWithPathParams({ data: body, restParams: { pathParams } })) as unknown as StcRestTest.TestResponse

    expectedRsp = {
      data:  {
        message: 'put successful'
      },
      meta: {
        url: 'http://fakehost.com:5023/simple-put/123',
        method: 'PUT',
        headers: { authorization: 'Bearer another-access-token' },
        body,
      }
    }
    assertResponse(rsp, expectedRsp)

    // with query and path params

    body = { songName: 'Capulet' }
    restParams = {
      pathParams: { id:'666' },
      queryParams: { genre: 'ballad' },
    }

    rsp = (await putFnWithPathParams({ data: body, restParams })) as unknown as StcRestTest.TestResponse

    expectedRsp = {
      data:  {
        message: 'put successful'
      },
      meta: {
        url: 'http://fakehost.com:5023/simple-put/666?genre=ballad',
        method: 'PUT',
        headers: { authorization: 'Bearer another-access-token' },
        body,
      }
    }
    assertResponse(rsp, expectedRsp)
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
    )) as unknown as StcRestTest.TestResponse

    expectedRsp = {
      data:  {
        message: 'patch successful'
      },
      meta: {
        url: 'http://fakehost.com:5023/simple-patch/user/favorite-song',
        method: 'PATCH',
        headers: { authorization: 'Bearer testing-access-token' },
        body: patchData,
      }
    }
    assertResponse(rsp, expectedRsp)
  })

  test('Test PatchFn', async () => {
    const restClient = createRestClient({
      ...defaultClientConfig,
      getAccessToken: () => 'different-access-token'
    }, defaultServerConfig)

    // simple patch

    const patchFn = restClient.createPatchFn('/simple-patch')
    body = { artist: 'Enter Shikari' }
    rsp = await patchFn({ data: body }) as unknown as StcRestTest.TestResponse

    expectedRsp = {
      data:  {
        message: 'patch successful'
      },
      meta: {
        url: 'http://fakehost.com:5023/simple-patch',
        method: 'PATCH',
        headers: { authorization: 'Bearer different-access-token' },
        body
      }
    }
    assertResponse(rsp, expectedRsp)

    // with query params

    body = { artist: 'Maria Cristina Plata' }
    restParams = { queryParams: { genre: 'folk' } }

    rsp = (await patchFn({ data: body, restParams })) as unknown as StcRestTest.TestResponse

    expectedRsp = {
      data: {
        message: 'patch successful'
      },
      meta: {
        url: 'http://fakehost.com:5023/simple-patch?genre=folk',
        method: 'PATCH',
        headers: { authorization: 'Bearer different-access-token' },
        body
      }
    }
    assertResponse(rsp, expectedRsp)

    // with path params

    const patchFnWithPathParams = restClient.createPatchFn('/simple-patch/:genre')
    body = { artist: 'Breaking Benjamin' }
    const pathParams = { genre: 'metal' }

    rsp = (await patchFnWithPathParams({ data: body, restParams: { pathParams } })) as unknown as StcRestTest.TestResponse

    expectedRsp = {
      data: {
        message: 'patch successful'
      },
      meta: {
        url: 'http://fakehost.com:5023/simple-patch/metal',
        method: 'PATCH',
        headers: { authorization: 'Bearer different-access-token' },
        body,
      }
    }
    assertResponse(rsp, expectedRsp)

    // with query and path params

    body = { artist: 'Esperanza Spalding' }
    restParams = {
      pathParams: { genre:'jazz' },
      queryParams: { song: 'radio song' },
    }

    rsp = (await patchFnWithPathParams({ data: body, restParams })) as unknown as StcRestTest.TestResponse

    expectedRsp = {
      data: {
        message: 'patch successful'
      },
      meta: {
        url: 'http://fakehost.com:5023/simple-patch/jazz?song=radio%20song',
        method: 'PATCH',
        headers: { authorization: 'Bearer different-access-token' },
        body,
      }
    }
    assertResponse(rsp, expectedRsp)
  })

  test('Test Straight Delete', async () => {
    const restClient = createRestClient(
      defaultClientConfig,
      defaultServerConfig
    )

    const rsp = (await restClient.delete(
      '/simple-delete/user/favorite-songs'
    )) as unknown as StcRestTest.TestResponse

    expectedRsp = {
      data: {
        message: 'delete successful'
      },
      meta: {
        url: 'http://fakehost.com:5023/simple-delete/user/favorite-songs',
        method: 'DELETE',
        headers: { authorization: 'Bearer testing-access-token' },
        body: null,
      }
    }
    assertResponse(rsp, expectedRsp)
  })

  test('Test DeleteFn', async () => {

    const restClient = createRestClient({
      ...defaultClientConfig,
      getAccessToken: () => 'unique-access-token'
    }, defaultServerConfig)

    // simple delete

    const deleteFn = restClient.createDeleteFn('/simple-delete')
    rsp = await deleteFn() as unknown as StcRestTest.TestResponse

    expectedRsp = {
      data:  {
        message: 'delete successful'
      },
      meta: {
        url: 'http://fakehost.com:5023/simple-delete',
        method: 'DELETE',
        headers: { authorization: 'Bearer unique-access-token' },
        body: null,
      }
    }
    assertResponse(rsp, expectedRsp)

    // with query params

    restParams = { queryParams: { life: 'bills' } }
    rsp = (await deleteFn({ restParams })) as unknown as StcRestTest.TestResponse

    expectedRsp = {
      data:  {
        message: 'delete successful'
      },
      meta: {
        url: 'http://fakehost.com:5023/simple-delete?life=bills',
        method: 'DELETE',
        headers: { authorization: 'Bearer unique-access-token' },
        body: null,
      }
    }
    assertResponse(rsp, expectedRsp)

    // with path params

    const deleteFnWithPathParams = restClient.createDeleteFn('/simple-delete/:problem')
    restParams = { pathParams: { problem: 'traffic' } }

    rsp = (await deleteFnWithPathParams({ restParams })) as unknown as StcRestTest.TestResponse

    expectedRsp = {
      data: {
        message: 'delete successful'
      },
      meta: {
        url: 'http://fakehost.com:5023/simple-delete/traffic',
        method: 'DELETE',
        headers: { authorization: 'Bearer unique-access-token' },
        body: null,
      }
    }
    assertResponse(rsp, expectedRsp)

    // with query and path params

    restParams = {
      pathParams: { problem: 'poverty' },
      queryParams: { scope: 'global' },
    }

    rsp = (await deleteFnWithPathParams({ restParams })) as unknown as StcRestTest.TestResponse

    expectedRsp = {
      data: {
        message: 'delete successful'
      },
      meta: {
        url: 'http://fakehost.com:5023/simple-delete/poverty?scope=global',
        method: 'DELETE',
        headers: { authorization: 'Bearer unique-access-token' },
        body: null,
      }
    }
    assertResponse(rsp, expectedRsp)
  })

})
