import { AxiosResponse } from 'axios'
import { describe, test, expect, beforeEach } from 'vitest'
import { waitFor } from '@testing-library/react'
import { setupServer } from 'msw/node'

import { handlers, SimpleGetRsp } from './handlers'

import { StcRest } from '../src/restHooksTypes'
import { createRestClient } from '../src/restClient'
import { useRestQuery } from '../src/restQueryHooks.ts'

import { makeReactQueryRenderHook } from './reactQueryRenderHook'


describe('Test Rest Query Hooks', () => {

  const { reactQueryRenderHook, queryClient } = makeReactQueryRenderHook()

  beforeEach(() => {
    queryClient.clear()
  })

  // start the test server
  const server = setupServer(...handlers)
  server.listen()

  const defaultClientConfig: StcRest.ClientConfig = {
    verbose: false,
    getAccessToken: () => 'testing-access-token',
  }

  const defaultServerConfig: StcRest.ServerConfig = {
    defaultBaseUrl: 'http://testhost.com:5555',
    timeout: 1000
  }

  interface EmptyObject {}
  type DataType = SimpleGetRsp
  type DefaultType = EmptyObject

  const restClient = createRestClient(defaultClientConfig, defaultServerConfig)

  const responsePostProcessorFn = (rsp: AxiosResponse) => rsp?.data || rsp
  const restClientAxiosDataOnly = createRestClient(
    { ...defaultClientConfig, responsePostProcessorFn }, defaultServerConfig
  )

  type TestHook = 'simpleGet' | 'getById' | 'getWithPathParams' | 'getWithAxiosDataOnly' | 'getWithNoMeta' | 'getWithNoMetaAxiosData'

  type RenderHookParams = {
    id?: string
    pathParam?: string
    options?: StcRest.UseRestQueryOptions<DefaultType>
  }

  const useQueryRenderHook = (hook?: TestHook, params?: RenderHookParams) => {

    // Defaul simpleGet test hook data
    let path = '/simple-get'
    let restClientSelected = restClient
    let op = 'simpleGet'
    let queryKey: any = ['simple-get']
    let resultsPropName = 'simpleGetResponse'
    let defaultResponse = {}

    // Handle unique cases based on hook type
    switch (hook) {
    case 'getById':
      path = `/simple-get/${params?.id}`
      break 
    case 'getWithPathParams':
      path = `/simple-get/${params?.pathParam}`
      break 
    case 'getWithAxiosDataOnly':
      restClientSelected = restClientAxiosDataOnly
      break   
    case 'getWithNoMeta':
      path = '/simple-get-no-meta'
      queryKey = ['simple-get-no-meta']
      op = 'simpleGetNoMeta'
      resultsPropName = 'simpleGetResponse'
      defaultResponse = {}
      break 
    case 'getWithNoMetaAxiosData':
      path = '/simple-get-no-meta'
      queryKey = ['simple-get-no-meta']
      op = 'simpleGetNoMeta'
      resultsPropName = 'simpleGetResponse'
      defaultResponse = {}
      restClientSelected = restClientAxiosDataOnly
      break  
    default:
      break
    }

    return useRestQuery<DataType, EmptyObject>(
      restClientSelected, 
      queryKey, 
      path, 
      {
        ...params?.options, 
        op, 
        resultsPropName, 
        defaultResponse,
      }
    )
  }
    
  /**
  Helper handler to assert result details.
 */
  const assertResult = async (
    hook: TestHook,
    result: any,
    expectedResult: any
  ) => {
  // Wait for query to succeed
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    const { isError, isLoading, data, meta, simpleGetResponse } = result.current

    // Common checks
    expect(isError).toEqual(false)
    expect(isLoading).toEqual(false)

    // Handle the 'getWithNoMeta' case early to skip unnecessary checks
    if (hook === 'getWithNoMeta') {
      expect(meta).toBeUndefined()
      expect(data?.config?.method).toEqual(expectedResult.method)
      expect(data?.config?.url).toEqual(expectedResult.url)
      expect(simpleGetResponse).toEqual(expectedResult.simpleGetResponse)
      expect(data?.data).toEqual(simpleGetResponse)
      return
    }

    // Meta checks for hooks that expect meta
    if (meta) {
      expect(meta.method).toEqual(expectedResult.method)
      expect(meta.url).toEqual(expectedResult.url)
    }

    // Hook-specific checks
    switch (hook) {
    case 'getWithPathParams':
      expect(meta?.pathParams?.[1]).toContain(expectedResult.pathParam)
      break
      
    case 'getWithAxiosDataOnly':
      expect(data?.data).toEqual(simpleGetResponse)
      expect(data?.meta).toEqual(meta)
      break
      
    case 'getWithNoMetaAxiosData':
      expect(meta).toBeUndefined()
      expect(simpleGetResponse).toEqual({ simpleGet: 'data' })
      expect(data).toEqual(simpleGetResponse)
      break
    
    default:
      break
    }
  }

  test('Basic useRestQuery', async () => {

    const { result } = reactQueryRenderHook(useQueryRenderHook)

    const expectedResult = {
      method: 'GET',
      url: 'http://testhost.com:5555/simple-get',
      simpleGetResponse: { simpleGet: 'data' }
    }
 
    // axios wraps response in `data`, and our default convention wraps result in `data`
    // follow on tests don't neeed to check this, but we will for the first test
    expect(result.current.data?.data?.meta).toEqual(result.current.meta)

    await assertResult('simpleGet', result, expectedResult)
  })

  test('useRestQuery by ID', async () => {

    const { result } = reactQueryRenderHook(()=> useQueryRenderHook('getById', {
      id: '2'
    }))

    const expectedResult = {
      method: 'GET',
      url: 'http://testhost.com:5555/simple-get/2',
      simpleGetResponse: { simpleGet: 'data' }
    }

    await assertResult('getById', result, expectedResult)
  })
 
  test('useRestQuery with rest params', async () => {
    const restParams = {
      pathParams: { genre: 'funk' },
      queryParams: { artist: 'vulfpeck' },
    }
    const { result } = reactQueryRenderHook(() =>  useQueryRenderHook('getWithPathParams', { pathParam: ':genre', options: { restParams }  
    }))

    const expectedResult = {
      method: 'GET',
      url: 'http://testhost.com:5555/simple-get/funk?artist=vulfpeck',
      simpleGetResponse: { simpleGet: 'data' },
      pathParam: '/funk'
    }

    await assertResult('getWithPathParams', result, expectedResult)
  })

  test('useRestQuery baseUrl override', async () => {

    const { result } = reactQueryRenderHook(() =>  useQueryRenderHook('simpleGet', { options: {
      baseUrl: 'http://testhost.com:6666',
    } }))

    const expectedResult = {
      method: 'GET',
      url: 'http://testhost.com:6666/simple-get',
      simpleGetResponse: { simpleGet: 'data' },
    }

    await assertResult('simpleGet', result, expectedResult)
  })

  test('useRestQuery transformFn', async () => {

    const transformFn = (data: any) => {
      return { ...data, addedBy: 'transformFn' }
    }

    const { result } = reactQueryRenderHook(() =>  useQueryRenderHook('simpleGet', {
      options: {
        transformFn,
      }
    }))

    const expectedResult = {
      method: 'GET',
      url: 'http://testhost.com:5555/simple-get',
      simpleGetResponse: { simpleGet: 'data', addedBy: 'transformFn'  },
    }

    await assertResult('simpleGet', result, expectedResult)
  })

  test('useRestQuery with Axios Striped', async () => {
    const { result } = reactQueryRenderHook(() => useQueryRenderHook('getWithAxiosDataOnly'))
    const expectedResult = {
      method: 'GET',
      url: 'http://testhost.com:5555/simple-get',
      simpleGetResponse: { simpleGet: 'data' },
    }

    await assertResult('getWithAxiosDataOnly', result, expectedResult)
  })

  test('useRestQuery with no Meta', async () => {

    const { result } = reactQueryRenderHook(() => useQueryRenderHook('getWithNoMeta'))

    const expectedResult = {
      method: 'get',
      url: '/simple-get-no-meta',
      simpleGetResponse: { simpleGet: 'data' },
    }

    await assertResult('getWithNoMeta', result, expectedResult)
  })

  test('useRestQuery with no Meta and axios stripped', async () => {

    const { result } = reactQueryRenderHook(()=> useQueryRenderHook('getWithNoMetaAxiosData'))
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    const expectedResult = {
      simpleGetResponse: { simpleGet: 'data' },
    }

    await assertResult('getWithNoMetaAxiosData', result, expectedResult)
  })
})
