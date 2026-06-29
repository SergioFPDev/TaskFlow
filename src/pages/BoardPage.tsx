import { useMemo, useState } from 'react'
import styled from 'styled-components'
import { Button } from '../components/Button'
import { FilterBar } from '../components/FilterBar'
import { SearchBar } from '../components/SearchBar'
import { Board } from '../features/tasks/components/Board'
import { TaskModal } from '../features/tasks/components/TaskModal'
import { useTaskStore } from '../features/tasks/taskStore'
import type { Task } from '../features/tasks/types'
import { calculateStats, filterTasks, getTaskTags, tasksToCsv, toExportPayload } from '../features/tasks/utils'

const Stack = styled.div`
  display: grid;
  gap: 1.25rem;
`

const Hero = styled.section`
  display: grid;
  gap: 1rem;
  padding: clamp(1.25rem, 4vw, 2rem);
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.gradients.hero};
  border: 1px solid ${({ theme }) => theme.colors.border};
`

const HeroTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;

  h2 {
    margin: 0;
    font-size: clamp(2rem, 4vw, 3.2rem);
  }

  p {
    margin: 0.5rem 0 0;
    color: ${({ theme }) => theme.colors.textMuted};
    max-width: 680px;
  }
`

const Stats = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(4, minmax(140px, 1fr));

  @media (max-width: 880px) {
    grid-template-columns: repeat(2, minmax(140px, 1fr));
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`

const StatCard = styled.article`
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};

  strong {
    display: block;
    font-size: 1.8rem;
    margin-bottom: 0.25rem;
  }

  span {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`

const Toolbar = styled.section`
  display: grid;
  gap: 1rem;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
`

const ToolbarTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: end;
`

const ToolbarActions = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`

const Empty = styled.section`
  padding: 2rem;
  text-align: center;
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};

  h3 {
    margin-top: 0;
  }

  p {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export function BoardPage() {
  const tasks = useTaskStore((state) => state.tasks)
  const filters = useTaskStore((state) => state.filters)
  const addTask = useTaskStore((state) => state.addTask)
  const updateTask = useTaskStore((state) => state.updateTask)
  const deleteTask = useTaskStore((state) => state.deleteTask)
  const setFilters = useTaskStore((state) => state.setFilters)
  const clearFilters = useTaskStore((state) => state.clearFilters)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()

  const visibleTasks = useMemo(() => filterTasks(tasks, filters), [tasks, filters])
  const stats = useMemo(() => calculateStats(tasks), [tasks])
  const tags = useMemo(() => getTaskTags(tasks), [tasks])

  const openCreate = () => {
    setEditingTask(undefined)
    setIsModalOpen(true)
  }

  const openEdit = (task: Task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  return (
    <Stack>
      <Hero>
        <HeroTop>
          <div>
            <h2>Run the board like a real team.</h2>
            <p>
              Build, prioritize and ship work across a Kanban flow with persistent state,
              quick editing, task detail pages and a drag-and-drop board.
            </p>
          </div>
        </HeroTop>

        <Stats>
          <StatCard>
            <strong>{stats.total}</strong>
            <span>Total tasks</span>
          </StatCard>
          <StatCard>
            <strong>{stats.completed}</strong>
            <span>Completed</span>
          </StatCard>
          <StatCard>
            <strong>{stats.overdue}</strong>
            <span>Overdue</span>
          </StatCard>
          <StatCard>
            <strong>{stats.highPriority}</strong>
            <span>High priority</span>
          </StatCard>
        </Stats>
      </Hero>

      <Toolbar>
        <ToolbarTop>
          <SearchBar value={filters.query} onChange={(query) => setFilters({ query })} />
          <ToolbarActions>
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                downloadFile(
                  'taskflow-board.json',
                  JSON.stringify(toExportPayload(tasks), null, 2),
                  'application/json',
                )
              }
            >
              Export JSON
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                downloadFile('taskflow-board.csv', tasksToCsv(tasks), 'text/csv;charset=utf-8')
              }
            >
              Export CSV
            </Button>
            <Button type="button" variant="secondary" onClick={openCreate}>
              Add task
            </Button>
          </ToolbarActions>
        </ToolbarTop>
        <FilterBar filters={filters} availableTags={tags} onChange={setFilters} onReset={clearFilters} />
      </Toolbar>

      {visibleTasks.length > 0 ? (
        <Board tasks={visibleTasks} onEdit={openEdit} onDelete={deleteTask} />
      ) : (
        <Empty>
          <h3>No tasks match the current filters.</h3>
          <p>Reset the filters or create a fresh task to keep the board moving.</p>
          <Button type="button" variant="ghost" onClick={clearFilters}>
            Clear filters
          </Button>
        </Empty>
      )}

      <TaskModal
        open={isModalOpen}
        task={editingTask}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(values) => {
          if (editingTask) {
            updateTask(editingTask.id, values)
          } else {
            addTask(values)
          }
          setIsModalOpen(false)
        }}
      />
    </Stack>
  )
}
