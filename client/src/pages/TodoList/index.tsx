import { useParams } from '@tanstack/react-router'

const TodoListPage = () => {
  const params = useParams({ from: '/_auth/todo-lists/$todoListUUID' })

  return (
    <div>
      <div>TodoListPage - {params.todoListUUID}</div>
    </div>
  )
}

export default TodoListPage
