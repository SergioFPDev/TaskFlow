import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Button } from '../../../components/Button'
import type { Task, TaskStatus } from '../types'
import { formatDate, getMembersByIds, isTaskOverdue, statusMeta } from '../utils'

const Card = styled.article<{ $isDragging?: boolean }>`
  display: grid;
  gap: 1rem;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceStrong};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.soft};
  opacity: ${({ $isDragging }) => ($isDragging ? 0.5 : 1)};
`

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  align-items: start;
`

const Title = styled.div`
  display: grid;
  gap: 0.35rem;

  h3 {
    margin: 0;
    font-size: 1rem;
    line-height: 1.3;
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 0.95rem;
    line-height: 1.5;
  }
`

const Handle = styled.button`
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 1.2rem;
`

const Section = styled.section`
  display: grid;
  gap: 0.55rem;
  padding-top: 0.85rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`

const SectionTitle = styled.span`
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`

const Badge = styled.span<{ $tone?: string; $muted?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.6rem;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ $tone, theme, $muted }) =>
    $muted ? theme.colors.primarySoft : `${$tone ?? theme.colors.primary}22`};
  color: ${({ $tone, theme, $muted }) => ($muted ? theme.colors.text : $tone ?? theme.colors.primary)};
  font-size: 0.82rem;
  font-weight: 700;
`

const AssigneeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  align-items: center;
`

const AssigneeChip = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.35rem 0.55rem 0.35rem 0.35rem;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};

  &:hover > div,
  &:focus-within > div {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
`

const Avatar = styled.span<{ $color: string }>`
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  display: inline-grid;
  place-items: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: #ffffff;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`

const AssigneeName = styled.span`
  font-size: 0.86rem;
  font-weight: 600;
`

const HoverCard = styled.div`
  position: absolute;
  left: 0;
  top: calc(100% + 0.55rem);
  z-index: 6;
  min-width: 180px;
  padding: 0.7rem 0.8rem;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceStrong};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};
  opacity: 0;
  pointer-events: none;
  transform: translateY(6px);
  transition: opacity 0.16s ease, transform 0.16s ease;

  strong {
    display: block;
    font-size: 0.9rem;
  }

  span {
    font-size: 0.82rem;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
`

const ManageRow = styled.div`
  display: grid;
  gap: 0.85rem;
`

const ActionGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`

const ActionLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: ${({ theme }) => theme.radii.pill};
  padding: 0.8rem 1rem;
  font-weight: 700;
  background: ${({ theme }) => theme.colors.primarySoft};
  color: ${({ theme }) => theme.colors.text};
  box-shadow: ${({ theme }) => theme.shadows.soft};
`

const MoveBlock = styled.label`
  display: grid;
  gap: 0.35rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.82rem;
  font-weight: 600;
`

const MoveSelect = styled.select`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.pill};
  padding: 0.65rem 0.85rem;
  background: ${({ theme }) => theme.colors.surfaceStrong};
  color: ${({ theme }) => theme.colors.text};
`

type TaskCardProps = {
  task: Task
  style?: CSSProperties
  isDragging?: boolean
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onMove: (taskId: string, status: TaskStatus) => void
  dragHandleProps?: Record<string, unknown>
}

export function TaskCard({
  task,
  style,
  isDragging,
  onEdit,
  onDelete,
  onMove,
  dragHandleProps,
}: TaskCardProps) {
  const overdue = isTaskOverdue(task)
  const priorityTone = { low: '#2f855a', medium: '#c27803', high: '#c53030' } as const
  const assignees = getMembersByIds(task.assigneeIds)

  return (
    <Card style={style} $isDragging={isDragging}>
      <Top>
        <Title>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
        </Title>
        <Handle aria-label={`Drag ${task.title}`} type="button" {...dragHandleProps}>
          ::
        </Handle>
      </Top>

      <Section>
        <SectionTitle>Overview</SectionTitle>
        <Meta>
          <Badge $tone={statusMeta[task.status].accent}>{statusMeta[task.status].title}</Badge>
          <Badge $tone={priorityTone[task.priority]}>{task.priority}</Badge>
          <Badge $muted>{overdue ? `Overdue ${formatDate(task.dueDate)}` : formatDate(task.dueDate)}</Badge>
          <Badge $muted>{task.comments.length} comments</Badge>
        </Meta>
      </Section>

      <Section>
        <SectionTitle>Assignees</SectionTitle>
        <AssigneeRow>
          {assignees.length > 0 ? (
            assignees.map((member) => (
              <AssigneeChip key={member.id}>
                <Avatar $color={member.color} title={member.name}>
                  {member.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')
                    .slice(0, 2)}
                </Avatar>
                <AssigneeName>{member.name}</AssigneeName>
                <HoverCard>
                  <strong>{member.name}</strong>
                  <span>{member.role}</span>
                </HoverCard>
              </AssigneeChip>
            ))
          ) : (
            <Badge $muted>No assignees</Badge>
          )}
        </AssigneeRow>
      </Section>

      <Section>
        <SectionTitle>Tags</SectionTitle>
        <Tags>
          {task.tags.length > 0 ? task.tags.map((tag) => <Badge key={tag}>#{tag}</Badge>) : <Badge $muted>No tags</Badge>}
        </Tags>
      </Section>

      <Section>
        <SectionTitle>Manage</SectionTitle>
        <ManageRow>
          <ActionGroup>
            <Button type="button" variant="ghost" onClick={() => onEdit(task)}>
              Edit
            </Button>
            <ActionLink to={`/tasks/${task.id}`}>Detail</ActionLink>
            <Button type="button" variant="danger" onClick={() => onDelete(task.id)}>
              Delete
            </Button>
          </ActionGroup>

          <MoveBlock>
            <span>Move to</span>
            <MoveSelect
              aria-label={`Move ${task.title}`}
              value={task.status}
              onChange={(event) => onMove(task.id, event.target.value as TaskStatus)}
            >
              <option value="backlog">Backlog</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </MoveSelect>
          </MoveBlock>
        </ManageRow>
      </Section>
    </Card>
  )
}
