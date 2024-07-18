import { DefaultBodyType, StrictRequest, HttpResponse } from 'msw';

export namespace STC {

  export namespace Rest {

    export type Request<
      BodyType extends DefaultBodyType = DefaultBodyType
    > = StrictRequest<BodyType>

    export type Response = HttpResponse
    export type ResponseBody = any

    export type RequestUrl = string
    export type RequestMethod = string
    export type RequestBody = any
    export interface RequestHeaders {
      [key: string]: string | string[]
    }

    export type RequestInfo = {
      url: RequestUrl
      method: RequestMethod
      headers: RequestHeaders
      body: RequestBody
    } | null
  }

  export type TestResponse = [
    STC.Rest.RequestInfo,
    STC.Rest.ResponseBody
  ]
}
