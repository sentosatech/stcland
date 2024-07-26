import { AxiosResponse } from 'axios'
import { describe, test, expect } from '@jest/globals'
import { setupServer } from 'msw/node'
// import { renderHook, act } from '@testing-library/react-hooks';

import { handlers } from './handlers'

import { StcRest} from '../src/restHooksTypes'
import { StcRestTest} from './testTypes'
import { createRestClient } from '../src/restClient'
import { useRestQuery } from '../src/restQueryHooks.ts'

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


  test('useQuery basic functionality', () => {

    // const restClient = createRestClient(defaultClientConfig, defaultServerConfig)
    // const { result } = renderHook(() => useRestQuery(
    //   restClient,
    //   'testQueryKey',
    //   '/simple-get', {
    //     op: 'testing useRestQuery',
    //     resultsPropName: 'simpleGet',
    //   }))
    //   console.log('result: ', result)
  })
})
