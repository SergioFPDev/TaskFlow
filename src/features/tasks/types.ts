export type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export type TeamMember = {
  id: string
  name: string
  role: string
  color: string
}

export type TaskComment = {
  id: string
  authorId: string
  message: string
  createdAt: string
}

export type TaskActivity = {
  id: string
  actorId: string
  type: 'created' | 'updated' | 'moved' | 'commented'
  message: string
  createdAt: string
}

export type Task = {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  tags: string[]
  dueDate?: string
  assigneeIds: string[]
  comments: TaskComment[]
  activity: TaskActivity[]
  createdAt: string
  updatedAt: string
}

export type TaskFilters = {
  query: string
  status: TaskStatus | 'all'
  priority: TaskPriority | 'all'
  tag: string | 'all'
}

export type TaskFormValues = {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  tags: string[]
  dueDate?: string
  assigneeIds: string[]
}

export type TaskStats = {
  total: number
  completed: number
  overdue: number
  highPriority: number
}

export type StatusMeta = {
  title: string
  accent: string
  description: string
}
