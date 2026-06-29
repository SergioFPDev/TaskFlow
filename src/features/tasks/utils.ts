import type {
  Task,
  TaskActivity,
  TaskComment,
  TaskFilters,
  TaskFormValues,
  TaskPriority,
  TaskStats,
  TaskStatus,
  TeamMember,
} from './types'
import { teamMembers } from './mockData'

export const statusOrder: TaskStatus[] = ['backlog', 'todo', 'in-progress', 'done']
export const defaultActorId = teamMembers[2]?.id ?? 'member-3'

export const statusMeta: Record<TaskStatus, { title: string; accent: string; description: string }> = {
  backlog: {
    title: 'Backlog',
    accent: '#7c3aed',
    description: 'Ideas and incoming work',
  },
  todo: {
    title: 'To Do',
    accent: '#0ea5e9',
    description: 'Ready for pickup',
  },
  'in-progress': {
    title: 'In Progress',
    accent: '#f59e0b',
    description: 'Active execution',
  },
  done: {
    title: 'Done',
    accent: '#10b981',
    description: 'Finished and documented',
  },
}

export const priorityOptions: Array<{ value: TaskPriority | 'all'; label: string }> = [
  { value: 'all', label: 'All priorities' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

export const statusOptions: Array<{ value: TaskStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All statuses' },
  ...statusOrder.map((status) => ({ value: status, label: statusMeta[status].title })),
]

export const emptyFilters: TaskFilters = {
  query: '',
  status: 'all',
  priority: 'all',
  tag: 'all',
}

export function createTask(values: TaskFormValues): Task {
  const timestamp = new Date().toISOString()

  return {
    id: crypto.randomUUID(),
    title: values.title.trim(),
    description: values.description.trim(),
    status: values.status,
    priority: values.priority,
    tags: normalizeTags(values.tags),
    dueDate: values.dueDate || undefined,
    assigneeIds: normalizeIds(values.assigneeIds),
    comments: [],
    activity: [
      createActivity(defaultActorId, 'created', `Created the task in ${statusMeta[values.status].title}.`, timestamp),
    ],
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}

export function updateTaskShape(task: Task, values: TaskFormValues): Task {
  const normalizedTask = normalizeTask(task)
  const updatedAt = new Date().toISOString()
  const nextAssigneeIds = normalizeIds(values.assigneeIds)
  const updates: string[] = []

  if (normalizedTask.status !== values.status) {
    updates.push(`Status changed to ${statusMeta[values.status].title}`)
  }
  if (normalizedTask.priority !== values.priority) {
    updates.push(`Priority changed to ${values.priority}`)
  }
  if (normalizedTask.title.trim() !== values.title.trim()) {
    updates.push('Title updated')
  }
  if (normalizedTask.description.trim() !== values.description.trim()) {
    updates.push('Description updated')
  }
  if (normalizedTask.dueDate !== (values.dueDate || undefined)) {
    updates.push(values.dueDate ? `Deadline set to ${formatDate(values.dueDate)}` : 'Deadline cleared')
  }
  if (normalizedTask.assigneeIds.join('|') !== nextAssigneeIds.join('|')) {
    updates.push('Team assignments updated')
  }

  const activity = updates.length > 0
    ? [...normalizedTask.activity, createActivity(defaultActorId, 'updated', updates.join('. '), updatedAt)]
    : normalizedTask.activity

  return {
    ...normalizedTask,
    title: values.title.trim(),
    description: values.description.trim(),
    status: values.status,
    priority: values.priority,
    tags: normalizeTags(values.tags),
    dueDate: values.dueDate || undefined,
    assigneeIds: nextAssigneeIds,
    activity,
    updatedAt,
  }
}

export function moveTaskShape(task: Task, status: TaskStatus, movedAt = new Date().toISOString()): Task {
  const normalizedTask = normalizeTask(task)

  if (normalizedTask.status === status) {
    return normalizedTask
  }

  return {
    ...normalizedTask,
    status,
    updatedAt: movedAt,
    activity: [
      ...normalizedTask.activity,
      createActivity(defaultActorId, 'moved', `Moved the task to ${statusMeta[status].title}.`, movedAt),
    ],
  }
}

export function addCommentToTask(task: Task, authorId: string, message: string): Task {
  const normalizedTask = normalizeTask(task)
  const normalizedMessage = message.trim()
  if (!normalizedMessage) {
    return normalizedTask
  }

  const createdAt = new Date().toISOString()
  const comment: TaskComment = {
    id: crypto.randomUUID(),
    authorId,
    message: normalizedMessage,
    createdAt,
  }

  return {
    ...normalizedTask,
    comments: [...normalizedTask.comments, comment],
    updatedAt: createdAt,
    activity: [
      ...normalizedTask.activity,
      createActivity(authorId, 'commented', 'Added a new comment.', createdAt),
    ],
  }
}

export function normalizeTask(task: Partial<Task> & Pick<Task, 'id' | 'title' | 'description' | 'status' | 'priority' | 'tags' | 'createdAt' | 'updatedAt'>): Task {
  return {
    ...task,
    dueDate: task.dueDate || undefined,
    assigneeIds: normalizeIds(task.assigneeIds ?? []),
    comments: Array.isArray(task.comments) ? task.comments : [],
    activity: Array.isArray(task.activity)
      ? task.activity
      : [createActivity(defaultActorId, 'created', 'Task record prepared for the current board format.', task.createdAt)],
    tags: normalizeTags(task.tags ?? []),
  }
}

export function normalizeTasks(tasks: Task[] = []): Task[] {
  return tasks.map((task) => normalizeTask(task))
}

export function normalizeTags(tags: string[] = []): string[] {
  return Array.from(new Set(tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean)))
}

export function normalizeIds(ids: string[] = []): string[] {
  return Array.from(new Set(ids.map((id) => id.trim()).filter(Boolean)))
}

export function createActivity(
  actorId: string,
  type: TaskActivity['type'],
  message: string,
  createdAt = new Date().toISOString(),
): TaskActivity {
  return {
    id: crypto.randomUUID(),
    actorId,
    type,
    message,
    createdAt,
  }
}

export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  const query = filters.query.trim().toLowerCase()

  return normalizeTasks(tasks).filter((task) => {
    const matchesQuery =
      query.length === 0 ||
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query) ||
      task.tags.some((tag) => tag.includes(query)) ||
      getMembersByIds(task.assigneeIds).some((member) => member.name.toLowerCase().includes(query))

    const matchesStatus = filters.status === 'all' || task.status === filters.status
    const matchesPriority = filters.priority === 'all' || task.priority === filters.priority
    const matchesTag = filters.tag === 'all' || task.tags.includes(filters.tag)

    return matchesQuery && matchesStatus && matchesPriority && matchesTag
  })
}

