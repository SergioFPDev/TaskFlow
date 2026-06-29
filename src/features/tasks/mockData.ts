import type { TeamMember, Task } from './types'

export const teamMembers: TeamMember[] = [
  { id: 'member-1', name: 'Ava Stone', role: 'Product Designer', color: '#0ea5e9' },
  { id: 'member-2', name: 'Leo Kim', role: 'Frontend Engineer', color: '#7c3aed' },
  { id: 'member-3', name: 'Maya Patel', role: 'Project Manager', color: '#10b981' },
  { id: 'member-4', name: 'Noah Reed', role: 'QA Analyst', color: '#f59e0b' },
]

export function createSeedTasks(): Task[] {
  return [
    {
      id: 'task-1',
      title: 'Audit onboarding flow',
      description: 'Review the first-run steps, identify friction and define three measurable improvements for the next sprint.',
      status: 'backlog',
      priority: 'medium',
      tags: ['ux', 'research'],
      dueDate: '2026-07-06',
      assigneeIds: ['member-1', 'member-3'],
      comments: [
        {
          id: 'comment-1',
          authorId: 'member-3',
          message: 'Keep an eye on the mobile signup drop-off in the findings.',
          createdAt: '2026-06-25T10:30:00.000Z',
        },
      ],
      activity: [
        {
          id: 'activity-1',
          actorId: 'member-3',
          type: 'created',
          message: 'Created the task and linked it to the onboarding review sprint.',
          createdAt: '2026-06-20T09:00:00.000Z',
        },
        {
          id: 'activity-2',
          actorId: 'member-1',
          type: 'updated',
          message: 'Added research framing and expanded the expected deliverables.',
          createdAt: '2026-06-26T09:00:00.000Z',
        },
      ],
      createdAt: '2026-06-20T09:00:00.000Z',
      updatedAt: '2026-06-26T09:00:00.000Z',
    },
    {
      id: 'task-2',
      title: 'Ship analytics dashboard',
      description: 'Implement the KPI cards, chart placeholders and empty states for customer success.',
      status: 'todo',
      priority: 'high',
      tags: ['frontend', 'analytics'],
      dueDate: '2026-07-02',
      assigneeIds: ['member-2'],
      comments: [],
      activity: [
        {
          id: 'activity-3',
          actorId: 'member-2',
          type: 'created',
          message: 'Created the dashboard delivery task.',
          createdAt: '2026-06-22T11:15:00.000Z',
        },
      ],
      createdAt: '2026-06-22T11:15:00.000Z',
      updatedAt: '2026-06-27T08:30:00.000Z',
    },
    {
      id: 'task-3',
      title: 'Prepare sprint demo notes',
      description: 'Collect release highlights, blockers and short clips for the Friday stakeholder review.',
      status: 'in-progress',
      priority: 'low',
      tags: ['ops'],
      dueDate: '2026-07-01',
      assigneeIds: ['member-3', 'member-4'],
      comments: [
        {
          id: 'comment-2',
          authorId: 'member-4',
          message: 'I can provide the QA retest clip once the latest patch is merged.',
          createdAt: '2026-06-28T16:20:00.000Z',
        },
      ],
      activity: [
        {
          id: 'activity-4',
          actorId: 'member-3',
          type: 'created',
          message: 'Created the demo prep task for Friday review.',
          createdAt: '2026-06-18T13:45:00.000Z',
        },
        {
          id: 'activity-5',
          actorId: 'member-3',
          type: 'moved',
          message: 'Moved the task to In Progress.',
          createdAt: '2026-06-28T15:20:00.000Z',
        },
      ],
      createdAt: '2026-06-18T13:45:00.000Z',
      updatedAt: '2026-06-28T15:20:00.000Z',
    },
    {
      id: 'task-4',
      title: 'Close API bug triage',
      description: 'Validate fixes from backend and mark the incidents ready for QA retest.',
      status: 'done',
      priority: 'high',
      tags: ['backend', 'qa'],
      dueDate: '2026-06-25',
      assigneeIds: ['member-4'],
      comments: [],
      activity: [
        {
          id: 'activity-6',
          actorId: 'member-4',
          type: 'created',
          message: 'Created the bug triage closure task.',
          createdAt: '2026-06-15T10:30:00.000Z',
        },
        {
          id: 'activity-7',
          actorId: 'member-4',
          type: 'moved',
          message: 'Moved the task to Done after QA validation.',
          createdAt: '2026-06-25T17:40:00.000Z',
        },
      ],
      createdAt: '2026-06-15T10:30:00.000Z',
      updatedAt: '2026-06-25T17:40:00.000Z',
    },
  ]
}
