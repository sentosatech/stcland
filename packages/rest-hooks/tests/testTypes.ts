import { DefaultBodyType, StrictRequest, HttpResponse, PathParams } from 'msw'

export namespace StcRestTest {
  export type Request<
      BodyType extends DefaultBodyType = DefaultBodyType
    > = StrictRequest<BodyType>

    export type Response = HttpResponse
    export type ResponseBody = any

    export type RequestUrl = string
    export type RequestMethod = string
    export type RequestPathParams = PathParams
    export type RequestCookies = Record<string, string>
    export interface RequestHeaders {[key: string]: string | string[]}
    export type RequestBody = any

    export type RequestInfo = {
      method: RequestMethod
      headers: RequestHeaders
      url: RequestUrl
      pathParams: RequestPathParams
      cookies: RequestCookies
      body: RequestBody
    } | null

  export type TestResponse = [
    RequestInfo,
    ResponseBody
  ]
}
