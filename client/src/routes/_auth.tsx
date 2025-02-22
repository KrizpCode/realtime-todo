import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { fetchUser } from '../services/authService'

export const Route = createFileRoute('/_auth')({
  beforeLoad: async ({ location }) => {
    try {
      await fetchUser()
    } catch {
      throw redirect({
        to: '/login',
        search: { redirect: location.href }
      })
    }
  },
  component: () => <Outlet />
})
