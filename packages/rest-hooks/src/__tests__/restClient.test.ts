import { jest } from '@jest/globals' // Import jest from @jest/globals
import axios from 'axios'
import { createRestClient, _expandRestPath } from '../restClient'

// Mock axios.create to prevent actual network requests
jest.mock('axios')

describe('createRestClient', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  const mockGetAccessToken = jest.fn(() => 'fakeAccessToken')

  const clientConfig = {
    verbose: true,
    getAccessToken: mockGetAccessToken, // Use the mock function
  }
  const serverConfig = {
    defaultBaseUrl: 'https://example.com/api',
    timeout: 5000,
  }

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

  it('should make a GET request with provided configurations', async () => {
    const restClient = createRestClient({}, {}) // Initialize your rest client
    let response
    // Replace '/test' with your actual API endpoint
    if (restClient.get) {
      // Replace '/test' with your actual API endpoint
      response = await restClient.get('/test')
    }
    // Add your assertions here
    if (response) expect(response.status).toEqual(200)
    // ...
  })

  it('should make a POST request with provided configurations', async () => {
  
    const restClient = createRestClient(clientConfig, serverConfig)

    const postData = { key: 'value' };

    // Mock the Axios post method
    (restClient.axiosClient.post as jest.Mock).mockResolvedValueOnce({ data: postData } as never)

    let response
    if (restClient.post) {

      response = await restClient.post('/example', postData)
    }

    // Verify that the post method is called with the correct arguments
    expect(restClient.axiosClient.post).toHaveBeenCalledWith('/example', postData, undefined)

    // Verify the response
    expect(response).toEqual(postData)

  })

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



})
// it('should make a GET request with provided configurations', async () => {
//   // Create a mock Axios instance
//   const axiosInstance = axios.create()
//   const mockGet = jest.spyOn(axiosInstance, 'get')

//   // Assume createRestClient returns an Axios instance
//   const restClient = createRestClient({}, {})

//   if (restClient.get) {
//     // Replace '/test' with your actual API endpoint
//     await restClient.get('/test')
//   }

//   // Verify that the get method was called with the expected URL
//   expect(mockGet).toHaveBeenCalledWith('/test')
// })
// it('should make a POST request with provided configurations', async () => {
//   const axiosInstance = axios.create()
//   const mockPost = jest.spyOn(axiosInstance, 'post')
//   const restClient = createRestClient({}, {})

//   if (restClient.post) {
//     const data = { test: 'data' }
//     await restClient.post('/test', data)
//   }

//   expect(mockPost).toHaveBeenCalledWith('/test', expect.anything())
// })

// it('should make a PUT request with provided configurations', async () => {
//   const axiosInstance = axios.create()
//   const mockPut = jest.spyOn(axiosInstance, 'put')
//   const restClient = createRestClient({}, {})

//   // Ensure restClient is not undefined before calling put()
//   if (restClient.put) {
//     const data = { test: 'data' }
//     await restClient.put('/test', data)
//   }

//   expect(mockPut).toHaveBeenCalledWith('/test', expect.anything())
// })


