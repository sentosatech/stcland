import { http, HttpResponse } from 'msw'
import { makeTestResponse } from './testUtils'

export interface SimpleGetRsp { simpleGet: string }

export const handlers = [

  // Generic get hanlder no meta data
  http.get('*/simple-get-no-meta', async ({ request, params, cookies }) => {
    const rsp = { simpleGet: 'data' }
    return HttpResponse.json(rsp)
  }),

  // Generic get hanlder with meta data
  http.get('*/simple-get*', async ({ request, params, cookies }) => {
    const rsp = await makeTestResponse(request, params, cookies, { simpleGet: 'data' })
    return HttpResponse.json(rsp)
  }),


  // Generic post hanlder
  http.post('*/simple-post*', async ({ request, params, cookies }) => {
    const rsp = await makeTestResponse(request, params, cookies, { message: 'post successful' })
    return HttpResponse.json(rsp)
  }),

  // Generic put handler
  http.put('*/simple-put*', async ({ request, params, cookies }) => {
    const rsp = await makeTestResponse(request, params, cookies, { message: 'put successful' })
    return HttpResponse.json(rsp)
  }),

  // Generic patch handler
  http.patch('*/simple-patch*', async ({ request, params, cookies }) => {
    const rsp = await makeTestResponse(request, params, cookies, {  message: 'patch successful',  })
    return HttpResponse.json(rsp)
  }),

  // Generic delete handler
  http.delete('*/simple-delete*', async ({ request, params, cookies }) => {
    const rsp = await makeTestResponse(request, params, cookies, { message: 'delete successful' })
    return HttpResponse.json(rsp)
  }),

  // Failling scenarios
  http.post('*/failing-post*', async ({ request, params, cookies }) => {
    const errorData = { message: 'Something went wrong!' }
    const rsp = await makeTestResponse(request, params, cookies, errorData)
    return HttpResponse.json(rsp, { status: 500 })
  })
]
