import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import type { StcRest } from './restHooksTypes'

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
    restParams,
    transformFn = v => v, // simple passthrough fxn as default
    resultsPropName = 'missingPropName' // should happen
  } = options

  const axiosOptions = baseUrl ? { baseURL: baseUrl } : undefined
  const useRestQueryDefaultOptions: Partial<UseQueryOptions> = {
    refetchOnWindowFocus: false
  }

  const useQueryOptions: UseQueryOptions = {
    ...useRestQueryDefaultOptions,
    ...options,
    queryKey,
    queryFn: restClient.createGetFn(restPath, restParams, axiosOptions),
  }

  const useQueryRsp: any = useQuery(useQueryOptions)

  // account for various depths for location of data
  const resultsProp: TData | TDefaultResponse =
    useQueryRsp?.data?.data?.data ||
    useQueryRsp?.data?.data ||
    useQueryRsp?.data ||
    defaultResponse

  // account for various depths for location of meta
  const meta =
    useQueryRsp?.data?.data?.meta ||
    useQueryRsp?.data?.meta ||
    useQueryRsp?.meta



  const useRestQueryResult: StcRest.UseRestQueryResult<TData, TDefaultResponse, TMeta> = {
    ...useQueryRsp,
    [resultsPropName]: transformFn(resultsProp),
    meta
  }

  return useRestQueryResult
}

