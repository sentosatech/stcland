import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios'

import { assocPath, keys, toUpper } from 'ramda'
import { isFunction, isNilOrEmpty, isNotObject, isString } from 'ramda-adjunct'
import { throwIf } from '@stcland/errors'
import {
  isNotStringOrNumber,
  isNotStringOrNumberOrBool,
  isNotNilOrObject,
  isNotNilOrStringOrObject
} from '@stcland/utils'

import {
  ServerConfig,
  ClientConfig,
  RestClient,
  RestParams,
  CreateRestClient,
} from './restClientTypes'

export const createRestClient: CreateRestClient = (
  clientConfig: ClientConfig,
  serverConfig: ServerConfig ) =>
{

  const axiosClient = axios.create({
    baseURL: serverConfig?.defaultBaseUrl || '',
    timeout: serverConfig?.timeout || 1000
  })

  const restClient: RestClient = {

    clientConfig,
    serverConfig,
    axiosClient,

    // rest actions, same calling arguments as axios rest actions

    get: axiosClient.get,
    post: axiosClient.post,
    put: axiosClient.put,
    patch: axiosClient.patch,
    delete: axiosClient.delete,


    // rest action function create utils
    // creates functions that can be passed directly into react-query hooks

    createGetFn:
      (restPath, restParams, axiosOptions) =>
      () =>
      restClient.axiosClient.get(expandRestPath(restPath, restParams || {}), axiosOptions),

    createPostFn:
      (restPath, axiosOptions) =>
      ({ data, restParams }) =>
        restClient.axiosClient.post(expandRestPath(restPath, restParams || {}), data, axiosOptions),

    createPutFn:
      (restPath, axiosOptions) =>
      ({ data, restParams }) =>
        restClient.axiosClient.put(expandRestPath(restPath, restParams || {}), data, axiosOptions),

    createPatchFn:
      (restPath, axiosOptions) =>
      ({ data, restParams }) =>
        restClient.axiosClient.patch(expandRestPath(restPath, restParams || {}), data, axiosOptions),

    createDeleteFn:
      (restPath, axiosOptions) =>
      (restParams) =>
        restClient.axiosClient.delete(expandRestPath(restPath, restParams || {}), axiosOptions)

  }

  // all clients use these middlewares

  restClient.axiosClient.interceptors.request.use(
    _requestPreprocessor({
      verbose: !!clientConfig?.verbose,
      getAccessToken: clientConfig?.getAccessToken || (() => 'fakeApiToken'),
    })
  )

  restClient.axiosClient.interceptors.response.use(
    _responsePostProcessor({
      verbose: !!clientConfig?.verbose,
      responsePostProcessor: clientConfig?.responsePostProcessorFn
    })
  )
  return restClient
}

//*****************************************************************************
// Module Only Stuff
//*****************************************************************************

interface _RequestPreProcessorOptions {
  verbose?: boolean
  getAccessToken?: () => string
    // If not nullish, will be used to get an access token,
    // which will be added to the request headers
}

const _requestPreprocessor =
  (opts: _RequestPreProcessorOptions) =>
  (req: InternalAxiosRequestConfig<unknown>):  InternalAxiosRequestConfig<unknown> =>
{
  const { verbose, getAccessToken } = opts
  const accessToken = isFunction(getAccessToken) ? getAccessToken() : ''
  const { method, baseURL, url, data } = req

  if (verbose) {
    console.debug(`\n${toUpper(method || '')} ${baseURL}${url}`)
    if (data) console.debug('body', data)
  }

  return accessToken
    ? assocPath(['headers', 'Authorization'], `Bearer ${accessToken}`, req)
    : req
}

interface _RequestPostProcessorOptions {
  verbose?: boolean
  responsePostProcessor?: (rsp: AxiosResponse) => AxiosResponse
}

export const f = async () => {
    await Promise.resolve(1)
}



const _responsePostProcessor =
  (opts: _RequestPostProcessorOptions) =>
  (rsp: AxiosResponse) =>
{

  const {
    verbose = false,
    responsePostProcessor = rsp => rsp
  } = opts

  const { data, status, statusText } = rsp
  if (verbose) { console.debug(`response: ${status} ${statusText} `, data || '') }

  return responsePostProcessor(rsp)
}

/**
 * @function _expandRestPath
 *
 * path may include variable params such as :entityId
 *
 * params {
 *   pathParams: {[k:string]: unknown}
 *   queryParams: {[k:string]: unknown}
 * }
 *
 * example
 *   path:  /v1/spark/appplatforms/:appPlatformId
 *   params = {
 *     pathParms { appPlatformId: 22 }
 *     queryParams { hydrate: true}
 *   }
 *   output
 *     /v1/spark/appplatforms/22?hydrate=true
 */

export const expandRestPath = (
  restPath: string,
  params?: RestParams
) => {
  if (isNilOrEmpty(params)) return restPath
  throwIf(isNotObject(params), 'expandUrl(): non object supplied for params')

  const { pathParams, queryParams } = params || {}
  if (isNilOrEmpty(pathParams) && isNilOrEmpty(queryParams)) return restPath

  throwIf(
    isNotNilOrObject(pathParams),
    'expandUrl(): non object supplied for pathParams'
  )

  throwIf(
     isNotNilOrStringOrObject(queryParams),
    'expandUrl(): non object supplied for queryParams'
  )

  let expandedPath = restPath

  // insert path params
  if (pathParams) {
    expandedPath = <string>keys(pathParams || {}).reduce((accumPath: string, paramKey) => {
      const paramValue = String((pathParams || {})[paramKey])
      throwIf(
        isNotStringOrNumber(paramValue),
        'expandRestPath(): param value is not a string or number'
      )
      const regExParamKey = new RegExp(`:${String(paramKey)}`, 'g')
      return accumPath.replace(regExParamKey, paramValue)
    }, restPath)
  }

  if (queryParams) {
    expandedPath = isString(queryParams)
      ? expandedPath + queryParams
      : <string>
        keys(queryParams).reduce((accumPath, queryKey, idx) => {
          const queryValue = queryParams[queryKey]
          throwIf(
            isNotStringOrNumberOrBool(queryValue),
            'expandRestPath(): query value is not a string or number or bool'
          )
          return accumPath + `${idx === 0 ? '?' : '&'}${String(queryKey)}=${String(queryValue)}`
        }, expandedPath)
  }

  return expandedPath
}

