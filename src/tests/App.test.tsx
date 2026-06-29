import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from '../App'
import { AppProviders } from '../app/AppProviders'
import { useTaskStore } from '../features/tasks/taskStore'

function renderApp() {
  return render(
    <MemoryRouter
      initialEntries={['/board']}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AppProviders>
        <App />
      </AppProviders>
    </MemoryRouter>,
  )
}

describe('TaskFlow board', () => {
  it('creates a task and renders it in the To Do column', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: /add task/i }))
    await user.type(screen.getByLabelText(/task title/i), 'Write interview case study')
    await user.type(
      screen.getByLabelText(/task description/i),
      'Prepare the architecture notes and polished screenshots.',
    )
    await user.selectOptions(screen.getByLabelText(/task status/i), 'todo')
    await user.selectOptions(screen.getByLabelText(/task priority/i), 'high')
    await user.type(screen.getByLabelText(/task tags/i), 'portfolio, hiring')
    await user.click(screen.getByRole('button', { name: /create task/i }))

    const todoHeading = screen.getByRole('heading', { name: 'To Do' })
    const todoColumn = todoHeading.closest('section')
    expect(todoColumn).not.toBeNull()
    expect(within(todoColumn!).getByText('Write interview case study')).toBeInTheDocument()
  })

  it('moves a task to another status using the quick move control', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.selectOptions(screen.getByLabelText('Move Ship analytics dashboard'), 'done')

    const doneHeading = screen.getByRole('heading', { name: 'Done' })
    const doneColumn = doneHeading.closest('section')
    expect(doneColumn).not.toBeNull()
    expect(within(doneColumn!).getByText('Ship analytics dashboard')).toBeInTheDocument()
  })

  it('filters tasks by text search', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.type(screen.getByPlaceholderText(/search by title, description or tag/i), 'analytics')

    expect(screen.getByText('Ship analytics dashboard')).toBeInTheDocument()
    expect(screen.queryByText('Audit onboarding flow')).not.toBeInTheDocument()
  })

  it('renders older saved tasks without optional member or history fields', () => {
    useTaskStore.setState((state) => ({
      ...state,
      tasks: [
        {
          id: 'saved-task',
          title: 'Saved task',
          description: 'Recovered from a previous board format.',
          status: 'todo',
          priority: 'medium',
          tags: ['saved'],
          createdAt: '2026-06-01T00:00:00.000Z',
          updatedAt: '2026-06-01T00:00:00.000Z',
        },
      ] as never,
    }))

    renderApp()

    expect(screen.getByText('Saved task')).toBeInTheDocument()
    expect(screen.getByText('No assignees')).toBeInTheDocument()
  })
})
