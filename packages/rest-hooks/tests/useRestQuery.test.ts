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
    
    // Helper assert hook result.
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

    const useGetSimple = (options?: StcRest.UseRestQueryOptions<DefaultType>) => {
      const path = '/simple-get'
      const queryKey: any = ['simple-get']
      const op = 'simpleGet'
      const resultsPropName = 'simpleGetResponse'
      const defaultResponse = {}
      return useRestQuery<DataType, EmptyObject>(
        restClient, queryKey, path, {
          ...options, op, resultsPropName, defaultResponse
        }
      )
    }
  

    test('Basic useRestQuery', async () => {

      const { result } = reactQueryRenderHook(useGetSimple)

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

    const useGetSimpleById = (id: string, options?: StcRest.UseRestQueryOptions<DefaultType>) => {
      const path = `/simple-get/${id}`
      const queryKey: any = ['simple-get']
      const op = 'simpleGet'
      const resultsPropName = 'simpleGetResponse'
      const defaultResponse = {}
      return useRestQuery<DataType, EmptyObject>(
        restClient, queryKey, path, {
          ...options, op, resultsPropName, defaultResponse
        }
      )
    }

    test('useRestQuery by ID', async () => {

      const { result } = reactQueryRenderHook(()=> useGetSimpleById('2'))

      const expectedResult = {
        method: 'GET',
        url: 'http://testhost.com:5555/simple-get/2',
        simpleGetResponse: { simpleGet: 'data' }
      }

      await assertResult('getById', result, expectedResult)
    })

    const useGetWithParams = (options?: StcRest.UseRestQueryOptions<DefaultType>) => {
      const path = '/simple-get/:param'
      const queryKey: any = ['simple-get']
      const op = 'simpleGet'
      const resultsPropName = 'simpleGetResponse'
      const defaultResponse = {}
      return useRestQuery<DataType, EmptyObject>(
        restClient, queryKey, path, {
          ...options, op, resultsPropName, defaultResponse
        }
      )
    }
 

    test('useRestQuery with rest params', async () => {
      const restParams = {
        // pathParam key must match dynamic segment in useGetWithParams.
        pathParams: { param: 'funk' },
        queryParams: { artist: 'vulfpeck' },
      }

      const { result } = reactQueryRenderHook(() =>  useGetWithParams({ restParams }))

      const expectedResult = {
        method: 'GET',
        url: 'http://testhost.com:5555/simple-get/funk?artist=vulfpeck',
        simpleGetResponse: { simpleGet: 'data' },
        pathParam: '/funk'
      }

      await assertResult('getWithPathParams', result, expectedResult)
    })

    test('useRestQuery baseUrl override', async () => {

      const { result } = reactQueryRenderHook(() =>  useGetSimple({
        baseUrl: 'http://testhost.com:6666',
      }))

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

      const { result } = reactQueryRenderHook(() =>  useGetSimple( { transformFn }))

      const expectedResult = {
        method: 'GET',
        url: 'http://testhost.com:5555/simple-get',
        simpleGetResponse: { simpleGet: 'data', addedBy: 'transformFn'  },
      }

      await assertResult('simpleGet', result, expectedResult)
    })

    const useGetSimpleAxiosDataOnly = (options?: StcRest.UseRestQueryOptions<DefaultType>) => {
      const path = '/simple-get'
      const queryKey: any = ['simple-get']
      const op = 'simpleGet'
      const resultsPropName = 'simpleGetResponse'
      const defaultResponse = {}
      return useRestQuery<DataType, EmptyObject>(
        restClientAxiosDataOnly, queryKey, path, {
          ...options, op, resultsPropName, defaultResponse
        }
      )
    }


    test('useRestQuery with Axios Striped', async () => {
      const { result } = reactQueryRenderHook(useGetSimpleAxiosDataOnly)
      const expectedResult = {
        method: 'GET',
        url: 'http://testhost.com:5555/simple-get',
        simpleGetResponse: { simpleGet: 'data' },
      }

      await assertResult('getWithAxiosDataOnly', result, expectedResult)
    })

    const useGetSimpleNoMeta = (options?: StcRest.UseRestQueryOptions<DefaultType>) => {
      const path = '/simple-get-no-meta'
      const queryKey: any = ['simple-get-no-meta']
      const op = 'simpleGetNoMeta'
      const resultsPropName = 'simpleGetResponse'
      const defaultResponse = {}
      return useRestQuery<DataType, EmptyObject>(
        restClient, queryKey, path, {
          ...options, op, resultsPropName, defaultResponse
        }
      )
    }

    test('useRestQuery with no Meta', async () => {

      const { result } = reactQueryRenderHook(useGetSimpleNoMeta)

      const expectedResult = {
        method: 'get',
        url: '/simple-get-no-meta',
        simpleGetResponse: { simpleGet: 'data' },
      }

      await assertResult('getWithNoMeta', result, expectedResult)
    })

    const useGetSimpleNoMetaAxiosDataOnly = (options?: StcRest.UseRestQueryOptions<DefaultType>) => {
      const path = '/simple-get-no-meta'
      const queryKey: any = ['simple-get-no-meta']
      const op = 'simpleGetNoMeta'
      const resultsPropName = 'simpleGetResponse'
      const defaultResponse = {}
      return useRestQuery<DataType, EmptyObject>(
        restClientAxiosDataOnly, queryKey, path, {
          ...options, op, resultsPropName, defaultResponse
        }
      )
    }

    test('useRestQuery with no Meta and axios stripped', async () => {

      const { result } = reactQueryRenderHook(useGetSimpleNoMetaAxiosDataOnly)
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      const expectedResult = {
        simpleGetResponse: { simpleGet: 'data' },
      }

      await assertResult('getWithNoMetaAxiosData', result, expectedResult)
    })
})
