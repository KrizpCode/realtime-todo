import CreateTodoListForm from '../../components/CreateTodoListForm'
import { useTodoLists } from '../../hooks/useTodoLists'

const DashboardPage = () => {
  const { data: todoLists, isSuccess } = useTodoLists()

  if (!isSuccess) {
    return <div>Loading...</div>
  }

  return (
    <main className="p-4">
      <CreateTodoListForm />
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
