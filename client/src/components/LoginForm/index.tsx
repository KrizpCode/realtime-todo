import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useRouter, useSearch } from '@tanstack/react-router'

import { useAuth } from '../../hooks/useAuth'
import FormField from '../FormField'
import { LoginFormData, LoginUserSchema } from './schema'

const LoginForm = () => {
  const auth = useAuth()
  const router = useRouter()
  const navigate = useNavigate()
  const search = useSearch({ strict: false })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginUserSchema),
    mode: 'all'
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await auth.login(data.email, data.password)

      await router.invalidate()

      await navigate({ to: search.redirect || '/dashboard' })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} role="form">
      <FormField
        label="Email"
        name="email"
        type="email"
        errors={errors}
        registerProps={register('email')}
      />
      <FormField
        label="Password"
        name="password"
        type="password"
        errors={errors}
        registerProps={register('password')}
      />
      <button
        type="submit"
        className={`w-full rounded-md bg-blue-500 p-2 text-white ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}

export default LoginForm
