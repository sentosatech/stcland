import { jest } from '@jest/globals' // Import jest from @jest/globals
import axios from 'axios'
import { createRestClient, _expandRestPath } from '../restClient'

// Mock axios.create to prevent actual network requests
jest.mock('axios')

describe('createRestClient', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should create a REST client with provided configurations', () => {
    // Mock function for getAccessToken
    const mockGetAccessToken = jest.fn(() => 'fakeAccessToken')

    const clientConfig = {
      verbose: true,
      getAccessToken: mockGetAccessToken, // Use the mock function
    }
    const serverConfig = {
      defaultBaseUrl: 'https://example.com/api',
      timeout: 5000,
    }

    const restClient = createRestClient(clientConfig, serverConfig)

    expect(restClient.clientConfig).toEqual(clientConfig)
    expect(restClient.serverConfig).toEqual(serverConfig)
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: serverConfig.defaultBaseUrl,
      timeout: serverConfig.timeout,
    })
  })

  // Add more tests as needed
})

describe('_expandRestPath', () => {
  it('should expand a REST path with given parameters', () => {
    const restPath = '/v1/spark/appplatforms/:appPlatformId'
    const params = {
      pathParams: { appPlatformId: 22 },
      queryParams: { hydrate: true },
    }

    const expandedPath = _expandRestPath(restPath, params)

    expect(expandedPath).toEqual('/v1/spark/appplatforms/22?hydrate=true')
  })
  it('should return the correct expanded path', () => {
    const restPath = '/v1/spark/appplatforms/:appPlatformId'
    const params = {
      pathParams: { appPlatformId: 22 },
      queryParams: { hydrate: true }
    }
    const expectedOutput = '/v1/spark/appplatforms/22?hydrate=true'

    const result = _expandRestPath(restPath, params)

    expect(result).toEqual(expectedOutput)
  })

  // Add more tests as needed
})
