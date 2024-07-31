import { http, HttpResponse } from 'msw'
import { makeTestResponse } from './testUtils'

export const handlers = [

  // Generic get hanlder
  http.get('*/simple-get*', async ({ request, params, cookies }) => {
    const rsp = await makeTestResponse(request, params, cookies, { message: 'get succesful' })
    return HttpResponse.json(rsp)
  }),

  // Generic post hanlder
  http.post('*/simple-post*', async ({ request, params, cookies }) => {
    const rsp = await makeTestResponse(request, params, cookies, { message: 'post succesful' })
    return HttpResponse.json(rsp)
  }),

  // Generic put handler
  http.put('*/simple-put*', async ({ request, params, cookies }) => {
    const rsp = await makeTestResponse(request, params, cookies, { message: 'put succesful' })
    return HttpResponse.json(rsp)
  }),

  // Generic patch handler
  http.patch('*/simple-patch*', async ({ request, params, cookies }) => {
    const rsp = await makeTestResponse(request, params, cookies, { message: 'patch succesful' })
    return HttpResponse.json(rsp)
  }),

]
