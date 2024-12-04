import { isNil } from 'ramda'
import { isFunction, isNotFunction } from 'ramda-adjunct'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { QueryKey, QueryClient, UseMutationResult } from '@tanstack/react-query'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { throwIf } from '@stcland/errors'
import {
  isNotNilOrArray,
  isNotStringOrArrayOrFunction,
} from '@stcland/utils'

import type { StcRest } from './RestHooksTypes'
import { useRestClient } from './state/restState'


export const useRestCreate = <TData = unknown, TError = unknown>(
  restPath: string,
  options: StcRest.MutateBaseProps['options'] = {}
): UseMutationResult<AxiosResponse<TData>, TError, StcRest.MutateFnOptions | undefined> => {
  const { restClient } = useRestClient()
  return useRestMutate(restClient.createPostFn, restPath, options)
}

/*
  Returns react-query mutation object, which includes the standard react-query
  mutation functions to update an entity, and which have the following signatures

  mutate(dataForUpdate, params)
    returns updated data

  mutateAsync(dataForUpdate, params)
    return promise which resolves to updated data

  The mutation function names can be customized via options: { mutationFnName }
    example options: { mutationFnName: updateThing }
*/
export const useRestUpdate  = <TData = unknown, TError = unknown>(
  restPath: string,
  options: StcRest.MutateBaseProps['options'] = {}
): UseMutationResult<AxiosResponse<TData>, TError, StcRest.MutateFnOptions | undefined> => {
  const { restClient } = useRestClient()
  return useRestMutate(restClient.createPutFn, restPath, options)
}

/*
  Returns react-query mutation obect, which includes the standard react-query
  mutation functions to update an entity, and which have the following signatures

  mutate(dataForUpdate, params)
    returns updated data

  mutateAsync(dataForUpdate, params)
    return promise which resolves to updated data

  The mutation function names can be customized via options: { mutationFnName }
    example options: { mutationFnName: updateThing }
*/
export const useRestPatch  = <TData = unknown, TError = unknown>(
  restPath: string,
  options: StcRest.MutateBaseProps['options'] = {}
): UseMutationResult<AxiosResponse<TData>, TError, StcRest.MutateFnOptions | undefined> => {
  const { restClient } = useRestClient()
  return useRestMutate(restClient.createPatchFn, restPath, options)
}

/*
  Returns react-query mutation object, which includes the standard react-query
  mutation functions to delete an entity, and which have the following signatures

  mutate(params)
    returns response from rest server

  mutateAsync(params)
    returns response from rest server

  The mutation function names can be customized via options: { mutationFnName }
    example options: { mutationFnName: deleteThing }
*/
export const useRestDelete  = <TData = unknown, TError = unknown>(
  restPath: string,
  options: StcRest.MutateBaseProps['options'] = {}
): UseMutationResult<AxiosResponse<TData>, TError, StcRest.MutateFnOptions | undefined> => {
  const { restClient } = useRestClient()
  return useRestMutate(restClient.createDeleteFn, restPath, options)
}


/*
  All mutation hooks call down to this guy
*/

export const useRestMutate : StcRest.UseRestMutate = <
  TData = unknown,
  TVariables = unknown,
  TError = unknown
>(
    mutateFn: (restPath: string, options?: AxiosRequestConfig) => (variables: TVariables) => Promise<TData>,
    restPath: string,
    options: StcRest.MutateBaseProps['options'] = {}
  ): UseMutationResult<TData, TError, TVariables> => {

    // Base Props
  const {
    mutationFnName,
    onSuccess = {},
    onMutate = {},
    onError = {},
    baseUrl = '',
    navigateFn,
    toastSuccessFn,
    toastErrorFn,
  } = options

  const baseSuccessActions = { navigateFn, toastSuccessFn }
  const baseErrorActions = { navigateFn, toastErrorFn }

  const axiosOptions = baseUrl ? { baseURL: baseUrl } : undefined

  const queryClient = useQueryClient()

  // Use the mutation function
  const res = useMutation<TData, TError, TVariables>({
    mutationFn:
      mutateFn(restPath, axiosOptions),
    onMutate: typeof onMutate === 'function' ? onMutate : _onMutateOptimisticUpdate(queryClient, onMutate),
    onSuccess: typeof onSuccess === 'function'
      ? onSuccess
      : _onMutateSuccess(queryClient, baseSuccessActions, onSuccess),
    onError: typeof onError === 'function'
      ? onError
      :  (error, variables, context: {rollback: ()=> void}) => {
        _onMutateError(queryClient, baseErrorActions, onError, context?.rollback)(error)},
  })

  // Optionally extend result with mutation function names
  if (mutationFnName) {
    (res as any)[mutationFnName] = res.mutate;
    (res as any)[`${mutationFnName}Async`] = res.mutateAsync
  }

  return res
}


// Utils
export const _getCacheId = (clientCacheId: any[] , data: string) =>
  isFunction(clientCacheId) ? clientCacheId(data) : clientCacheId


const _validateActionsList = (op: string, actions?: StcRest.MutationOptions['actions']) => {
  throwIf(
    isNotNilOrArray(actions),
    `${op} - running actions: expected array for action list, but got ${actions}`
  )
  if (isNil(actions)) return
  actions.forEach(action => {
    throwIf(isNotFunction(action), `${op} - Invalid action ${action}`)
  })
}

