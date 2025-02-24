export type TodoListTabViewName = 'all' | 'active' | 'completed'

interface TodoListTabProps {
  currentTab: TodoListTabViewName
  tabName: TodoListTabViewName
  handleTabClick: (tabName: TodoListTabViewName) => void
}

const TodoListTab = ({
  tabName,
  currentTab,
  handleTabClick
}: TodoListTabProps) => {
  return (
    <button
      onClick={() => handleTabClick(tabName)}
      className={`cursor-pointer rounded px-3 py-1 text-sm font-medium capitalize ${
        tabName === currentTab ? 'bg-blue-500 text-white' : 'bg-gray-200'
      }`}
    >
      {tabName}
    </button>
  )
}

export default TodoListTab
