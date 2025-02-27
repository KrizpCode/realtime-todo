import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { type QueryClient } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

import Header from '../components/Header'
import { AuthContextType } from '../context/AuthContext'
import { fetchUser } from '../services/authService'
import { AuthProvider } from '../context/AuthProvider'
import { setAuthToken } from '../services/auhToken'

interface RouterContext {
  auth: AuthContextType
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async ({ context }) => {
    if (context.auth.isAuthenticated !== undefined) return

    try {
      const { user, token } = await fetchUser()

      setAuthToken(token)

      context.auth.user = user
      context.auth.isAuthenticated = !!user
    } catch {
      context.auth.user = null
      context.auth.isAuthenticated = false
    }
  },
  component: () => (
    <AuthProvider>
      <div className="h-full min-h-screen">
        <Header />
        <div className="h-full pt-12">
          <Outlet />
          {/* <TanStackRouterDevtools
            position="bottom-right"
            initialIsOpen={false}
          /> */}
          {/* <ReactQueryDevtools
            buttonPosition="bottom-left"
            initialIsOpen={false}
          /> */}
        </div>
        <Toaster position="top-center" />
      </div>
    </AuthProvider>
  )
})
