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
  let data: any
  let restParams: StcRest.RestParams

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
    data = { species: 'dog', breed: 'lab' }
    rsp = await postFn({data}) as unknown as StcRestTest.TestResponse;

    [ requestInfo, responseBody ] = rsp

    expect(requestInfo?.url).toEqual('http://fakehost.com:5023/simple-post')
    expect(requestInfo?.method).toEqual('POST')
    expect(requestInfo?.headers.authorization).toEqual('Bearer another-access-token')
    expect(requestInfo?.body).toEqual(data)
    expect(responseBody).toEqual({ message: 'post succesful' })

    // with query params

    data = { species: 'cat', breed: 'siamese' }
    restParams = { queryParams: { pureBread: true, age: 3 } }
    rsp = await postFn({data, restParams}) as unknown as StcRestTest.TestResponse;

    [ requestInfo, responseBody ] = rsp

    expect(requestInfo?.url).toEqual('http://fakehost.com:5023/simple-post?pureBread=true&age=3')
    expect(requestInfo?.method).toEqual('POST')
    expect(requestInfo?.headers.authorization).toEqual('Bearer another-access-token')
    expect(requestInfo?.body).toEqual(data)
    expect(responseBody).toEqual({ message: 'post succesful' })

    // with path params

    const postFnWithPathParams = restClient.createPostFn('/simple-post/:species')
    data = { breed: 'golden', name: 'kona' }
    restParams = { pathParams: { species: 'dog' } }


    rsp = await postFnWithPathParams({data, restParams}) as unknown as StcRestTest.TestResponse;

    [ requestInfo, responseBody ] = rsp

    expect(requestInfo?.url).toEqual('http://fakehost.com:5023/simple-post/dog')
    expect(requestInfo?.method).toEqual('POST')
    expect(requestInfo?.headers.authorization).toEqual('Bearer another-access-token')
    expect(requestInfo?.body).toEqual(data)
    expect(responseBody).toEqual({ message: 'post succesful' })

    // with query and path params

    data = { breed: 'rattler', name: 'snuggles' }
    restParams = {
      pathParams: { species: 'snake' },
      queryParams: { region: 'rockies' }
    }
    rsp = await postFnWithPathParams(
      {data, restParams}) as unknown as StcRestTest.TestResponse;

    [ requestInfo, responseBody ] = rsp

    expect(requestInfo?.url).toEqual('http://fakehost.com:5023/simple-post/snake?region=rockies')
    expect(requestInfo?.method).toEqual('POST')
    expect(requestInfo?.headers.authorization).toEqual('Bearer another-access-token')
    expect(requestInfo?.body).toEqual(data)
    expect(responseBody).toEqual({ message: 'post succesful' })
  })

  test('Test Straight Put', async () => {
    const restClient = createRestClient(
      defaultClientConfig,
      defaultServerConfig
    );
    const putData = { songs: ['Graves', 'Fade Away', 'Anything Can Happen In The Next Half Hour']};
    rsp = (await restClient.put(
      '/simple-put/user/favorite-songs',
      putData
    )) as unknown as StcRestTest.TestResponse;

    [requestInfo, responseBody] = rsp;

    expect(requestInfo?.url).toEqual(
      'http://fakehost.com:5023/simple-put/user/favorite-songs'
    );
    expect(requestInfo?.method).toEqual('PUT');
    expect(requestInfo?.headers.authorization).toEqual(
      'Bearer testing-access-token'
    );
    expect(requestInfo?.body).toEqual(putData);
    expect(responseBody).toEqual({ message: 'put succesful' });
  });

  test('Test PutFn', async () => {
    
    const restClient = createRestClient({
      ...defaultClientConfig,
      getAccessToken: () => 'another-access-token'
    }, defaultServerConfig)

    // simple put

    const putFn = restClient.createPutFn('/simple-put')
    data = { songName: 'Graves' }
    rsp = await putFn({data}) as unknown as StcRestTest.TestResponse;

    [ requestInfo, responseBody ] = rsp

    expect(requestInfo?.url).toEqual('http://fakehost.com:5023/simple-put')
    expect(requestInfo?.method).toEqual('PUT')
    expect(requestInfo?.headers.authorization).toEqual('Bearer another-access-token')
    expect(requestInfo?.body).toEqual(data)
    expect(responseBody).toEqual({ message: 'put succesful' })

  // with query params

   data = { songName: 'Lost' };
   const restParams = { queryParams: { genre: 'metal'} };
   rsp = (await putFn({ data, restParams })) as unknown as StcRestTest.TestResponse;

   [requestInfo, responseBody] = rsp;

    expect(requestInfo?.url).toEqual(
    'http://fakehost.com:5023/simple-put?genre=metal');
    expect(requestInfo?.method).toEqual('PUT')
    expect(requestInfo?.headers.authorization).toEqual('Bearer another-access-token')
    expect(requestInfo?.body).toEqual(data)
    expect(responseBody).toEqual({ message: 'put succesful' })

  // with path params

   const putFnWithPathParams = restClient.createPutFn('/simple-put/:id');
   data = { songName: 'Songs for No One'};
   const pathParams = { id: '123' };

   rsp = (await putFnWithPathParams({ data, restParams: { pathParams } })) as unknown as StcRestTest.TestResponse;

   [requestInfo, responseBody] = rsp;

   expect(requestInfo?.url).toEqual('http://fakehost.com:5023/simple-put/123');
   expect(requestInfo?.method).toEqual('PUT')
   expect(requestInfo?.headers.authorization).toEqual('Bearer another-access-token')
   expect(requestInfo?.body).toEqual(data)
   expect(responseBody).toEqual({ message: 'put succesful' })

  // with query and path params

  data = { songName: 'Capulet' };
  const combinedRestParams = {
    pathParams: { id:'666' },
    queryParams: { genre: 'ballad' },
  };

  rsp = (await putFnWithPathParams({ data, restParams: combinedRestParams })) as unknown as StcRestTest.TestResponse;

  [requestInfo, responseBody] = rsp;
  
   expect(requestInfo?.url).toEqual('http://fakehost.com:5023/simple-put/666?genre=ballad');
   expect(requestInfo?.method).toEqual('PUT')
   expect(requestInfo?.headers.authorization).toEqual('Bearer another-access-token')
   expect(requestInfo?.body).toEqual(data)
   expect(responseBody).toEqual({ message: 'put succesful' })

  });

  test.skip('Test Straight Patch', async () => {})
  test.skip('Test PatchFn', async () => {})

  test.skip('Test Straight Delete', async () => {})
  test.skip('Test DeleteFn', async () => {})

})
