import { useDeleteTodoItem, useUpdateTodoItem } from '../hooks/useTodoItems'
import { TodoItem } from '../types/todoItem'

interface TodoItemProps {
  todo: TodoItem
}

const TodoItemCard = ({ todo }: TodoItemProps) => {
  const { mutate: updateTodoItem } = useUpdateTodoItem()
  const { mutate: deleteTodoItem } = useDeleteTodoItem()

  const { completed, text, id } = todo

  const handleUpdateTodo = () => {
    updateTodoItem({ completed: !completed, todoItemId: id })
  }

  const handleDeleteTodo = () => {
    deleteTodoItem(id)
  }

  return (
    <div
      className={`flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1 shadow-md ${completed ? 'bg-green-100 text-gray-700 opacity-70' : ''}`}
    >
      <input
        type="checkbox"
        checked={completed}
        onChange={() => handleUpdateTodo()}
        className="h-4 w-4 cursor-pointer"
      />
      <p className={`grow font-medium ${completed ? 'line-through' : ''}`}>
        {text}
      </p>
      <button
        onClick={() => handleDeleteTodo()}
        className="flex cursor-pointer items-center justify-center rounded-md bg-red-400 px-2"
      >
        <span className="font-medium text-white">X</span>
      </button>
    </div>
  )
}

export default TodoItemCard
