import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Task, TaskStatus } from '../types'
import { TaskCard } from './TaskCard'

type SortableTaskCardProps = {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onMove: (taskId: string, status: TaskStatus) => void
}

export function SortableTaskCard({ task, onEdit, onDelete, onMove }: SortableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.15 : 1,
      }}
    >
      <TaskCard
        task={task}
        isDragging={isDragging}
        onEdit={onEdit}
        onDelete={onDelete}
        onMove={onMove}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  )
}
