import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import FormField from './FormField'

const RegisterUserSchema = z
  .object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8)
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

type RegisterFormData = z.infer<typeof RegisterUserSchema>

const RegisterForm = () => {
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
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      console.log(result)
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
