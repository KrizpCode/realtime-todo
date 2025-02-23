import { useParams } from '@tanstack/react-router'

import { useTodoList } from '../../hooks/useTodoLists'

const TodoListPage = () => {
  const params = useParams({ from: '/_auth/todo-lists/$todoListUUID' })
  const { data, isLoading } = useTodoList(params.todoListUUID)

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!data) {
    return <div>Todo list not found</div>
  }

  const { name, todos } = data

  return (
    <div>
      <h1>{name}</h1>
      {todos.map((todo) => {
        return <div key={todo.id}>{todo.id}</div>
      })}
    </div>
  )
}

export default TodoListPage
