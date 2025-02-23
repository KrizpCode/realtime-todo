import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { useCreateTaskList } from '../../hooks/useTodoLists'
import FormField from '../FormField'
import { CreateTodoListFormData, createTodoListSchema } from './schema'

const CreateTodoListForm = () => {
  const { mutate } = useCreateTaskList()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<CreateTodoListFormData>({
    resolver: zodResolver(createTodoListSchema),
    mode: 'all'
  })

  const onSubmit = async (data: CreateTodoListFormData) => {
    mutate(data)
    reset()
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
      <button
        type="submit"
        className={`w-full rounded-md bg-blue-500 p-2 text-white ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        Create Todo List
      </button>
    </form>
  )
}

export default CreateTodoListForm
