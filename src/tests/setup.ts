import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach } from 'vitest'
import { resetPreferencesStore } from '../stores/preferencesStore'
import { resetTaskStore } from '../features/tasks/taskStore'

beforeEach(() => {
  localStorage.clear()
  resetTaskStore()
  resetPreferencesStore()
})

afterEach(() => {
  cleanup()
})
