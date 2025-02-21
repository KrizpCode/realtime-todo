import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

import Header from '../components/Header'
import { AuthContextType } from '../context/AuthContext'

interface RouterContext {
  auth?: AuthContextType
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <div className="h-full min-h-screen">
      <Header />
      <div className="h-full pt-12">
        <Outlet />
        <TanStackRouterDevtools position="bottom-right" initialIsOpen={false} />
      </div>
    </div>
  )
})
