import CreateTodoListForm from '../../components/CreateTodoListForm'
import { useTodoLists } from '../../hooks/useTodoLists'
import TodoListCard from '../../components/TodoListCard'

const DashboardPage = () => {
  const { data: todoLists, isSuccess } = useTodoLists()

  if (!isSuccess) {
    return <div>Loading...</div>
  }

  return (
    <main className="flex min-h-[calc(100vh-48px)] flex-col gap-4 p-4 md:px-20 lg:px-40 xl:px-60">
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
