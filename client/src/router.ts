import { createRouter } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'

import { routeTree } from './routeTree.gen'

export const queryClient = new QueryClient()

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  context: {
    auth: {
      user: null,
      isAuthenticated: undefined,
      login: async () => ({ success: false }),
      register: async () => ({
        success: false
      }),
      logout: async () => {}
    },
    queryClient
  }
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
