import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { TodoList } from '../../types/todoList'
import { CreateTodoItemFormData, createTodoItemSchema } from './schema'
import FormField from '../FormField'
import { useCreateTodoItem } from '../../hooks/useTodoItems'

interface CreateTodoItemFormProps {
  listId: TodoList['id']
}

const CreateTodoItemForm = ({ listId }: CreateTodoItemFormProps) => {
  const { mutate } = useCreateTodoItem()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<CreateTodoItemFormData>({
    resolver: zodResolver(createTodoItemSchema),
    mode: 'all'
  })

  const onSubmit = async (data: CreateTodoItemFormData) => {
    mutate({ listId, text: data.text })
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} role="form">
      <FormField
        label="Text"
        name="text"
        type="text"
        errors={errors}
        registerProps={register('text')}
      />
      <button
        type="submit"
        className={`w-full rounded-md bg-blue-500 p-2 text-white ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        Add Todo Item
      </button>
    </form>
  )
}

export default CreateTodoItemForm
