import CreateTodoListForm from '../../components/CreateTodoListForm'
import { useTodoLists } from '../../hooks/useTodoLists'
import TodoListCard from '../../components/TodoListCard'
import { useAuth } from '../../hooks/useAuth'

const DashboardPage = () => {
  const { data: todoLists, isSuccess } = useTodoLists()
  const { user } = useAuth()

  if (!isSuccess) {
    return <div>Loading...</div>
  }

  return (
    <main className="flex min-h-[calc(100vh-48px)] flex-col gap-4 p-4 md:px-20 lg:px-40 xl:px-60">
      <div className="mt-2">
        <h1 className="text-center text-xl font-bold">Welcome {user?.name}!</h1>
        <p className="ml-1 text-center text-sm">{`(${user?.email})`}</p>
        <p className="mt-2 text-center opacity-70">
          Here are are your todo lists.
        </p>
      </div>
      <CreateTodoListForm />
      <div className="flex flex-col gap-3">
        {todoLists.length > 0 ? (
          todoLists.map((todoList) => (
            <TodoListCard key={todoList.id} todoList={todoList} />
          ))
        ) : (
          <div className="bg-gray-100 p-4 py-2 text-lg font-medium text-gray-500">
            You have no todo lists yet
          </div>
        )}
      </div>
    </main>
  )
}

export default DashboardPage
