import styled from 'styled-components'
import { TaskFilters, TaskPriority, TaskStatus } from '../features/tasks/types'
import { priorityOptions, statusOptions } from '../features/tasks/utils'
import { Button } from './Button'

const Wrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: end;
`

const Field = styled.label`
  display: grid;
  gap: 0.4rem;
  min-width: 180px;
  color: ${({ theme }) => theme.colors.textMuted};
`

const Select = styled.select`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceStrong};
  color: ${({ theme }) => theme.colors.text};
  padding: 0.85rem 1rem;
`

type FilterBarProps = {
  filters: TaskFilters
  availableTags: string[]
  onChange: (filters: Partial<TaskFilters>) => void
  onReset: () => void
}

export function FilterBar({ filters, availableTags, onChange, onReset }: FilterBarProps) {
  return (
    <Wrap>
      <Field>
        <span>Status</span>
        <Select
          aria-label="Filter by status"
          value={filters.status}
          onChange={(event) => onChange({ status: event.target.value as TaskStatus | 'all' })}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </Field>

      <Field>
        <span>Priority</span>
        <Select
          aria-label="Filter by priority"
          value={filters.priority}
          onChange={(event) => onChange({ priority: event.target.value as TaskPriority | 'all' })}
        >
          {priorityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </Field>

      <Field>
        <span>Tag</span>
        <Select
          aria-label="Filter by tag"
          value={filters.tag}
          onChange={(event) => onChange({ tag: event.target.value })}
        >
          <option value="all">All tags</option>
          {availableTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </Select>
      </Field>

      <Button type="button" variant="ghost" onClick={onReset}>
        Reset filters
      </Button>
    </Wrap>
  )
}
