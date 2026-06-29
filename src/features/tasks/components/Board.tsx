import {
  DragOverlay,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type {
  CollisionDetection,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useState } from 'react'
import styled from 'styled-components'
import { useTaskStore } from '../taskStore'
import { statusOrder } from '../utils'
import type { Task, TaskStatus } from '../types'
import { TaskCard } from './TaskCard'
import { TaskColumn } from './TaskColumn'

const BoardGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(4, minmax(260px, 1fr));
  overflow-x: auto;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(260px, 1fr));
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`

const collisionDetection: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args)

  if (pointerCollisions.length > 0) {
    return pointerCollisions
  }

  return rectIntersection(args)
}

type BoardProps = {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
}

export function Board({ tasks, onEdit, onDelete }: BoardProps) {
  const allTasks = useTaskStore((state) => state.tasks)
  const moveTask = useTaskStore((state) => state.moveTask)
  const setTasks = useTaskStore((state) => state.setTasks)
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [highlightedStatus, setHighlightedStatus] = useState<TaskStatus | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const activeTask = activeTaskId
    ? allTasks.find((task) => task.id === activeTaskId) ?? null
    : null

  const handleMove = (taskId: string, status: TaskStatus) => {
    moveTask(taskId, status)
  }

  const resolveStatusFromOverId = (overId: string): TaskStatus | null => {
    if (statusOrder.includes(overId as TaskStatus)) {
      return overId as TaskStatus
    }

    return allTasks.find((task) => task.id === overId)?.status ?? null
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTaskId(String(event.active.id))
  }

  const handleDragOver = (event: DragOverEvent) => {
    if (!event.over) {
      setHighlightedStatus(null)
      return
    }

    setHighlightedStatus(resolveStatusFromOverId(String(event.over.id)))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTaskId(null)
    setHighlightedStatus(null)

    if (!over || active.id === over.id) {
      return
    }

    const activeTask = allTasks.find((task) => task.id === active.id)
    if (!activeTask) {
      return
    }

    const overTask = allTasks.find((task) => task.id === over.id)
    if (!overTask) {
      handleMove(activeTask.id, over.id as TaskStatus)
      return
    }

    const activeIndex = allTasks.findIndex((task) => task.id === active.id)
    const overIndex = allTasks.findIndex((task) => task.id === over.id)
    const nextTasks = arrayMove(allTasks, activeIndex, overIndex).map((task) =>
      task.id === activeTask.id
        ? { ...task, status: overTask.status, updatedAt: new Date().toISOString() }
        : task,
    )

    setTasks(nextTasks)
  }

  const handleDragCancel = () => {
    setActiveTaskId(null)
    setHighlightedStatus(null)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <BoardGrid>
        {statusOrder.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks.filter((task) => task.status === status)}
            isHighlighted={highlightedStatus === status}
            onEdit={onEdit}
            onDelete={onDelete}
            onMove={handleMove}
          />
        ))}
      </BoardGrid>

      <DragOverlay zIndex={2000}>
        {activeTask ? (
          <TaskCard
            task={activeTask}
            onEdit={onEdit}
            onDelete={onDelete}
            onMove={handleMove}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
