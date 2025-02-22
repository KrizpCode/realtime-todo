import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import TodoListPage from '../../../pages/TodoList'
import { todoListQueryOptions } from '../../../hooks/useTodoLists'

export const Route = createFileRoute('/_auth/todo-lists/$todoListUUID')({
  params: {
    parse: (params) => ({
      todoListUUID: z.string().uuid().parse(params.todoListUUID)
    })
  },
  loader: (opts) =>
    opts.context.queryClient.ensureQueryData(
      todoListQueryOptions(opts.params.todoListUUID)
    ),
  component: TodoListPage
})
