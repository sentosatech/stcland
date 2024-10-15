import type { StcRest } from '../src/RestHooksTypes'
import type { StcRestTest } from './testTypes'
import { describe, test, expect, beforeEach, vi } from 'vitest'
import { setupServer } from 'msw/node'
import { handlers } from './handlers'
import { useRestCreate, useRestUpdate, useRestPatch, useRestDelete, _getCacheId } from '../src/restMutateHooks'
import { makeReactQueryRenderHook } from './reactQueryRenderHook'


const createStatefulFunction = <T extends string | null>() => {
  let state: T = null as T

  // A unified function to set the state, regardless of the type.
  const fn = (value?: T) => {
    if (value !== undefined) state = value
  }

  // Retrieve the current state for assertions.
  const getState = () => state

  return { fn, getState }
}

describe('Test Rest Mutate Query Hooks', () => {

  // Response based on REST method used.
  let response: StcRestTest.TestResponse
  let expectedRsp: StcRestTest.TestResponse

  // Base Props.
  let restPath: string
  let baseUrl: string
  let toastFnWrapper: { fn: (message?: string) => void; getState: () => string | null }
  let navigateFnWrapper: { fn: (routeTo?: string) => void; getState: () => string | null }

  // OnSuccess Mutation props.
  const actions = [vi.fn(), vi.fn()]
  let toastMessage : string
  let routeTo: string
  let cachesToRemove: any[][]
  let cachesToInvalidate: any[][]
  let cachesToAdd: any[][]

  const { queryClient, reactQueryRenderHook } = makeReactQueryRenderHook()

  beforeEach(() => {
    queryClient.clear()
    vi.spyOn(queryClient, 'invalidateQueries')
    vi.spyOn(queryClient, 'removeQueries')
    toastFnWrapper = createStatefulFunction<string>()
    navigateFnWrapper = createStatefulFunction<string>()
  })

  // start the test server
  const server = setupServer(...handlers)
  server.listen()

    /**
    Helper handler to assert response details based on the REST METHOD.
   */
  const assertResponse = (
    response: StcRestTest.TestResponse,
      // The response which contains requestInfo and responseBody.
    expectedResponse: StcRestTest.TestResponse,
      // The expected response, varying depending on the test case.
  ) => {

    expect(expectedResponse.data.message).toEqual(response.data.data.message)
    expect(expectedResponse.meta?.url).toEqual(response.data.meta.url)
    expect(expectedResponse.meta?.body.data).toEqual(response.data.meta.body)
    expect(expectedResponse.meta?.headers.authorization).toEqual(response.data.meta.headers.authorization)
  }

 /**
    Helper method to add/remove/invalidate queries
   */
  const addAndAssertQueriesBeforeMutation = (
    caches : Pick<StcRest.MutationOptions, 'cachesToInvalidate' | 'cachesToRemove' | 'cachesToAdd'>,
    data?: any
  ) => {

    const { cachesToRemove, cachesToInvalidate, cachesToAdd } = caches

    // Add queries to the cache.
    cachesToRemove?.forEach((cache) => queryClient.setQueryData(_getCacheId(cache, data), 'remove') as any)
    cachesToInvalidate?.forEach((cache) => queryClient.setQueryData(_getCacheId(cache, data), 'invalidate') as any)
    cachesToAdd?.forEach((cache) => queryClient.setQueryData(_getCacheId(cache, data), 'add') as any)

    // Assert queries are present in the cache before removal.
    cachesToRemove?.forEach((cache) => {
      expect(queryClient.getQueryData(_getCacheId(cache, data))).toBeDefined()
    })

    cachesToInvalidate?.forEach((cache) => {
      expect(queryClient.getQueryData(_getCacheId(cache, data))).toBeDefined()
    })

    cachesToAdd?.forEach((cache) => {
      expect(queryClient.getQueryData(_getCacheId(cache, data))).toBeDefined()
    })
  }

   /**
    Helper handler to assert onMutateSuccess passed to useMutation hook.
   */
  const assertOnMutateSuccess = (
    options: StcRest.MutationOptions & { mutationFnName: string, data?: any }
  ) => {
    const { actions, mutationFnName, toastMessage, routeTo, cachesToInvalidate, cachesToRemove, data } = options

    expect(mutationFnName).toBeDefined()

    actions?.forEach((action)=>{
      expect(action).toHaveBeenCalled()
    })

    cachesToInvalidate?.forEach(cache => {
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith( _getCacheId(cache, data))
    })

    cachesToRemove?.forEach(cache => {
      expect(queryClient.removeQueries).toHaveBeenCalledWith({
        queryKey: _getCacheId(cache, data),
        exact: true,
      })
      expect(queryClient.getQueryData(_getCacheId(cache, data))).toBeUndefined()
    })

    const cacheEntries = queryClient.getQueryCache().findAll()

    // Assert that the only caches are the invalidate, and that it matches the queryKey
    cachesToInvalidate?.forEach((cache) => {
      const expectedCacheId = _getCacheId(cache, data)
      const matchingQuery = cacheEntries.find((query) => query.queryKey === expectedCacheId)

      if (matchingQuery) {
        expect(matchingQuery.state).toMatchObject({
          data: 'invalidate',
          status: 'success',
        })
      } else {
    // If a cache was not found throw error.
        throw new Error(`Cache ID ${expectedCacheId} not found in query cache.`)
      }
    })

    expect(toastFnWrapper.getState()).toBe(toastMessage)
    expect(navigateFnWrapper.getState()).toBe(routeTo)
  }


  // useRestMutate under-the-hood
  test('useRestCreate mutate hook', async () => {
    toastMessage = 'Item created successfully!'
    routeTo = '/created'
    cachesToRemove = [['cache1', 'cache2'], ['cache3', 'cache4']]
    cachesToInvalidate = [['cache5']]
    restPath = '/simple-post/:animal'
    baseUrl = 'http://testhost.com:1234'


    const { result } = reactQueryRenderHook(() => useRestCreate(restPath,
      { mutationFnName: 'useRestCreateTest',
        baseUrl,
        toastFn: toastFnWrapper.fn,
        navigateFn: navigateFnWrapper.fn,
        onMutate: {
          cachesToRemove,
          cachesToInvalidate
        },
        onSuccess: {
          toastMessage,
          routeTo,
          actions,
          cachesToRemove,
          cachesToInvalidate
        } },))


    const restParams = { pathParams: { animal: 'dog' }, queryParams: { pureBreed: true, age: 3 } }
    const data = { data: 'Post Data' }

    addAndAssertQueriesBeforeMutation({ cachesToRemove, cachesToInvalidate }, data.data)

    response  = await result.current.mutateAsync({ data, restParams })

    expectedRsp = {
      data:  {
        message: 'post successful'
      },
      meta: {
        url: `${baseUrl}/simple-post/dog?pureBreed=true&age=3`,
        headers:{ authorization: 'Bearer token' },
        method: 'POST',
        body: { data },
      }
    }

    const mutationOptions = {
      mutationFnName: result.current.useRestCreateTest,
      routeTo,
      toastMessage,
      actions,
      cachesToInvalidate,
      cachesToRemove,
      data
    }

    assertResponse(response, expectedRsp)
    assertOnMutateSuccess(mutationOptions)
  })


  test('useRestUpdate mutate hook', async () => {
    toastMessage = 'Item updated successfully!'
    routeTo = '/updated'
    cachesToRemove = [['cacheUpdate1'], ['cacheUpdate2']]
    cachesToInvalidate = [['cacheUpdate3']]
    restPath = '/simple-put'
    baseUrl = 'http://testhost.com:6666'


    const { result } = reactQueryRenderHook(() => useRestUpdate(restPath,
      { mutationFnName: 'useRestUpdateTest',
        toastFn: toastFnWrapper.fn,
        navigateFn: navigateFnWrapper.fn,
        baseUrl,
        onSuccess: {
          toastMessage,
          routeTo,
          actions,
          cachesToRemove,
          cachesToInvalidate
        } },))


    const restParams = { queryParams: { festival: 'groundUpFest', genre: 'jazz' } }
    const data = { data: 'Put Data' }

    addAndAssertQueriesBeforeMutation({ cachesToRemove, cachesToInvalidate }, data.data)

    response = await result.current.mutateAsync({ data, restParams })

    expectedRsp = {
      data:  {
        message: 'put successful'
      },
      meta: {
        url:`${baseUrl}/simple-put?festival=groundUpFest&genre=jazz`,
        headers:{ authorization: 'Bearer token' },
        method: 'PUT',
        body: { data },
      }
    }

    const mutationOptions = {
      mutationFnName: result.current.useRestUpdateTest,
      routeTo,
      toastMessage,
      actions,
      cachesToInvalidate,
      cachesToRemove,
      data
    }


    assertResponse(response, expectedRsp)
    assertOnMutateSuccess(mutationOptions)
  })

  test('useRestPatch mutate hook', async () => {
    toastMessage = 'Item partially updated successfully!'
    routeTo = '/patched'
    cachesToRemove = [['patchCache1']]
    cachesToInvalidate = [['patchCache2']]
    restPath = '/simple-patch'
    baseUrl = 'http://testhost.com:9999'


    const { result } = reactQueryRenderHook(() => useRestPatch(restPath,
      { mutationFnName: 'useRestPatchTest',
        toastFn: toastFnWrapper.fn,
        navigateFn: navigateFnWrapper.fn,
        baseUrl,
        onSuccess: {
          toastMessage,
          actions ,
          routeTo,
          cachesToInvalidate,
          cachesToRemove,
        } },))


    const restParams = { queryParams: { color: 'purple' } }
    const data = { data: 'Patch Data' }

    addAndAssertQueriesBeforeMutation({ cachesToRemove, cachesToInvalidate }, data.data)

    response = await result.current.mutateAsync({ data, restParams })

    expectedRsp = {
      data:  {
        message: 'patch successful'
      },
      meta: {
        url:`${baseUrl}/simple-patch?color=purple`,
        headers:{ authorization: 'Bearer token' },
        method: 'PATCH',
        body: { data },
      }
    }

    const mutationOptions = {
      mutationFnName: result.current.useRestPatchTest,
      toastMessage,
      routeTo,
      actions,
      cachesToInvalidate,
      cachesToRemove,
      data
    }

    assertResponse(response, expectedRsp)
    assertOnMutateSuccess(mutationOptions)
  })


  test('useRestDelete mutate hook', async () => {
    toastMessage = 'Item deleted successfully!'
    routeTo = '/deleted'
    cachesToRemove = [['deleteCache']]
    cachesToInvalidate = [['deleteCache2']]
    restPath = '/simple-delete/:id'
    baseUrl = 'http://testhost.com:5555'


    const { result } = reactQueryRenderHook(() => useRestDelete(restPath,
      { mutationFnName: 'useRestDeleteTest',
        toastFn: toastFnWrapper.fn,
        navigateFn: navigateFnWrapper.fn,
        baseUrl,
        onSuccess: {
          toastMessage,
          actions ,
          routeTo,
          cachesToInvalidate,
          cachesToRemove,
        } },))


    const restParams = { pathParams: { id: 1 } }

    addAndAssertQueriesBeforeMutation({ cachesToRemove, cachesToInvalidate })

    response = await result.current.mutateAsync({ restParams })
    expectedRsp = {
      data:  {
        message: 'delete successful'
      },
      meta: {
        url:`${baseUrl}/simple-delete/1`,
        headers:{ authorization: 'Bearer token' },
        method: 'DELETE',
        body: { data: null },
      }
    }

    const mutationOptions = {
      mutationFnName: result.current.useRestDeleteTest,
      toastMessage,
      routeTo,
      actions,
      cachesToInvalidate,
      cachesToRemove,
    }

    assertResponse(response, expectedRsp)
    assertOnMutateSuccess(mutationOptions)
  })


  // Failling test cases.
  test('useRestCreate mutate hook - optimistic rollback on failure', async () => {
    toastMessage = 'Failed to create item!'
    cachesToRemove = [['cache1'], ['cache2']]
    cachesToInvalidate = [['cache5']]
    cachesToAdd = [['hello']]
    restPath = '/failing-post/:animal'
    baseUrl = 'http://testhost.com:6666'


    const { result } = reactQueryRenderHook(() =>
      useRestCreate(restPath, {
        mutationFnName: 'useRestCreateFailTest',
        baseUrl,
        toastFn: toastFnWrapper.fn,
        onMutate: {
          cachesToRemove,
          cachesToInvalidate,
          cachesToAdd
        },
        onError: {
          toastMessage,
        },
      })
    )

    const restParams = { pathParams: { animal: 'dog' } }
    const data = { data: 'Invalid Post Data' }

    addAndAssertQueriesBeforeMutation(
      { cachesToRemove, cachesToInvalidate, cachesToAdd },
      data.data
    )

    try {
      // Attempt the mutation and expect it to fail
      await result.current.mutateAsync({ data, restParams })
    } catch (error) {
      const expectedRsp = {
        data: { message: 'Something went wrong!' },
        meta: {
          url: `${baseUrl}/failing-post/dog`,
          headers: { authorization: 'Bearer token' },
          method: 'POST',
          body: { data },
        },
      }

      // Verify error matches the expected response, and trigger toast with toastMessage.
      expect(error.response.data.data.message).toEqual(expectedRsp.data.message)
      expect(toastFnWrapper.getState()).toBe(toastMessage)

      const allQueries = queryClient.getQueryCache().findAll()

      // Verify that caches added during optimistic update are removed.
      cachesToAdd.forEach(([key]) => {
        expect(allQueries.some(query => query.queryKey[0] === key)).toBe(false)
      })

      // Verify that caches removed/invalidated are restored.
      cachesToRemove.concat(cachesToInvalidate).forEach((queryKey) => {
        expect(queryClient.getQueryData(queryKey)).toBeDefined()
      })
    }
  })

})
