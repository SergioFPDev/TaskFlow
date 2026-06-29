import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { ThemeMode } from '../styles/theme'

type PreferencesState = {
  themeMode: ThemeMode
  toggleTheme: () => void
  setThemeMode: (themeMode: ThemeMode) => void
}

const defaultState = {
  themeMode: 'light' as ThemeMode,
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      ...defaultState,
      toggleTheme: () =>
        set((state) => ({
          themeMode: state.themeMode === 'light' ? 'dark' : 'light',
        })),
      setThemeMode: (themeMode) => set({ themeMode }),
    }),
    {
      name: 'taskflow-preferences',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

export function resetPreferencesStore() {
  usePreferencesStore.setState({
    ...defaultState,
    toggleTheme: usePreferencesStore.getState().toggleTheme,
    setThemeMode: usePreferencesStore.getState().setThemeMode,
  })
  usePreferencesStore.persist.clearStorage()
}
