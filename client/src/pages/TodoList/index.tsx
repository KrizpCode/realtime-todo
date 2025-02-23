import { useParams } from '@tanstack/react-router'

import { useTodoList } from '../../hooks/useTodoLists'
import CreateTodoItemForm from '../../components/CreateTodoItemForm'
import TodoItemCard from '../../components/TodoItemCard'

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
    <main className="p-4">
      <h1 className="text-2xl font-bold">{name}</h1>
      <CreateTodoItemForm listId={listId} />
      <div className="mt-6 flex flex-col gap-2">
        {todos.map((todo) => {
          return (
            <TodoItemCard
              key={todo.id}
              todo={todo}
              todoListUUID={params.todoListUUID}
            />
          )
        })}
      </div>
    </main>
  )
}

export default TodoListPage
