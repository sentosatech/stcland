import { jest } from '@jest/globals' 
import axios from 'axios'
import { createRestClient, _expandRestPath } from '../restClient'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>
import { RestClient } from '../restClientTypes'


describe('createRestClient', () => {

  const mockGetAccessToken = jest.fn(() => 'fakeAccessToken')

  const clientConfig = {
    verbose: true,
    getAccessToken: mockGetAccessToken, 
  }
  const serverConfig = {
    defaultBaseUrl: 'https://example.com/api',
    timeout: 5000,
  }
  let restClient: RestClient

  beforeEach(() => {
    restClient = createRestClient(clientConfig, serverConfig)
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should create a REST client with provided configurations', () => {
    const mockGetAccessToken = jest.fn(() => 'fakeAccessToken')

    const clientConfig = {
      verbose: true,
      getAccessToken: mockGetAccessToken,
    }
    const serverConfig = {
      defaultBaseUrl: 'https://example.com/api',
      timeout: 5000,
    }
    expect(restClient.clientConfig).toEqual(clientConfig)
    expect(restClient.serverConfig).toEqual(serverConfig)
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: serverConfig.defaultBaseUrl,
      timeout: serverConfig.timeout,
    })
  })
  describe('GET request', () => {
    it('should make a GET request with provided configurations', async () => {
      let response
      if (restClient.get) {
        response = await restClient.get('/test')
      }
      if (response) expect(response.status).toEqual(200)
    })
  })

  describe('POST request', () => {

    it('should make a POST request with provided configurations', async () => {
      const postData = { key: 'value' };
      (restClient.axiosClient.post as jest.Mock).mockResolvedValueOnce({ data: postData } as never)
      let response
      if (restClient.post) {
        response = await restClient.post('/example', postData)
      }
      expect(restClient.axiosClient.post).toHaveBeenCalledWith('/example', postData, undefined)
      expect(response).toEqual(postData)

    })
  })

  describe('PUT request', () => {
    it('should send a PUT request with correct data', async () => {
      const path = '/example/path'
      const data = { id: 1, name: 'Example' }
      mockedAxios.put.mockResolvedValueOnce({ data })
      let response
      if (restClient.put) {
        response = await restClient.put(path, data)
      }
      expect(mockedAxios.put).toHaveBeenCalledWith(path, data)
      expect(response).toEqual(data)
    })
  })

  describe('PATCH request', () => {
    it('should send a PATCH request with correct data', async () => {
      const path = '/example/path'
      const data = { id: 1, name: 'Updated Example' }

      mockedAxios.patch.mockResolvedValueOnce({ data })
      let response
      if (restClient.patch) {
        response = await restClient.patch(path, data)
      }
      expect(mockedAxios.patch).toHaveBeenCalledWith(path, data)
      expect(response).toEqual(data)
    })
  })

  describe('DELETE request', () => {
    it('should send a DELETE request', async () => {
      const path = '/example/path'

      mockedAxios.delete.mockResolvedValueOnce({})
      let response
      if (restClient.delete) {
        response = await restClient.delete(path)
      }
      expect(mockedAxios.delete).toHaveBeenCalledWith(path)
      expect(response).toEqual({})
    })
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