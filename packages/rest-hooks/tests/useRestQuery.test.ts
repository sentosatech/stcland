import { AxiosResponse } from 'axios'
import { describe, test, expect } from 'vitest'
import { waitFor } from '@testing-library/react'
import { setupServer } from 'msw/node'

import { handlers } from './handlers'

import { StcRest } from '../src/restHooksTypes'
import { createRestClient } from '../src/restClient'
import { useRestQuery } from '../src/restQueryHooks.ts'

import { makeReactQueryRenderHook } from './reactQueryRenderHook'
import { StcRestTest } from './testTypes.ts'


describe('Test Rest Query Hooks', () => {

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
    defaultBaseUrl: 'http://testhost.com:5555',
    timeout: 1000
  }

  const reactQueryRenderHook = makeReactQueryRenderHook()

  test('useQuery basic functionality', async () => {

    expect(true).toBeTruthy()

    const restClient = createRestClient(defaultClientConfig, defaultServerConfig)
    const { result } = reactQueryRenderHook(() => useRestQuery(
      restClient,
      ['testQueryKey'],
      '/simple-get', {
        op: 'testing useRestQuery',
        resultsPropName: 'simpleGetResponse',
      }))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // console.log('result.current.data: ', result.current.data)
    console.log('result.current.simpleGetResponse: ', result.current.simpleGetResponse)

    // console.log('result', JSON.stringify(result, null, 2))

    // const { isError, isLoading, data, simpleGetReponse } = result.current
    // expect(isError).toEqual(false)
    // expect(isLoading).toEqual(false)

    // expect(data).not.toBeUndefined()
    // expect(result.current).not.toBeUndefined()

    // console.log('result.current: ', result.current.simpleGetResponse)

    // console.log('simpleGetReponse: ', simpleGetReponse)

    // let requestInfo: StcRestTest.RequestInfo
    // let responseBody: StcRestTest.ResponseBody

    // const a = simpleGetReponse as StcRestTest.TestResponse

    // [ requestInfo, responseBody ] = a

    // expect(requestInfo?.method).toEqual('GET')
    // expect(requestInfo?.url).toEqual('http://testhost.com:5555/simple-get')
    // expect(responseBody).toEqual({ simpleGet: 'data' })

    // requestInfo = null
    // responseBody = null

  })
})