const _validateCacheList = (op: string, cacheList: any[][]) => {
  throwIf(
    isNotNilOrArray(cacheList),
    `${op} - invalidating caches: expected array for cache list, but got ${cacheList}`
  )
  if (isNil(cacheList)) return
  cacheList.forEach(cacheId => {
    throwIf(
      isNotStringOrArrayOrFunction(cacheId),
      `${op}: Invalid cache ID '${cacheId}`
    )
  })
}


const _onMutateOptimisticUpdate = (
  queryClient: QueryClient,
  onMutateOptions: StcRest.MutationOptions
) => async (data: any) => {
  const { cachesToAdd = [], cachesToRemove = [], cachesToInvalidate = [] } = onMutateOptions

  const previousCacheData: Map<QueryKey, any> = new Map()
  const addedCacheKeys: QueryKey[] = []  // Track caches added during mutation

  // Handle caches to remove - Store data, then remove from cache
  cachesToRemove.forEach((cacheToRemove) => {
    const cacheKey = _getCacheId(cacheToRemove, data.data)
    const existingData = queryClient.getQueryData(cacheKey)
    if (existingData !== undefined) {
      previousCacheData.set(cacheKey, existingData)
    }
    queryClient.removeQueries({ queryKey: cacheKey })
  })

  // Handle caches to invalidate - Store data, then invalidate
  cachesToInvalidate.forEach((cacheToInvalidate) => {
    const cacheKey = _getCacheId(cacheToInvalidate, data.data)
    const existingData = queryClient.getQueryData(cacheKey)
    if (existingData !== undefined) {
      previousCacheData.set(cacheKey, existingData)
    }
    queryClient.invalidateQueries(cacheKey) // Invalidate cache
  })

  // Handle caches to add - Add optimistic data to cache
  cachesToAdd.forEach((cacheToAdd) => {
    const cacheKey = _getCacheId(cacheToAdd, data.data)
    queryClient.setQueryData(cacheKey, 'optimisticData') // Set optimistic cache
    addedCacheKeys.push(cacheKey)  // Track added cache for rollback
  })

  // Rollback logic: Restore previous state for all cache actions
  const rollback = () => {
    // Restore removed and invalidated caches
    previousCacheData.forEach((data, key) => {
      queryClient.setQueryData(key, data) // Restore previous data
    })

    // Remove caches that were optimistically added
    addedCacheKeys.forEach((key) => {
      queryClient.removeQueries({ queryKey: key })
    })
  }

  return { rollback }
}


const _onMutateSuccess =
  (queryClient: QueryClient,
    baseActions: Pick<StcRest.MutateBaseProps['options'], 'navigateFn' | 'toastSuccessFn'>,
    onSuccessOptions: StcRest.MutationOptions) =>
    (data: any) => {

      const { navigateFn, toastSuccessFn } = baseActions
      const {
        actions, cachesToInvalidate = [],
        cachesToRemove = [], cachesToAdd = [],
        toastMessage, routeTo } = onSuccessOptions


      _validateActionsList('onMutateSuccess - running action functions', actions)
      if (actions) {
        actions.forEach(action => {
          action()
        })
      }
    // Fist, remove caches, so they won't try to refetch upon invalidation
      _validateCacheList('onMutateSuccess - removing caches', cachesToRemove)
      const exact = true

      cachesToRemove.forEach(cacheToRemove => {
        queryClient.removeQueries({ queryKey: _getCacheId(cacheToRemove, data), exact })
      })

    // Next, invalidate any caches that currently exist
      _validateCacheList(
        'onMutateSuccess - invalidating caches',
        cachesToInvalidate
      )

      cachesToInvalidate.forEach(cacheToInvalidate => {
        queryClient.invalidateQueries(_getCacheId(cacheToInvalidate, data))
      })

       // Add new caches
      if (cachesToAdd.length > 0) {
        _validateCacheList('onMutateSuccess - adding caches', cachesToAdd)
        cachesToAdd.forEach((cacheToAdd) => {
          const queryKey = _getCacheId(cacheToAdd, data)
          queryClient.setQueryData(queryKey, () => data)
        })
      }

    // navigate if needed
      if (navigateFn && routeTo) {
        navigateFn(routeTo)
      }

    // Toast !
      if (toastSuccessFn && toastMessage){
        toastSuccessFn(toastMessage)
      }
    }

const _onMutateError = (
  queryClient: QueryClient,
  baseActions: Pick<StcRest.MutateBaseProps['options'], 'navigateFn' | 'toastErrorFn'>,
  onErrorOptions: StcRest.OnErrorOptions,
  rollback?:()=> void,
) => (error: any) => {
  const { toastErrorFn } = baseActions
  const { toastMessage } = onErrorOptions
  console.error('Error: rest mutation failed', error)

  // Rollback if provided - just available when passing the onMutate props.
  if (rollback) {
    console.log('Rolling back optimistic update...')
    rollback()
  }
  /*
  * Detail property is temporary while error property doesn't
  * have a specific messsage to be clearer on each error
  */
  if( !toastMessage && error.response?.data?.detail ){
    toastErrorFn?.(error.response.data.detail)
  } else {
    toastErrorFn?.(toastMessage)
  }
}
