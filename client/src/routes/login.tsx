import { createFileRoute, redirect } from '@tanstack/react-router'

import LoginPage from '../pages/Login'
import { z } from 'zod'

export const Route = createFileRoute('/login')({
  validateSearch: z.object({
    redirect: z.string().optional().catch('')
  }),
  beforeLoad: ({ context, search }) => {
    if (context?.auth?.isAuthenticated) {
      throw redirect({
        to: search.redirect || '/dashboard'
      })
    }
  },
  component: LoginPage
})
