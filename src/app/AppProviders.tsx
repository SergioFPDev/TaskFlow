import { PropsWithChildren } from 'react'
import { ThemeProvider } from 'styled-components'
import { usePreferencesStore } from '../stores/preferencesStore'
import { GlobalStyles } from '../styles/GlobalStyles'
import { darkTheme, lightTheme } from '../styles/theme'

export function AppProviders({ children }: PropsWithChildren) {
  const themeMode = usePreferencesStore((state) => state.themeMode)
  const theme = themeMode === 'dark' ? darkTheme : lightTheme

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {children}
    </ThemeProvider>
  )
}
