import { Link } from '@tanstack/react-router'
import { TodoList } from '../types/todoList'

interface TodoListCardProps {
  todoList: TodoList
}

const TodoListCard = ({ todoList }: TodoListCardProps) => {
  return (
    <Link
      key={todoList.uuid}
      to="/todo-lists/$todoListUUID"
      params={{ todoListUUID: todoList.uuid }}
      preload="intent"
      className="block"
    >
      <div
        key={todoList.uuid}
        className="flex items-center gap-2 rounded-md border border-gray-300 p-4 py-2 shadow hover:bg-blue-200"
      >
        <h2 className="text-xl font-semibold">{todoList.name}</h2>
      </div>
    </Link>
  )
}

export default TodoListCard
