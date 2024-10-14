import { isNil } from 'ramda'
import { isFunction, isNotFunction } from 'ramda-adjunct'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { QueryClient, UseMutationResult } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'
import { throwIf } from '@stcland/errors'
import {
  isNotNilOrArray,
  isNotStringOrArrayOrFunction,
} from '@stcland/utils'

import type { StcRest } from './restHooksTypes'
import { useRestClient } from './state/restState'
/*
  All of the mutate hooks return a standard react-query useMutation() object

  The returned object will include the standard use-query mutation functions
  mutate and mutateAsync (which can be given custom names via options)

  All of the returned mutation functions recieve an optional last argument
  `params` (see documentation for each specific hook). The param object allows
  path paramaters and query options to be provided as follows

  params {
    pathParams {
        keys: values
        * keys: variables in the path name that will be substituted
        * values: string | number, values that will be substitued in the path
      }
    queryParams {
      keys: values // for query string to be appended
      * keys: query paramater variable names
      * values: query paramater variable values (string, number or bool)
    }
    -or-
    queryParams:
      string: will be appended directly to the request usrl
  }

  An options object can be supplied to the mutation functions, which can include
  any of the standard react-query useMutation() options

  In addition, the following options can also be included

  options: {

    mutationFnName: string
    * response object will include fxns providedFnName amd providedFnNameAsync
      which reference the stnadard react-query mutation functions

    baseUrl: string
    * optional - the base URL to use for the mutation query

    onSuccess: { // as object
      cachesToAddTo: ['cachId' | [cacheId]] // list of standard react-query cache ID
      * add the entity as a new cache entry on success
      * currently NYI TODO: implement (some complications getting queryFn fetchQuery  )

      cachesToInvalidate [ 'cachId' | [cacheId] ] // list of standard react-query cache ID
      * list of caches to invalidate on success

      cachesToRemove [ 'cachId' | [cacheId] ]
      * list of standard react-query cache ID

      actions []
      * list of functions to perform

      navigate: () => void
      * trigger redirect after on success.

      toastFn: (message: string) => void
      * trigger toast selected by client when on success
    }
    -or-
    onSuccess: // as func
      called with create/updated/deleted passed in when op is succesful

    onError: {
      navigate: () => void
      * trigger redirect after on error.

      toastFn: (message: string) => void
      * display a toast with provided message on error
    }
    -or-
    onError: // as func
      called with error passed in when op is fails
  }

  Advanced Options Usage

  * cacheId / routeTo as functions

    For any option functions that recieves `cacheId` or `routeTo` as inputs,
    these may be functions

    The functions sill be passed the entity that was created/updated/deleted,
    and is expected to return the approrate cache id or route

    This can be useful if you need to construct a route or cacheId in real time
    that is dependent upon the entity being operated upon

    example
      const cacheId = newEntitiy => `[entities, newEntity.id]`
      const routeTo = newEntitiy => `/entities/${newEntity.id}`
  }
*/

/*
  Returns react-query mutation object, which includes the standard react-query
  mutation functions to create an entity, and which have the following signatures

  mutate({ data, params })
    returns created data

  mutateAsync({ data, params })
    return promise which resolves to created data

  The mutation function names can be customized via options: { mutationFnName }
    example options: { mutationFnName: createThing }
*/

/*
  Returns react-query mutation object, which includes the standard react-query
  mutation functions to create an entity, and which have the following signatures

  mutate({ data, params })
    returns created data

  mutateAsync({ data, params })
    return promise which resolves to created data

  The mutation function names can be customized via options: { mutationFnName }
    example options: { mutationFnName: createThing }
*/
export const useRestCreate = (restPath: string, options: StcRest.MutateBaseProps['options'] = {}) => {
  const { restClient } = useRestClient()
  return useRestMutate(restClient.createPostFn, restPath, options)
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
export const useRestUpdate = (restPath: string, options: StcRest.MutateBaseProps['options'] = {}) => {
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
export const useRestPatch = (restPath: string, options: StcRest.MutateBaseProps['options']= {}) => {
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
export const useRestDelete = (restPath: string, options: StcRest.MutateBaseProps['options'] = {}) => {
  const { restClient } = useRestClient()
  return useRestMutate(restClient.createDeleteFn, restPath, options)
}


/*
  All mutation hooks call down to this guy
*/

export const useRestMutate = <
  TData = unknown,
  TVariables = unknown,
  TError = unknown
>(
    mutateFn: (restPath: string, options?: AxiosRequestConfig) => (variables: TVariables) => Promise<TData>,
    restPath: string,
    options: StcRest.MutateBaseProps['options'] = {}
  ): UseMutationResult<TData, TError, TVariables> => {

    // Base Props
  const { mutationFnName, onSuccess = {}, onError = {}, baseUrl = '', navigateFn, toastFn } = options

  const baseActions = { navigateFn, toastFn }

  const axiosOptions = baseUrl ? { baseURL: baseUrl } : undefined

  const queryClient = useQueryClient()

  // Use the mutation function
  const res = useMutation<TData, TError, TVariables>({
    mutationFn:
      mutateFn(restPath, axiosOptions),
    onSuccess: typeof onSuccess === 'function'
      ? onSuccess
      : _onMutateSuccess(queryClient, baseActions, onSuccess),
    onError: typeof onError === 'function'
      ? onError
      : _onMutateError(queryClient, baseActions, onError),
  })

  // Optionally extend result with mutation function names
  if (mutationFnName) {
    (res as any)[mutationFnName] = res.mutate;
    (res as any)[`${mutationFnName}Async`] = res.mutateAsync
  }

  return res
}


// Utils
export const _getCacheId = (clientCacheId: string , entity: string) =>
  isFunction(clientCacheId) ? clientCacheId(entity) : clientCacheId


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

const _validateCacheList = (op: string, cacheList: string[]) => {
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


const _onMutateSuccess =
  (queryClient: QueryClient,
    baseActions: Pick<StcRest.MutateBaseProps['options'], 'navigateFn' | 'toastFn'>,
    onSuccessOptions: StcRest.MutationOptions) =>
    (data: any) => {

      const { navigateFn, toastFn } = baseActions
      const { actions, cachesToInvalidate = [], cachesToRemove = [], toastMessage, routeTo } = onSuccessOptions


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

    // navigate if needed
      if (navigateFn && routeTo) {
        navigateFn(routeTo)
      }

    // Toast !
      if (toastFn && toastMessage){
        toastFn(toastMessage)
      }
    }

const _onMutateError = (
  queryClient: QueryClient,
  baseActions: Pick<StcRest.MutateBaseProps['options'], 'navigateFn' | 'toastFn'>,
  onErrorOptions: StcRest.MutationOptions) => error => {
  const { toastFn } = baseActions
  const { toastMessage } = onErrorOptions
  console.error('Error: rest mutation failed', error)

  /*
  * Detail property is temporary while error property doesn't
  * have a specific messsage to be clearer on each error
  */
  if( !toastMessage && error.response?.data?.detail ){
    toastFn?.(error.response.data.detail)
  } else {
    toastFn?.(toastMessage)
  }
}
