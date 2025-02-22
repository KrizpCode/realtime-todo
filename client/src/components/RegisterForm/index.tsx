import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate, useRouter } from '@tanstack/react-router'

import { RegisterFormData, RegisterUserSchema } from './schema'
import FormField from '../FormField'
import { useAuth } from '../../hooks/useAuth'

const RegisterForm = () => {
  const auth = useAuth()
  const router = useRouter()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterUserSchema),
    mode: 'all'
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await auth.register(data)

      await router.invalidate()

      await navigate({ to: '/dashboard' })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} role="form">
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
        className={`w-full rounded-md bg-blue-500 p-2 text-white ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Registering...' : 'Register'}
      </button>
    </form>
  )
}

export default RegisterForm
