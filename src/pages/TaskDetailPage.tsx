import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Button } from '../components/Button'
import { teamMembers } from '../features/tasks/mockData'
import { TaskModal } from '../features/tasks/components/TaskModal'
import { useTaskStore } from '../features/tasks/taskStore'
import { defaultActorId, formatDate, formatDateTime, getMembersByIds, statusMeta } from '../features/tasks/utils'

const Panel = styled.section`
  display: grid;
  gap: 1.5rem;
  padding: 1.5rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
`

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`

const Badge = styled.span`
  padding: 0.45rem 0.75rem;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.primarySoft};
  font-weight: 700;
`

const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  width: fit-content;
  padding: 0.8rem 1rem;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.primarySoft};
  font-weight: 700;
`

const Section = styled.section`
  display: grid;
  gap: 0.85rem;
`

const MemberList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`

const MemberCard = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceStrong};
  border: 1px solid ${({ theme }) => theme.colors.border};
`

const Avatar = styled.span<{ $color: string }>`
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 999px;
  display: inline-grid;
  place-items: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: #ffffff;
  background: ${({ $color }) => $color};
`

const Timeline = styled.div`
  display: grid;
  gap: 0.85rem;
`

const TimelineItem = styled.article`
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceStrong};
  border: 1px solid ${({ theme }) => theme.colors.border};

  p {
    margin: 0.35rem 0 0;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`

const CommentForm = styled.form`
  display: grid;
  gap: 0.85rem;
`

const CommentInput = styled.textarea`
  width: 100%;
  min-height: 120px;
  resize: vertical;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceStrong};
  color: ${({ theme }) => theme.colors.text};
  padding: 0.85rem 1rem;
`

export function TaskDetailPage() {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const task = useTaskStore((state) => state.tasks.find((item) => item.id === taskId))
  const updateTask = useTaskStore((state) => state.updateTask)
  const deleteTask = useTaskStore((state) => state.deleteTask)
  const addComment = useTaskStore((state) => state.addComment)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [comment, setComment] = useState('')

  if (!task) {
    return (
      <Panel>
        <h2>Task not found</h2>
        <p>The requested task does not exist anymore or was removed from local storage.</p>
        <BackLink to="/board">Back to board</BackLink>
      </Panel>
    )
  }

  const assignees = getMembersByIds(task.assigneeIds)

  return (
    <>
      <Panel>
        <div>
          <BackLink to="/board">Back to board</BackLink>
          <h2>{task.title}</h2>
          <p>{task.description}</p>
        </div>

        <Meta>
          <Badge>{statusMeta[task.status].title}</Badge>
          <Badge>{task.priority}</Badge>
          <Badge>{formatDate(task.dueDate)}</Badge>
          {task.tags.map((tag) => (
            <Badge key={tag}>#{tag}</Badge>
          ))}
        </Meta>

        <Section>
          <h3>Team members</h3>
          <MemberList>
            {assignees.length > 0 ? (
              assignees.map((member) => (
                <MemberCard key={member.id}>
                  <Avatar $color={member.color}>
                    {member.name
                      .split(' ')
                      .map((part) => part[0])
                      .join('')
                      .slice(0, 2)}
                  </Avatar>
                  <div>
                    <strong>{member.name}</strong>
                    <div>{member.role}</div>
                  </div>
                </MemberCard>
              ))
            ) : (
              <p>No team members assigned yet.</p>
            )}
          </MemberList>
        </Section>

        <div>
          <strong>Created:</strong> {formatDateTime(task.createdAt)}
        </div>
        <div>
          <strong>Last update:</strong> {formatDateTime(task.updatedAt)}
        </div>

        <Actions>
          <Button type="button" onClick={() => setIsModalOpen(true)}>
            Edit task
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={() => {
              deleteTask(task.id)
              navigate('/board')
            }}
          >
            Delete task
          </Button>
        </Actions>
      </Panel>

      <Panel>
        <Section>
          <h3>Comments</h3>
          <CommentForm
            onSubmit={(event) => {
              event.preventDefault()
              addComment(task.id, defaultActorId, comment)
              setComment('')
            }}
          >
            <CommentInput
              aria-label="Task comment"
              placeholder="Leave a note for the team"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
            <Actions>
              <Button type="submit" disabled={comment.trim().length === 0}>
                Add comment
              </Button>
            </Actions>
          </CommentForm>

          <Timeline>
            {task.comments.length > 0 ? (
              [...task.comments]
                .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                .map((entry) => {
                  const author = teamMembers.find((member) => member.id === entry.authorId)
                  return (
                    <TimelineItem key={entry.id}>
                      <strong>{author?.name ?? 'Team member'}</strong>
                      <div>{formatDateTime(entry.createdAt)}</div>
                      <p>{entry.message}</p>
                    </TimelineItem>
                  )
                })
            ) : (
              <p>No comments yet.</p>
            )}
          </Timeline>
        </Section>
      </Panel>

      <Panel>
        <Section>
          <h3>Activity history</h3>
          <Timeline>
            {[...task.activity]
              .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
              .map((entry) => {
                const actor = teamMembers.find((member) => member.id === entry.actorId)
                return (
                  <TimelineItem key={entry.id}>
                    <strong>{actor?.name ?? 'Team member'}</strong>
                    <div>{formatDateTime(entry.createdAt)}</div>
                    <p>{entry.message}</p>
                  </TimelineItem>
                )
              })}
          </Timeline>
        </Section>
      </Panel>

      <TaskModal
        open={isModalOpen}
        task={task}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(values) => {
          updateTask(task.id, values)
          setIsModalOpen(false)
        }}
      />
    </>
  )
}
