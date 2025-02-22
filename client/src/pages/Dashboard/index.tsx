import { useEffect, useState } from 'react'
import TodoListForm from '../../components/TodoListForm'

interface TodoList {
  uuid: string
  name: string
}

const DashboardPage = () => {
  const [todoLists, setTodoLists] = useState<TodoList[]>([])

  useEffect(() => {
    const fetchTodoLists = async () => {
      const response = await fetch('/api/todo-lists')
      const result = await response.json()

      setTodoLists(result)
    }

    fetchTodoLists()
  }, [])

  return (
    <main className="p-4">
      <TodoListForm />
      {todoLists.map((todoList) => (
        <div
          key={todoList.uuid}
          className="mb-4 rounded-md bg-white p-4 shadow"
        >
          <h2 className="text-xl font-semibold">{todoList.name}</h2>
        </div>
      ))}
    </main>
  )
}

export default DashboardPage
