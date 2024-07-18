import { http, HttpResponse } from 'msw'
import { STC } from './testTypes'
import { extractRequestHeaders, extractRequestBody, extractRequestMethod, extractRequestUrl, makeTestResponse } from './testUtils'

//   const extractRequestHeaders = (request: any) => {

//   let headers: STC.RestRequestHeaders = {}
//   request.headers.forEach((headerValue: string, headerEntry: string) => {
//     const headerValueExanded = headerValue.includes(',') ? headerValue.split(',') : headerValue
//     headers = { ...headers, [headerEntry]: headerValueExanded }
//   })

//   return headers
// }

export const handlers = [

// Very generic get function to allow for flexible testing
http.get('*/simple-get*', ({ request, params, cookies }) => {
  const testestResponse = makeTestResponse(request, { simpleGet: 'data' })
  const testRsp = {
    reqInfo: {
      url: extractRequestUrl(request),
      method: extractRequestMethod(request),
      headers: extractRequestHeaders(request),
      body: extractRequestBody(request),
      params: { ...params },
    },
    data: {
      simpleGet: "data"
    }
  }

    return HttpResponse.json(testestResponse)
  }),
]
