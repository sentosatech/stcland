import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import type { StcRest } from './RestHooksTypes'

export const useRestQuery: StcRest.UseRestQuery = <
  TData = any,
  TDefaultResponse = TData,
  TMeta = any> (
    restClient: StcRest.RestClient,
    queryKey: any,
    restPath: string,
    options: StcRest.UseRestQueryOptions<TDefaultResponse> ) =>
{
  // NOTE: not currently using op, but likely will when we build in
  // global useQuery error handling

  const {
    baseUrl,
    defaultResponse,
    pathParams,
    queryParams,
    transformResult = (data: any) => data, // Default: simple passthrough
    pickResults = (rsp: any) => rsp?.data, // Default: pick useQuery data
    pickMeta = () => undefined, // Default: no meta
    resultsPropName = 'missingPropName' // should never happen
  } = options

  const axiosOptions = baseUrl ? { baseURL: baseUrl } : undefined
  const useRestQueryDefaultOptions: Partial<UseQueryOptions> = {
    refetchOnWindowFocus: false
  }

  const useQueryOptions: UseQueryOptions = {
    ...useRestQueryDefaultOptions,
    ...options,
    queryKey,
    queryFn: restClient.createGetFn(restPath, {
      queryParams, pathParams
    },
    axiosOptions),
  }

  const useQueryRsp: any = useQuery(useQueryOptions)

  // account for various depths for location of data
  const resultsProp = pickResults(useQueryRsp) || defaultResponse
  const meta = pickMeta(useQueryRsp)

  const useRestQueryResult: StcRest.UseRestQueryResult<TData, TDefaultResponse, TMeta> = {
    ...useQueryRsp,
    [resultsPropName]: transformResult(resultsProp),
    meta
  }

  return useRestQueryResult
}

