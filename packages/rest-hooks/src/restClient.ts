import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios'

import { assocPath, keys } from 'ramda'
import { isNilOrEmpty, isNotObject, isString } from 'ramda-adjunct'
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
  FetchResponseContents,
  RestClient,
  RestParams,
} from './restClientTypes'


export const createRestClient = (
  clientConfig: ClientConfig,
  serverConfig: ServerConfig) =>
{

  // start from here

  const restClient: RestClient = {
    clientConfig,
    serverConfig,
    axiosClient: axios.create({
      baseURL: serverConfig?.defaultBaseUrl || '',
      timeout: serverConfig?.timeout || 1000
    })
  }

  // add rest actions, same calling arguments as axios rest actions

  restClient.get = async (...args) => await restClient.axiosClient.get(...args)
  restClient.post = async (...args) => await restClient.axiosClient.post(...args)
  restClient.put = async (...args) => await restClient.axiosClient.put(...args)
  restClient.patch = async (...args) => await restClient.axiosClient.patch(...args)
  restClient.delete = async (...args) => await restClient.axiosClient.delete(...args)

  // add the rest action function create utils
  // creates functions that can be passed into reqact-query hooks

  restClient.createGetFn =
    (restPath, restParams, axiosOptions) =>
    () =>
    restClient.axiosClient.get(_expandRestPath(restPath, restParams || {}), axiosOptions)

  restClient.createPostFn =
    (restPath, axiosOptions) =>
    ({ data, restParams }) =>
      restClient.axiosClient.post(_expandRestPath(restPath, restParams || {}), data, axiosOptions)

  restClient.createPutFn =
    (restPath, axiosOptions) =>
    ({ data, restParams }) =>
      restClient.axiosClient.put(_expandRestPath(restPath, restParams || {}), data, axiosOptions)

  restClient.createPatchFn =
    (restPath, axiosOptions) =>
    ({ data, restParams }) =>
      restClient.axiosClient.patch(_expandRestPath(restPath, restParams || {}), data, axiosOptions)

  restClient.createDeleteFn =
    (restPath, axiosOptions) =>
    (restParams) =>
      restClient.axiosClient.delete(_expandRestPath(restPath, restParams || {}), axiosOptions)


  // all clients use these middlewares

  restClient.axiosClient.interceptors.request.use(
    _requestPreprocessor({
      verbose: !!clientConfig?.verbose,
      getAccessToken: clientConfig?.getAccessToken || (() => 'fakeApiToken'),
    })
  )

  restClient.axiosClient.interceptors.response.use(
    _responsePostProcessor(!!clientConfig?.verbose)
  )

  return restClient
}

// //*****************************************************************************
// // Module Only Stuff
// //*****************************************************************************

interface _RequestPreprocessorOptions {
  verbose: boolean
  getAccessToken: () => string
    // If not nullish, will be used to get an access token,
    // which will be added to the request headers
}

const _requestPreprocessor =
  (opts: _RequestPreprocessorOptions) =>
  (req: InternalAxiosRequestConfig<unknown>):  InternalAxiosRequestConfig<unknown> =>
{
  const { verbose, getAccessToken } = opts
  const accessToken = getAccessToken()
  const { method, baseURL, url, data } = req

  if (verbose) {
    console.debug(`\n${method} (new) ${baseURL}${url}`)
    if (data) console.debug('body', data)
  }

  return accessToken
    ? assocPath(['headers', 'Authorization'], `Bearer ${accessToken}`, req)
    : req
}

const _responsePostProcessor = (
  verbose: boolean = false, fetchResponse: FetchResponseContents = 'FULL') =>
  (rsp: AxiosResponse) =>
{
  const { data, status, statusText } = rsp
  if (verbose) { console.debug(`response: ${status} ${statusText} `, data || '') }
  return fetchResponse === 'DATA_ONLY' ? data : rsp
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
export const _expandRestPath = (
  restPath: string,
  params: RestParams) => {
  if (isNilOrEmpty(params)) return restPath
  throwIf(isNotObject(params), 'expandUrl(): non object supplied for params')

  const { pathParams, queryParams } = params
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
    expandedPath = keys(pathParams || {}).reduce((accumPath: string, paramKey) => {
      const paramValue = String((pathParams || {})[paramKey])
      throwIf(
        isNotStringOrNumber(paramValue),
        'expandRestPath(): param value is not a string or number'
      )
      const regExParamKey = new RegExp(`:${String(paramKey)}`, 'g')
      return accumPath.replace(regExParamKey, paramValue)
    }, restPath)
  }

  // append query params
  if (queryParams) {
    expandedPath = isString(queryParams)
      ? expandedPath + queryParams
      : keys(pathParams || {}).reduce((accumPath: string, queryKey, idx) => {
        const queryValue = queryParams[queryKey]
        throwIf(
          isNotStringOrNumberOrBool(queryValue),
          'expandRestPath(): query value is not a string, number or bool'
        )
        return accumPath +
          `${idx === 0 ? '?' : '&'}${String(queryKey)}=${String(queryValue)}`
      }, expandedPath)
  }

  return expandedPath
}

