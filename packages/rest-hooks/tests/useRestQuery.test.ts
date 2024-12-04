import { AxiosResponse } from 'axios'
import { describe, test, expect, beforeEach } from 'vitest'
import { waitFor } from '@testing-library/react'
import { setupServer } from 'msw/node'

import { handlers, SimpleGetRsp } from './handlers'

import { StcRest } from '../src/RestHooksTypes'
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
    getAccessToken: () => 'just-another-token',
  }

  const defaultServerConfig: StcRest.ServerConfig = {
    defaultBaseUrl: 'http://testhost.com:5555',
    timeout: 1000
  }

  interface EmptyObject {}
  type DataType = SimpleGetRsp
  type DefaultType = EmptyObject

  const restClient = createRestClient(defaultClientConfig, defaultServerConfig)

  // create rest client which picks Axios Data before returning to useQueryu
  const responsePostProcessorFn = (rsp: AxiosResponse) => rsp?.data || rsp
  const restClientPickAxiosData = createRestClient(
    { ...defaultClientConfig, responsePostProcessorFn }, defaultServerConfig
  )

  // 3 layers of data wrappers: useQuery, axios, and our default BE convention of { data, meta }
  const pickResultsThreeDeep = (rsp: any) => rsp?.data?.data?.data
  const pickMetaThreeDeep = (rsp: any) => rsp?.data?.data?.meta

  // responsePostProcessorFn from restClientPickAxiosData removes the outer layer of the axios data wrapper
  const pickResultsTwoDeep = (rsp: any) => rsp?.data?.data
  const pickMetaTwoDeep = (rsp: any) => rsp?.data?.meta


  // Helper assert hook result.
  const assertResult = async (
    result: any,
    expectedResult: any,
    log: boolean = false
  ) => {

    // Wait for query to succeed
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    const { isError, isLoading, data, meta, simpleGetResponse } = result.current

    if (log) {
      console.log('useQueryResponse.simpleGetResponse: ', simpleGetResponse)
      console.log('expectedResult.simpleGetResponse: ', expectedResult.simpleGetResponse)
      console.log('expectedResult.meta', expectedResult.meta, '\n')
      console.log('useQueryResponse.meta', meta, '\n')
      console.log('useQueryResult.data', data)
    }

    expect(isError).toEqual(false)
    expect(isLoading).toEqual(false)


    if (expectedResult.meta) {
      const restCallInputs = meta
      const { meta: expectedRestCallInputs } = expectedResult
      expect(restCallInputs?.url).toEqual(expectedRestCallInputs?.url)
      expect(restCallInputs?.method).toEqual(expectedRestCallInputs?.method)
      expect(restCallInputs?.headers.authorization).toEqual(expectedRestCallInputs?.headers.authorization)
    }
    else
      expect(meta).toBeUndefined()

    expect(simpleGetResponse).toEqual(expectedResult.simpleGetResponse)
  }

  // used by multiple tests
  const useGetSimple = (options?: Partial<StcRest.UseRestQueryOptions<DefaultType>>) => {
    const path = '/simple-get'
    const queryKey: any = ['simple-get']
    const op = 'simpleGet'
    const resultsPropName = 'simpleGetResponse'
    const defaultResponse = {}
    return useRestQuery<DataType, EmptyObject>(
      restClient, queryKey, path, {
        ...options, op,
        pickResults: pickResultsThreeDeep,
        pickMeta: pickMetaThreeDeep,
        resultsPropName, defaultResponse
      }
    )
  }

  test('Basic useRestQuery', async () => {

    const { result } = reactQueryRenderHook(() => useGetSimple())

    const expectedResult = {
      simpleGetResponse: { simpleGet: 'data' },
      meta: {
        method: 'GET',
        url: 'http://testhost.com:5555/simple-get',
        headers: { authorization: 'Bearer just-another-token' },
      }
    }
    await assertResult(result, expectedResult)
  })

  test('useRestQuery by ID', async () => {

    const useGetSimpleById = (id: string, options?: Partial<StcRest.UseRestQueryOptions<DefaultType>>) => {
      const path = `/simple-get/${id}`
      const queryKey: any = ['simple-get']
      const op = 'simpleGet'
      const resultsPropName = 'simpleGetResponse'
      const defaultResponse = {}
      return useRestQuery<DataType, EmptyObject>(
        restClient, queryKey, path, {
          ...options, op,
          pickResults: pickResultsThreeDeep,
          pickMeta: pickMetaThreeDeep,
          resultsPropName, defaultResponse
        }
      )
    }

    const { result } = reactQueryRenderHook(()=> useGetSimpleById('2'))

    const expectedResult = {
      simpleGetResponse: { simpleGet: 'data' },
      meta: {
        method: 'GET',
        url: 'http://testhost.com:5555/simple-get/2',
        headers: { authorization: 'Bearer just-another-token' },
      }
    }

    await assertResult(result, expectedResult)
  })


  test('useRestQuery with rest params', async () => {

    const useGetSimpleWithParams = (options?: Partial<StcRest.UseRestQueryOptions<DefaultType>>) => {
      const path = '/simple-get/:param'
      const queryKey: any = ['simple-get']
      const op = 'simpleGet'
      const resultsPropName = 'simpleGetResponse'
      const defaultResponse = {}
      return useRestQuery<DataType, EmptyObject>(
        restClient, queryKey, path, {
          ...options, op,
          pickResults: pickResultsThreeDeep,
          pickMeta: pickMetaThreeDeep,
          resultsPropName, defaultResponse
        }
      )
    }

    const pathParams = { param: 'funk' }
    const queryParams = { artist: 'vulfpeck' }

    const { result } = reactQueryRenderHook(() =>  useGetSimpleWithParams({
      pathParams, queryParams
    }))

    const expectedResult = {
      simpleGetResponse: { simpleGet: 'data' },
      meta: {
        method: 'GET',
        url: 'http://testhost.com:5555/simple-get/funk?artist=vulfpeck',
        headers: { authorization: 'Bearer just-another-token' },
      }
    }

    await assertResult(result, expectedResult)
  })

  test('useRestQuery baseUrl override', async () => {

    const { result } = reactQueryRenderHook(() =>  useGetSimple({
      baseUrl: 'http://testhost.com:6666',
    }))

    const expectedResult = {
      simpleGetResponse: { simpleGet: 'data' },
      meta: {
        method: 'GET',
        url: 'http://testhost.com:6666/simple-get',
        headers: { authorization: 'Bearer just-another-token' },
      }
    }

    await assertResult(result, expectedResult)
  })

  test('useRestQuery transformResult', async () => {

    const transformResult = (data: any) => {
      return { ...data, addedBy: 'transformResult' }
    }

    const { result } = reactQueryRenderHook(() =>  useGetSimple( { transformResult }))

    const expectedResult = {
      simpleGetResponse: { simpleGet: 'data', addedBy: 'transformResult'  },
      meta: {
        method: 'GET',
        url: 'http://testhost.com:5555/simple-get',
        headers: { authorization: 'Bearer just-another-token' },
      }
    }

    await assertResult(result, expectedResult)
  })

  test('useRestQuery with Axios Striped', async () => {

    const useGetSimpleAxiosDataOnly = (options?: Partial<StcRest.UseRestQueryOptions<DefaultType>>) => {
      const path = '/simple-get'
      const queryKey: any = ['simple-get']
      const op = 'simpleGet'
      const resultsPropName = 'simpleGetResponse'
      const defaultResponse = {}
      return useRestQuery<DataType, EmptyObject>(
        restClientPickAxiosData, queryKey, path, {
          ...options, op,
          pickResults: pickResultsTwoDeep,
          pickMeta: pickMetaTwoDeep,
          resultsPropName, defaultResponse
        }
      )
    }

    const { result } = reactQueryRenderHook(() => useGetSimpleAxiosDataOnly())

    const expectedResult = {
      simpleGetResponse: { simpleGet: 'data' },
      meta: {
        method: 'GET',
        url: 'http://testhost.com:5555/simple-get',
        headers: { authorization: 'Bearer just-another-token' },
      }
    }

    await assertResult(result, expectedResult)
  })

  test('useRestQuery with no Meta', async () => {

    const useGetSimpleNoMeta = (options?: Partial<StcRest.UseRestQueryOptions<DefaultType>>) => {
      const path = '/simple-get-no-meta'
      const queryKey: any = ['simple-get-no-meta']
      const op = 'simpleGetNoMeta'
      const resultsPropName = 'simpleGetResponse'
      const defaultResponse = {}
      return useRestQuery<DataType, EmptyObject>(
        restClient, queryKey, path, {
          ...options,
          pickResults: pickResultsTwoDeep,
          // no meta to pick
          op, resultsPropName, defaultResponse
        }
      )
    }

    const { result } = reactQueryRenderHook(() => useGetSimpleNoMeta())

    const expectedResult = {
      simpleGetResponse: { simpleGet: 'data' },
    }

    await assertResult( result, expectedResult)

    // Because we have no meta, we check the rest inputs from axios info on data
    const restConfig = result.current.data.config
    expect(restConfig.method).toEqual('get')
    expect(restConfig.url).toEqual('/simple-get-no-meta')
    expect(restConfig.headers.Authorization).toEqual('Bearer just-another-token')
  })

  test('useRestQuery with no Meta and axios stripped', async () => {

    const useGetSimpleNoMetaAxiosDataOnly = (options?: Partial<StcRest.UseRestQueryOptions<DefaultType>>) => {
      const path = '/simple-get-no-meta'
      const queryKey: any = ['simple-get-no-meta']
      const op = 'simpleGetNoMeta'
      const resultsPropName = 'simpleGetResponse'
      const defaultResponse = {}
      return useRestQuery<DataType, EmptyObject>(
        restClientPickAxiosData, queryKey, path, {
          ...options,
          // using default pickResults, returns data directly
          // no meta to pick
          op, resultsPropName, defaultResponse
        }
      )
    }

    const { result } = reactQueryRenderHook(useGetSimpleNoMetaAxiosDataOnly)

    const expectedResult = {
      simpleGetResponse: { simpleGet: 'data' },
    }

    await assertResult(result, expectedResult)

    // we have no way to check the rest inputs
  })
})
