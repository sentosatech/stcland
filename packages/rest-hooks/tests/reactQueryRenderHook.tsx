import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, RenderHookResult, RenderHookOptions } from '@testing-library/react'

type RenderFn = (initialProps: any) => any

type MakeReactQueryRenderHook = () => {
  reactQueryRenderHook: (
    renderFn: RenderFn,
    options?: RenderHookOptions<any, any, any, any>
  ) => RenderHookResult<any, any>;
  queryClient: QueryClient;
}

export const makeReactQueryRenderHook: MakeReactQueryRenderHook = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  const queryClientWrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )

  const reactQueryRenderHook = (renderFn: RenderFn, options?: RenderHookOptions<any, any, any, any>) =>
    renderHook(renderFn, { wrapper: queryClientWrapper, ...options })

  return { reactQueryRenderHook, queryClient }
}
