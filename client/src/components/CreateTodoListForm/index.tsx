import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { useCreateTaskList } from '../../hooks/useTodoLists'

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
    mode: 'onChange'
  })

  const onSubmit = async (data: CreateTodoListFormData) => {
    mutate(data)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} role="form" className="flex">
      <input
        {...register('name')}
        id="name"
        name="name"
        type="text"
        placeholder="Enter a name for your new todo list"
        className={`grow rounded-l-md border-y-2 border-l-2 bg-gray-100 px-3 font-medium outline-0 hover:bg-gray-200 ${errors?.['name']?.message ? 'border-red-500' : 'border-gray-100 hover:border-gray-200 focus:border-blue-500'}`}
      />
      <button
        type="submit"
        className={`rounded-r bg-blue-500 px-2 text-2xl font-bold text-white ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
      >
        +
      </button>
    </form>
  )
}

export default CreateTodoListForm