export function calculateStats(tasks: Task[]): TaskStats {
  const normalizedTasks = normalizeTasks(tasks)

  return {
    total: normalizedTasks.length,
    completed: normalizedTasks.filter((task) => task.status === 'done').length,
    overdue: normalizedTasks.filter((task) => isTaskOverdue(task)).length,
    highPriority: normalizedTasks.filter((task) => task.priority === 'high').length,
  }
}

export function isTaskOverdue(task: Task): boolean {
  if (!task.dueDate || task.status === 'done') {
    return false
  }

  const today = new Date().toISOString().slice(0, 10)
  return task.dueDate < today
}

export function formatDate(date?: string): string {
  if (!date) {
    return 'No deadline'
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string): string {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date))
}

export function getTaskTags(tasks: Task[]): string[] {
  return Array.from(new Set(normalizeTasks(tasks).flatMap((task) => task.tags))).sort()
}

export function getTaskFormValues(task?: Task): TaskFormValues {
  const normalizedTask = task ? normalizeTask(task) : undefined

  return {
    title: normalizedTask?.title ?? '',
    description: normalizedTask?.description ?? '',
    status: normalizedTask?.status ?? 'todo',
    priority: normalizedTask?.priority ?? 'medium',
    tags: normalizedTask?.tags ?? [],
    dueDate: normalizedTask?.dueDate ?? '',
    assigneeIds: normalizedTask?.assigneeIds ?? [],
  }
}

export function getMembersByIds(ids: string[] = []): TeamMember[] {
  return ids
    .map((id) => teamMembers.find((member) => member.id === id))
    .filter((member): member is TeamMember => Boolean(member))
}

export function toExportPayload(tasks: Task[]) {
  return {
    exportedAt: new Date().toISOString(),
    teamMembers,
    tasks: normalizeTasks(tasks),
  }
}

export function tasksToCsv(tasks: Task[]): string {
  const header = [
    'id',
    'title',
    'description',
    'status',
    'priority',
    'dueDate',
    'tags',
    'assignees',
    'commentsCount',
    'activityCount',
    'createdAt',
    'updatedAt',
  ]

  const rows = normalizeTasks(tasks).map((task) => [
    task.id,
    task.title,
    task.description,
    task.status,
    task.priority,
    task.dueDate ?? '',
    task.tags.join('|'),
    getMembersByIds(task.assigneeIds)
      .map((member) => member.name)
      .join('|'),
    String(task.comments.length),
    String(task.activity.length),
    task.createdAt,
    task.updatedAt,
  ])

  return [header, ...rows]
    .map((row) => row.map((cell) => escapeCsvCell(cell)).join(','))
    .join('\n')
}

function escapeCsvCell(value: string): string {
  const escaped = value.replaceAll('"', '""')
  return `"${escaped}"`
}
