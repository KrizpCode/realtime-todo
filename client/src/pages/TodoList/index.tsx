import { useEffect } from 'react'
import { useParams } from '@tanstack/react-router'

import { useTodoList } from '../../hooks/useTodoLists'
import CreateTodoItemForm from '../../components/CreateTodoItemForm'
import socketClient from '../../services/socketClient'
import { TodoItem } from '../../types/todoItem'
import TodoListTabView from '../../components/TodoListTabView'

const TodoListPage = () => {
  const { todoListUUID } = useParams({
    from: '/_auth/todo-lists/$todoListUUID'
  })
  const { data, isLoading, refetch } = useTodoList(todoListUUID)

  useEffect(() => {
    socketClient.connect()
    console.log('Connected to socket.io')
    socketClient.emit('joinTodoList', todoListUUID)

    const handleTodoItemEvent = (event: string, todoItem: TodoItem) => {
      console.log(`Received ${event} event: `, todoItem)
      refetch()
    }

    socketClient.on('todoItemCreated', (createdTodoItem: TodoItem) =>
      handleTodoItemEvent('todoItemCreated', createdTodoItem)
    )

    socketClient.on('todoItemUpdated', (updatedTodoItem: TodoItem) =>
      handleTodoItemEvent('todoItemUpdated', updatedTodoItem)
    )

    socketClient.on('todoItemDeleted', (deletedTodoItem: TodoItem) =>
      handleTodoItemEvent('todoItemDeleted', deletedTodoItem)
    )

    return () => {
      socketClient.off('todoItemCreated', handleTodoItemEvent)
      socketClient.off('todoItemUpdated', handleTodoItemEvent)
      socketClient.off('todoItemDeleted', handleTodoItemEvent)

      socketClient.disconnect()
      console.log('Disconnected from socket.io')
    }
  }, [todoListUUID, refetch])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!data) {
    return <div>Todo list not found</div>
  }

  const { id: listId, name, todos } = data

  return (
    <main className="min-h-[calc(100vh-48px)] p-4 md:px-20 lg:px-40 xl:px-60">
      <CreateTodoItemForm listId={listId} />
      <h1 className="my-3 text-center text-2xl font-bold">{name}</h1>
      <TodoListTabView todos={todos} />
    </main>
  )
}

export default TodoListPage
