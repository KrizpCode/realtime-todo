import { useUpdateTodoItem } from '../hooks/useTodoItems'
import { TodoItem } from '../types/todoItem'

interface TodoItemProps {
  todo: TodoItem
  todoListUUID: string
}

const TodoItemCard = ({ todo, todoListUUID }: TodoItemProps) => {
  const { mutate } = useUpdateTodoItem(todoListUUID)
  const { completed, text, id } = todo

  const handleUpdateTodo = () => {
    mutate({ completed: !completed, todoItemId: id })
  }

  return (
    <div className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1 shadow-md">
      <input
        type="checkbox"
        checked={completed}
        onChange={() => handleUpdateTodo()}
      />
      <p className="grow">{text}</p>
      <button className="flex items-center justify-center rounded-md bg-red-400 px-2">
        <span className="font-medium text-white">X</span>
      </button>
    </div>
  )
}

export default TodoItemCard
