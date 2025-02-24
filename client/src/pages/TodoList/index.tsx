import { useCallback, useEffect } from 'react'
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

  const handleTodoItemCreated = useCallback(
    (createdTodoItem: TodoItem) => {
      console.log('Received todoItemCreated event: ', createdTodoItem)
      refetch()
    },
    [refetch]
  )

  const handleTodoItemUpdated = useCallback(
    (updatedTodoItem: TodoItem) => {
      console.log('Received todoItemUpdated event: ', updatedTodoItem)
      refetch()
    },
    [refetch]
  )

  const handleTodoItemDeleted = useCallback(
    (deletedTodoItem: TodoItem) => {
      console.log('Received todoItemDeleted event: ', deletedTodoItem)
      refetch()
    },
    [refetch]
  )

  useEffect(() => {
    socketClient.connect()
    console.log('Connected to socket.io')
    socketClient.emit('joinTodoList', todoListUUID)

    socketClient.on('todoItemCreated', handleTodoItemCreated)
    socketClient.on('todoItemUpdated', handleTodoItemUpdated)
    socketClient.on('todoItemDeleted', handleTodoItemDeleted)

    return () => {
      socketClient.off('todoItemCreated', handleTodoItemCreated)
      socketClient.off('todoItemUpdated', handleTodoItemUpdated)
      socketClient.off('todoItemDeleted', handleTodoItemDeleted)

      socketClient.disconnect()
      console.log('Disconnected from socket.io')
    }
  }, [
    todoListUUID,
    handleTodoItemCreated,
    handleTodoItemUpdated,
    handleTodoItemDeleted
  ])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!data) {
    return <div>Todo list not found</div>
  }

  const { id: listId, name, todos } = data

  return (
    <main className="min-h-[calc(100vh-48px)] p-4 md:px-20 lg:px-40 xl:px-60">
      <h1 className="my-3 text-center text-2xl font-bold">{name}</h1>
      <CreateTodoItemForm listId={listId} />
      <TodoListTabView todos={todos} />
    </main>
  )
}

export default TodoListPage
