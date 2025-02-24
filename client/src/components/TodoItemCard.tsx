import { IoClose } from 'react-icons/io5'

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
      className={`flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 break-all shadow-md ${completed ? 'bg-green-100 text-gray-700 opacity-70' : ''}`}
    >
      <input
        type="checkbox"
        checked={completed}
        onChange={() => handleUpdateTodo()}
        className="min-h-6 min-w-6 cursor-pointer self-start"
      />
      <p className={`grow font-medium ${completed ? 'line-through' : ''}`}>
        {text}
      </p>
      <button
        onClick={() => handleDeleteTodo()}
        className="flex cursor-pointer items-center justify-center self-start rounded-md bg-red-400"
      >
        <IoClose className="min-h-6 min-w-6 text-white" />
      </button>
    </div>
  )
}

export default TodoItemCard
