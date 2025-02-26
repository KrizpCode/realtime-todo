import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'

import { useAuth } from '../../hooks/useAuth'
import FormField from '../FormField'
import { LoginFormData, LoginUserSchema } from './schema'

const LoginForm = () => {
  const auth = useAuth()
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  )

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginUserSchema),
    mode: 'all'
  })

  const onSubmit = async (data: LoginFormData) => {
    const result = await auth.login(data)

    if (!result.success) {
      setErrorMessage(result.message)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      role="form"
      className="mx-auto max-w-96 rounded-md bg-white p-6 shadow-md"
    >
      <div className="flex items-center justify-center gap-3 p-2">
        <img src="/logo.svg" alt="logo" className="h-8" />
        <h1 className="text-xl font-semibold">TaskMate</h1>
      </div>
      <p className="mb-2 min-h-[20px] text-center text-sm text-red-500">
        {errorMessage ?? ''}
      </p>
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
        className={`w-full cursor-pointer rounded-md bg-[#006fff] p-2 font-medium text-white hover:bg-[#338BFF] active:bg-[#0058CC] ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
      <Link
        to="/register"
        className="mt-2 block cursor-pointer text-center text-sm font-medium text-[#006fff] hover:underline"
      >
        Don't have an account? Register
      </Link>
    </form>
  )
}

export default LoginForm
