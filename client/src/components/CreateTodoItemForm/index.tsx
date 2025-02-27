import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FaPlus } from 'react-icons/fa6'

import { TodoList } from '../../types/todoList'
import { CreateTodoItemFormData, createTodoItemSchema } from './schema'
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
    mode: 'onChange'
  })

  const onSubmit = async (data: CreateTodoItemFormData) => {
    mutate({ listId, text: data.text })
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} role="form" className="my-4 flex">
      <input
        {...register('text')}
        id="text"
        name="text"
        type="text"
        placeholder="What do you need to do?"
        className={`grow rounded-l-md border-y-2 border-l-2 bg-gray-100 px-3 py-1 font-medium outline-0 hover:bg-gray-200 ${errors?.['text']?.message ? 'border-red-500' : 'border-gray-100 hover:border-gray-200 focus:border-blue-500'}`}
      />
      <button
        type="submit"
        className={`rounded-r bg-blue-500 px-2 text-2xl text-white ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
      >
        <FaPlus />
      </button>
    </form>
  )
}

export default CreateTodoItemForm
