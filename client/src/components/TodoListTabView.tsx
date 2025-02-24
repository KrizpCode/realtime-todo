import { useState } from 'react'

import { TodoItem } from '../types/todoItem'
import TodoItemCard from './TodoItemCard'
import TodoListTab, { TodoListTabViewName } from './TodoListTab'

interface TodoListTabViewProps {
  todos: TodoItem[]
}

const TodoListTabView = ({ todos }: TodoListTabViewProps) => {
  const [currentTab, setCurrentTab] = useState<TodoListTabViewName>('all')

  const filteredTodos = todos.filter((todo) => {
    if (currentTab === 'active') {
      return !todo.completed
    }

    if (currentTab === 'completed') {
      return todo.completed
    }

    return true
  })

  const handleTabClick = (tabName: TodoListTabViewName) => {
    if (tabName !== currentTab) {
      setCurrentTab(tabName)
    }
  }

  const tabs = ['all', 'active', 'completed'] as TodoListTabViewName[]

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        {tabs.map((tabName: TodoListTabViewName) => (
          <TodoListTab
            key={tabName}
            tabName={tabName}
            currentTab={currentTab}
            handleTabClick={handleTabClick}
          />
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo) => {
            return <TodoItemCard key={todo.id} todo={todo} />
          })
        ) : (
          <div className="bg-gray-100 px-3 py-2 font-medium text-gray-500">
            No todo's to show here
          </div>
        )}
      </div>
    </div>
  )
}

export default TodoListTabView
