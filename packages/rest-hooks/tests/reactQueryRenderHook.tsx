import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, RenderHookResult, RenderHookOptions } from '@testing-library/react'


type RenderFn = (initialProps: any) => any

type MakeReactQueryRenderHook = () => (
  renderFn: RenderFn,
  options?: RenderHookOptions<any, any, any, any>,
) => RenderHookResult<any, any>

export const makeReactQueryRenderHook: MakeReactQueryRenderHook = () => {
  const queryClient = new QueryClient()
  const queryClientWrapper = ({ children }) => (
    <QueryClientProvider {...{ client: queryClient }}>
      {children}
    </QueryClientProvider>
  )

  const makeReactQueryRenderHook = (renderFn: RenderFn) =>
    renderHook(renderFn, { wrapper: queryClientWrapper })

  return makeReactQueryRenderHook
}
