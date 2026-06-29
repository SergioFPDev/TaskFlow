import { FormEvent, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Button } from '../../../components/Button'
import { teamMembers } from '../mockData'
import type { Task, TaskFormValues } from '../types'
import { getTaskFormValues } from '../utils'

const Form = styled.form`
  display: grid;
  gap: 1rem;
`

const Grid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
`

const Field = styled.label`
  display: grid;
  gap: 0.4rem;
  color: ${({ theme }) => theme.colors.textMuted};
`

const Input = styled.input`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceStrong};
  color: ${({ theme }) => theme.colors.text};
  padding: 0.85rem 1rem;
`

const Textarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  resize: vertical;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceStrong};
  color: ${({ theme }) => theme.colors.text};
  padding: 0.85rem 1rem;
`

const Select = styled.select`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceStrong};
  color: ${({ theme }) => theme.colors.text};
  padding: 0.85rem 1rem;
`

const MemberGrid = styled.div`
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
`

const MemberOption = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`

const MemberSwatch = styled.span<{ $color: string }>`
  width: 0.9rem;
  height: 0.9rem;
  border-radius: 999px;
  background: ${({ $color }) => $color};
`

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  flex-wrap: wrap;
`

type TaskFormProps = {
  task?: Task
  onSubmit: (values: TaskFormValues) => void
  onCancel: () => void
}

export function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const defaults = useMemo(() => getTaskFormValues(task), [task])
  const [title, setTitle] = useState(defaults.title)
  const [description, setDescription] = useState(defaults.description)
  const [status, setStatus] = useState(defaults.status)
  const [priority, setPriority] = useState(defaults.priority)
  const [tags, setTags] = useState(defaults.tags.join(', '))
  const [dueDate, setDueDate] = useState(defaults.dueDate)
  const [assigneeIds, setAssigneeIds] = useState(defaults.assigneeIds)

  const toggleMember = (memberId: string) => {
    setAssigneeIds((current) =>
      current.includes(memberId)
        ? current.filter((id) => id !== memberId)
        : [...current, memberId],
    )
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    onSubmit({
      title,
      description,
      status,
      priority,
      tags: tags.split(','),
      dueDate,
      assigneeIds,
    })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Field>
        <span>Title</span>
        <Input
          aria-label="Task title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Write a short and specific title"
          required
        />
      </Field>

      <Field>
        <span>Description</span>
        <Textarea
          aria-label="Task description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Add context, acceptance criteria or notes"
          required
        />
      </Field>

      <Grid>
        <Field>
          <span>Status</span>
          <Select
            aria-label="Task status"
            value={status}
            onChange={(event) => setStatus(event.target.value as TaskFormValues['status'])}
          >
            <option value="backlog">Backlog</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </Select>
        </Field>

        <Field>
          <span>Priority</span>
          <Select
            aria-label="Task priority"
            value={priority}
            onChange={(event) => setPriority(event.target.value as TaskFormValues['priority'])}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
        </Field>

        <Field>
          <span>Tags</span>
          <Input
            aria-label="Task tags"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            placeholder="frontend, urgent, qa"
          />
        </Field>

        <Field>
          <span>Due date</span>
          <Input
            aria-label="Task due date"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
        </Field>
      </Grid>

      <Field>
        <span>Team members</span>
        <MemberGrid>
          {teamMembers.map((member) => (
            <MemberOption key={member.id}>
              <input
                type="checkbox"
                aria-label={`Assign ${member.name}`}
                checked={assigneeIds.includes(member.id)}
                onChange={() => toggleMember(member.id)}
              />
              <MemberSwatch $color={member.color} />
              <span>
                {member.name} · {member.role}
              </span>
            </MemberOption>
          ))}
        </MemberGrid>
      </Field>

      <Actions>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{task ? 'Save changes' : 'Create task'}</Button>
      </Actions>
    </Form>
  )
}
