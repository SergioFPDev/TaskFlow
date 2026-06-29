import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createSeedTasks } from './mockData'
import { addCommentToTask, createTask, emptyFilters, moveTaskShape, normalizeTasks, updateTaskShape } from './utils'
import type { Task, TaskFilters, TaskFormValues, TaskStatus } from './types'

type TaskStore = {
  tasks: Task[]
  filters: TaskFilters
  addTask: (values: TaskFormValues) => void
  updateTask: (taskId: string, values: TaskFormValues) => void
  deleteTask: (taskId: string) => void
  moveTask: (taskId: string, status: TaskStatus) => void
  addComment: (taskId: string, authorId: string, message: string) => void
  setTasks: (tasks: Task[]) => void
  setFilters: (filters: Partial<TaskFilters>) => void
  clearFilters: () => void
}

const initialState = {
  tasks: normalizeTasks(createSeedTasks()),
  filters: emptyFilters,
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      ...initialState,
      addTask: (values) =>
        set((state) => ({
          tasks: [...state.tasks, createTask(values)],
        })),
      updateTask: (taskId, values) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? updateTaskShape(task, values) : task,
          ),
        })),
      deleteTask: (taskId) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
        })),
      moveTask: (taskId, status) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? moveTaskShape(task, status) : task,
          ),
        })),
      addComment: (taskId, authorId, message) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? addCommentToTask(task, authorId, message) : task,
          ),
        })),
      setTasks: (tasks) => set({ tasks: normalizeTasks(tasks) }),
      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),
      clearFilters: () =>
        set((state) => ({
          ...state,
          filters: emptyFilters,
        })),
    }),
    {
      name: 'taskflow-store',
      version: 2,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ tasks: state.tasks }),
      migrate: (persistedState) => {
        const state = persistedState as { tasks?: Task[] } | undefined
        return {
          tasks: normalizeTasks(state?.tasks ?? createSeedTasks()),
        }
      },
      merge: (persistedState, currentState) => {
        const state = persistedState as Partial<{ tasks: Task[] }> | undefined
        return {
          ...currentState,
          tasks: normalizeTasks(state?.tasks ?? currentState.tasks),
        }
      },
    },
  ),
)

export function resetTaskStore() {
  useTaskStore.setState({
    ...initialState,
    addTask: useTaskStore.getState().addTask,
    updateTask: useTaskStore.getState().updateTask,
    deleteTask: useTaskStore.getState().deleteTask,
    moveTask: useTaskStore.getState().moveTask,
    addComment: useTaskStore.getState().addComment,
    setTasks: useTaskStore.getState().setTasks,
    setFilters: useTaskStore.getState().setFilters,
    clearFilters: useTaskStore.getState().clearFilters,
  })
  useTaskStore.persist.clearStorage()
}
