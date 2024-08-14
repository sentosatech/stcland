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


  test('Basic useRestQuery', async () => {

    const { result } = reactQueryRenderHook(() => useGetSimple())
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    const { isError, isLoading, data, meta, simpleGetResponse } = result.current

    expect(isError).toEqual(false)
    expect(isLoading).toEqual(false)

    expect(meta?.method).toEqual('GET')
    expect(meta?.url).toEqual('http://testhost.com:5555/simple-get')

    expect(simpleGetResponse).toEqual({ simpleGet: 'data' })

    // axios wraps response in `data`, and our default convention wraps result in `data`
    // follow on tests don't neeed to check this, but we will for the first test
    expect(data?.data?.data).toEqual(simpleGetResponse)
    expect(data?.data?.meta).toEqual(meta)
  })

  test.skip('useRestQuery by ID', async () => {
    // useGetSimpleById
  })

  test.skip('useRestQuery with rest params', async () => {})
  test.skip('useRestQuery baseUrl override', async () => {})
  test.skip('useRestQuery transformFn', async () => {})

  test('useRestQuery with Axios Striped', async () => {

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

    const { result } = reactQueryRenderHook(() => useGetSimpleAxiosDataOnly())
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    const { isError, isLoading, data, meta, simpleGetResponse } = result.current

    expect(isError).toEqual(false)
    expect(isLoading).toEqual(false)

    expect(meta?.method).toEqual('GET')
    expect(meta?.url).toEqual('http://testhost.com:5555/simple-get')

    expect(simpleGetResponse).toEqual({ simpleGet: 'data' })
    expect(data?.data).toEqual(simpleGetResponse)
    expect(data?.meta).toEqual(meta)
  })

  test('useRestQuery with no Meta', async () => {

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

    const { result } = reactQueryRenderHook(() => useGetSimpleNoMeta())
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    const { isError, isLoading, data, meta, simpleGetResponse } = result.current

    expect(isError).toEqual(false)
    expect(isLoading).toEqual(false)
    expect(meta).toEqual(undefined)

    // since no meta, we will rely on full axios response
    expect(data?.config?.method).toEqual('get')
    expect(data?.config?.url).toEqual('/simple-get-no-meta')

    expect(simpleGetResponse).toEqual({ simpleGet: 'data' })
    expect(data?.data).toEqual(simpleGetResponse)
  })

  test('useRestQuery with no Meta and axios stripped', async () => {

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

    const { result } = reactQueryRenderHook(() => useGetSimpleNoMetaAxiosDataOnly())
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    const { isError, isLoading, data, meta, simpleGetResponse } = result.current

    expect(isError).toEqual(false)
    expect(isLoading).toEqual(false)
    expect(meta).toEqual(undefined)

    // we have no way to check rest inputs in this case

    expect(simpleGetResponse).toEqual({ simpleGet: 'data' })
    expect(data).toEqual(simpleGetResponse)
  })
})
