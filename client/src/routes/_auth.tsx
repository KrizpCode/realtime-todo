import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  beforeLoad: async ({ location }) => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) {
        throw redirect({
          to: '/login',
          search: { redirect: location.href }
        })
      }
    } catch {
      throw redirect({
        to: '/login',
        search: { redirect: location.href }
      })
    }
  },
  component: () => <Outlet />
})
