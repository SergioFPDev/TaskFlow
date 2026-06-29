# TaskFlow

TaskFlow is a Kanban-style task manager built with React 18, TypeScript, Zustand, Styled Components, React Router, Vitest and React Testing Library. It focuses on a realistic day-to-day workflow: task planning, drag and drop, assignees, comments, activity tracking and local persistence.

## What the app does

- Create, edit and delete tasks.
- Organize work across `Backlog`, `To Do`, `In Progress` and `Done`.
- Move tasks between columns with drag and drop.
- Change task status from the card without dragging.
- Set priority, tags and due date for each task.
- Assign one or more team members to a task.
- Search tasks by title, description, tag or assignee name.
- Filter tasks by status, priority and tag.
- View task details on a dedicated route.
- Add comments inside the task detail page.
- Track task activity history for creation, updates, moves and comments.
- Persist the board in `localStorage` so refreshes keep the current state.
- Export the current board to JSON or CSV.
- Switch between light and dark theme.
- Handle older saved board data safely through store normalization.

## Main screens

- `/board`: main dashboard with search, filters, export actions, stats and Kanban board.
- `/tasks/:taskId`: detail page with metadata, assignees, comments and activity timeline.

## Stack

- React 18
- TypeScript
- Vite
- Zustand
- Styled Components
- React Router DOM
- `@dnd-kit`
- Vitest
- React Testing Library

## Project structure

```text
src/
  app/
  components/
  features/tasks/
    components/
    mockData.ts
    taskStore.ts
    types.ts
    utils.ts
  pages/
  stores/
  styles/
  tests/
```

## Scripts

```bash
npm install
npm run dev
npm run build
npm run test
```

## Behavior covered in tests

- Creating a task.
- Moving a task between statuses.
- Filtering through search.
- Rendering saved tasks from older persisted shapes without crashing.

## State and persistence

The board state is managed with Zustand and persisted to `localStorage`. Task records are normalized on load so that older saved data can still be rendered when the task model evolves.

## Export formats

- `JSON`: full board payload including tasks and team members.
- `CSV`: flat export with task metadata, assignees and counts for comments and activity.
