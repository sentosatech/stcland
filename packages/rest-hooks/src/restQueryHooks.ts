import { useQuery } from '@tanstack/react-query'
import type { StcRest } from './restHooksTypes'
import { isUndefined, isNotUndefined } from 'ramda-adjunct';
import { assoc } from 'ramda';

export const useRestQuery = (
  restClient: StcRest.RestClient,
  queryKey: any,
  restPath: string,
  options: StcRest.RestQueryOptions,
) => {
  const { op, baseUrl, resultsPropName, transformFn, defaultResponse, restParams } = options
  const axiosOptions = baseUrl ? { baseURL: baseUrl } : undefined

  const defaultOptoins: StcRest.RestQueryOptions = {
    op: 'useRestQuery',
    refetchOnWindowFocus: false,
  }

  const res = useQuery({
    ...defaultOptoins,
    ...options,
    queryKey,
    queryFn: () => restClient.createGetFn(restPath, restParams, axiosOptions),
  })

  // handle default response on undefined data
  if (isUndefined(res?.data)) {
    return resultsPropName
      ? {...res, data: defaultResponse, [resultsPropName]: defaultResponse}
      : {...res, data: defaultResponse}
  }

  // if we have nothing custom to do, we are done
  if (!resultsPropName && !transformFn) return res

  if (transformFn && !resultsPropName) {
    throw new Error(`useRestQuery() ${op}: cant use transformFn without resultsPropName`)
  }

  return assoc(
    resultsPropName || 'missingPropName',
    transformFn && isNotUndefined(res?.data) ? transformFn(res?.data) : res?.data,
    res
  )
}
