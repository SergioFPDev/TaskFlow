import { usePreferencesStore } from '../stores/preferencesStore'
import { Button } from './Button'

export function ThemeToggle() {
  const themeMode = usePreferencesStore((state) => state.themeMode)
  const toggleTheme = usePreferencesStore((state) => state.toggleTheme)

  return (
    <Button type="button" variant="ghost" onClick={toggleTheme}>
      {themeMode === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
    </Button>
  )
}
