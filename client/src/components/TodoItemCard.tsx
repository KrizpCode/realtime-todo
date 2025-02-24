import { KeyboardEvent, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { FaPen } from 'react-icons/fa6'

import { useDeleteTodoItem, useUpdateTodoItem } from '../hooks/useTodoItems'
import { TodoItem } from '../types/todoItem'

interface TodoItemProps {
  todo: TodoItem
}

const TodoItemCard = ({ todo }: TodoItemProps) => {
  const { mutate: updateTodoItem } = useUpdateTodoItem()
  const { mutate: deleteTodoItem } = useDeleteTodoItem()

  const [isEditing, setIsEditing] = useState(false)
  const [TodoText, setTodoText] = useState(todo.text)

  const { completed, text, id } = todo

  const handleUpdateTodo = (completedValue: boolean) => {
    updateTodoItem({
      completed: completedValue,
      todoItemId: id,
      text: TodoText
    })
  }

  const handleDeleteTodo = () => {
    deleteTodoItem(id)
  }

  const handleEditTodo = (event?: KeyboardEvent<HTMLInputElement>) => {
    if (event?.key && event.key !== 'Enter' && event.key !== 'Escape') {
      return
    }

    if (event?.key === 'Escape') {
      setTodoText(text)
      setIsEditing(false)

      return
    }

    if (text !== TodoText) {
      handleUpdateTodo(completed)
    }

    setIsEditing(false)
  }

  return (
    <div
      className={`flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 break-all shadow-md ${completed ? 'bg-green-100 text-gray-700 opacity-70' : ''}`}
    >
      <input
        type="checkbox"
        checked={completed}
        onChange={() => handleUpdateTodo(!completed)}
        className="min-h-6 min-w-6 cursor-pointer self-start"
      />
      {isEditing ? (
        <input
          type="text"
          value={TodoText}
          onChange={(e) => setTodoText(e.target.value)}
          onKeyDown={(e) => handleEditTodo(e)}
          onBlur={() => handleEditTodo()}
          autoFocus
          className={`grow px-2 font-medium outline-blue-500 ${isEditing ? 'block' : 'hidden'}`}
        />
      ) : (
        <p className={`grow font-medium ${completed ? 'line-through' : ''}`}>
          {text}
        </p>
      )}
      <button
        onMouseDown={(e) => {
          e.preventDefault() // ✅ Prevents focus loss triggering `onBlur`
          setIsEditing((prevState) => !prevState)
        }}
        className={`flex cursor-pointer items-center justify-center self-start rounded-md ${isEditing ? 'bg-blue-500 text-white' : 'bg-gray-200 text-blue-500'} p-1`}
      >
        <FaPen className="min-h-4 min-w-4 text-inherit" />
      </button>
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
