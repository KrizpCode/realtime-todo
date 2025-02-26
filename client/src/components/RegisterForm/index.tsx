import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from '@tanstack/react-router'

import { RegisterFormData, RegisterUserSchema } from './schema'
import FormField from '../FormField'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

const RegisterForm = () => {
  const auth = useAuth()
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  )

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterUserSchema),
    mode: 'all'
  })

  const onSubmit = async (data: RegisterFormData) => {
    const result = await auth.register(data)

    if (!result.success) {
      setErrorMessage(result.message)
    }

    toast.success('Registration successful! 🎉')
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
        label="Name"
        name="name"
        type="text"
        errors={errors}
        registerProps={register('name')}
      />
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
      <FormField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        errors={errors}
        registerProps={register('confirmPassword')}
      />
      <button
        type="submit"
        className={`w-full cursor-pointer rounded-md bg-[#006fff] p-2 font-medium text-white hover:bg-[#338BFF] active:bg-[#0058CC] ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Registering...' : 'Register'}
      </button>
      <Link
        to="/login"
        className="mt-2 block cursor-pointer text-center text-sm font-medium text-[#006fff] hover:underline"
      >
        Already have an account? Login
      </Link>
    </form>
  )
}

export default RegisterForm
