import { useParams } from '@tanstack/react-router'

import { useTodoList } from '../../hooks/useTodoLists'
import CreateTodoItemForm from '../../components/CreateTodoItemForm'

const TodoListPage = () => {
  const params = useParams({ from: '/_auth/todo-lists/$todoListUUID' })
  const { data, isLoading } = useTodoList(params.todoListUUID)

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!data) {
    return <div>Todo list not found</div>
  }

  const { id: listId, name, todos } = data

  return (
    <div>
      <h1>{name}</h1>
      <CreateTodoItemForm listId={listId} />
      {todos.map((todo) => {
        return <div key={todo.id}>{todo.text}</div>
      })}
    </div>
  )
}

export default TodoListPage
