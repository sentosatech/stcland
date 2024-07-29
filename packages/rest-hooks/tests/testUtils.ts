import { StcRestTest } from './testTypes'

export const extractRequestUrl = (request: StcRestTest.Request): StcRestTest.RequestUrl =>
  request.url.toString()

export const extractRequestMethod = (request: StcRestTest.Request): StcRestTest.RequestMethod =>
  request.method

export const extractRequestBody = async (request: StcRestTest.Request) => {
  if (!request?.body) return null
  const bodyJson = await request.text()
  const bodyObj = JSON.parse(bodyJson)
  return bodyObj
}

export const extractRequestHeaders = (request: StcRestTest.Request) => {
  let headers: StcRestTest.RequestHeaders = {}
  request.headers.forEach((headerValue: string, headerEntry: string) => {
    const headerValueExanded = headerValue.includes(',') ? headerValue.split(',') : headerValue
    headers = { ...headers, [headerEntry]: headerValueExanded }
  })
  return headers
}

export const makeTestResponse = async (
  request: StcRestTest.Request,
  params: StcRestTest.ReqestPathParams,
  cookies: StcRestTest.ReqestCookies,
  data: any,
) : Promise<StcRestTest.TestResponse> => [
  {
    method: extractRequestMethod(request),
    headers: extractRequestHeaders(request),
    url: extractRequestUrl(request),
    pathParams: { ...params },
    cookies: { ...cookies },
    body: await extractRequestBody(request)
  },
  data
]
