import { STC } from './testTypes'

export const extractRequestUrl = (request: STC.Rest.Request): STC.Rest.RequestUrl =>
    request.url.toString()

export const extractRequestMethod = (request: STC.Rest.Request): STC.Rest.RequestMethod =>
  request.method

export const extractRequestBody = (request: STC.Rest.Request) => ({ ...request.body })


export const extractRequestHeaders = (request: STC.Rest.Request) => {
  let headers: STC.Rest.RequestHeaders = {}
  request.headers.forEach((headerValue: string, headerEntry: string) => {
    const headerValueExanded = headerValue.includes(',') ? headerValue.split(',') : headerValue
    headers = { ...headers, [headerEntry]: headerValueExanded }
  })
  return headers
}

export const makeTestResponse = (
  request: STC.Rest.Request,
  data: any,
) : STC.TestResponse => {
  return [
    {
      url: extractRequestUrl(request),
      method: extractRequestMethod(request),
      headers: extractRequestHeaders(request),
      body: extractRequestBody(request),
    },
    data
  ]
}
