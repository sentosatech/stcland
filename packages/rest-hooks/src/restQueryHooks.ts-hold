import { AxiosRequestConfig } from 'axios'
import { assoc, omit } from 'ramda'
import { isNotUndefined, isUndefined } from 'ramda-adjunct'
import { useQuery, UseQueryResult, UseQueryOptions, UseMutationOptions } from 'react-query'

import { useRestClient } from '@/state/restState'

const nonReactQueryOptions = [
  'queryParams',
  'pathParams',
  'baseURL',
  'transformFn',
  'defaultResponse',
  'resultsPropName',
]

export interface Options extends Omit<UseQueryOptions, 'onError'> {
  /** operation, used for more informative error reporting */
  op?: string
  /** Will be returned as results when query returns `undefined`*/
  defaultResponse?: any
  /** run the results through this fxn before returning */
  transformFn?: (data: any) => void
  /** custom name for the results property (overrides defaults) */
  resultsPropName?: string
  /** obj:{ paramName1: paramVal1, paramName2: paramVal2, etc },
      results in /some-path?paramName1=paramVal1&paramName2=paramVal2
      paramVal may be a string, number or boolean
    string: Will be directly appended to the rest path
      Assumed is in valid query string format */
  queryParams?: {[key: string]: string | number | boolean} | string
  baseURL?: string
  timeout?: number
  onError?: UseQueryOptions['onError'] | UseMutationOptions['onError']
}

export type RestQueryResult<T> = UseQueryResult<[T]> | {[key: string]: unknown}

export type UseRestQuery = <T>(
  cacheId: string | string[],
  restPath: string,
  options: Options
) => RestQueryResult<T>


/**
 * Standard react-query useQuery() object is returned.
 * NOTES:
 * The raw query results are always held in the 'data' prop
 * Query paramaters can also be supplied as part of the rest path
 * @param cacheId
 * @param restPath
 * @param options
 * @returns
 */
export const useRestQuery = <T>(
  cacheId: string | string[],
  restPath: string,
  options: Options = {}
): RestQueryResult<T> => {
  const { resultsPropName = '', transformFn, defaultResponse } = options
  const { queryParams, baseURL, op = '', timeout } = options
  const axiosOptions: AxiosRequestConfig = {
    baseURL: baseURL || undefined,
    timeout,
  }

  const defaultReactQueryOptions: UseQueryOptions = {
    refetchOnWindowFocus: false,
  }
  const useQueryOptions = omit(nonReactQueryOptions, {
    ...defaultReactQueryOptions,
    ...options,
  })

  const { restClient } = useRestClient()
  if (!restClient.makeGetFn) {
    console.error('makeGetFn not provided')
    throw new Error('makeGetFn not provided')
  }
  const res: UseQueryResult = useQuery(
    cacheId,
    restClient.makeGetFn(restPath, queryParams, { ...axiosOptions }),
    useQueryOptions
  )

  // handle default response on undefined data
  if (isUndefined(res?.data)) {
    return resultsPropName
      ? { ...res, data: defaultResponse, [resultsPropName]: defaultResponse }
      : { ...res, data: defaultResponse }
  }

  // if we have nothing custom to do, we are done
  if (!resultsPropName && !transformFn) return res

  if (transformFn && !resultsPropName) {
    throw new Error(`useBaseRestClientQuery() ${op}: cant use transformFn without resultsPropName`)
  }
  return assoc(
    resultsPropName,
    transformFn && isNotUndefined(res?.data) ? transformFn(res?.data) : res?.data,
    res
  )
}
