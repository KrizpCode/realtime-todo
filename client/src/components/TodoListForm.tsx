import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import FormField from './FormField'

const createTodoListSchema = z.object({
  name: z.string().nonempty('Name is required')
})

type TodoListFormData = z.infer<typeof createTodoListSchema>

const TodoListForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<TodoListFormData>({
    resolver: zodResolver(createTodoListSchema),
    mode: 'all'
  })

  const onSubmit = async (data: TodoListFormData) => {
    try {
      const response = await fetch('/api/todo-lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create todo list')
      }

      reset()
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
      <button
        type="submit"
        className={`w-full rounded-md bg-blue-500 p-2 text-white ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        Create Todo List
      </button>
    </form>
  )
}

export default TodoListForm
