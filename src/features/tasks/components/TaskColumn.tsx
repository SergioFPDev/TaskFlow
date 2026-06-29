import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import styled from 'styled-components'
import { statusMeta } from '../utils'
import type { Task, TaskStatus } from '../types'
import { SortableTaskCard } from './SortableTaskCard'

const Column = styled.section<{ $accent: string; $over?: boolean }>`
  display: grid;
  gap: 1rem;
  align-content: start;
  min-height: 480px;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme, $accent, $over }) =>
    $over ? `${$accent}18` : theme.colors.surface};
  backdrop-filter: blur(12px);
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  align-items: start;

  h2 {
    margin: 0;
    font-size: 1.1rem;
  }

  p {
    margin: 0.25rem 0 0;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 0.92rem;
  }
`

const Count = styled.span`
  padding: 0.4rem 0.65rem;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.primarySoft};
  font-weight: 700;
`

const Empty = styled.div`
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
`

type TaskColumnProps = {
  status: TaskStatus
  tasks: Task[]
  isHighlighted?: boolean
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onMove: (taskId: string, status: TaskStatus) => void
}

export function TaskColumn({
  status,
  tasks,
  isHighlighted,
  onEdit,
  onDelete,
  onMove,
}: TaskColumnProps) {
  const meta = statusMeta[status]
  const { isOver, setNodeRef } = useDroppable({ id: status })

  return (
    <Column ref={setNodeRef} $accent={meta.accent} $over={isOver || isHighlighted}>
      <Header>
        <div>
          <h2>{meta.title}</h2>
          <p>{meta.description}</p>
        </div>
        <Count>{tasks.length}</Count>
      </Header>

      <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <SortableTaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onMove={onMove}
            />
          ))
        ) : (
          <Empty>Drop a task here or create a new one.</Empty>
        )}
      </SortableContext>
    </Column>
  )
}
