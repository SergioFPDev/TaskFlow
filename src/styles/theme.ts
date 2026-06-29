import { css } from 'styled-components'

export type ThemeMode = 'light' | 'dark'

type BaseTheme = {
  mode: ThemeMode
  colors: {
    background: string
    backgroundAccent: string
    surface: string
    surfaceStrong: string
    border: string
    text: string
    textMuted: string
    primary: string
    primarySoft: string
    secondary: string
    danger: string
    success: string
    warning: string
    overlay: string
  }
  gradients: {
    page: string
    hero: string
  }
  radii: {
    sm: string
    md: string
    lg: string
    pill: string
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  shadows: {
    card: string
    soft: string
  }
  priority: {
    low: string
    medium: string
    high: string
  }
}

const sharedTheme = {
  radii: {
    sm: '12px',
    md: '20px',
    lg: '28px',
    pill: '999px',
  },
  spacing: {
    xs: '0.35rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  shadows: {
    card: '0 18px 50px rgba(15, 23, 42, 0.12)',
    soft: '0 10px 25px rgba(15, 23, 42, 0.08)',
  },
  priority: {
    low: '#2f855a',
    medium: '#c27803',
    high: '#c53030',
  },
}

export const lightTheme: BaseTheme = {
  ...sharedTheme,
  mode: 'light',
  colors: {
    background: '#f4efe6',
    backgroundAccent: '#fffaf3',
    surface: 'rgba(255, 252, 247, 0.88)',
    surfaceStrong: '#ffffff',
    border: 'rgba(148, 163, 184, 0.28)',
    text: '#1f2937',
    textMuted: '#5b6577',
    primary: '#006d77',
    primarySoft: '#d6f2ef',
    secondary: '#e29578',
    danger: '#b42318',
    success: '#1f7a4c',
    warning: '#b76e00',
    overlay: 'rgba(15, 23, 42, 0.5)',
  },
  gradients: {
    page: 'radial-gradient(circle at top left, rgba(255, 236, 209, 0.9), transparent 36%), linear-gradient(135deg, #f4efe6 0%, #f7f2ea 48%, #efe7da 100%)',
    hero: 'linear-gradient(135deg, rgba(0, 109, 119, 0.14), rgba(226, 149, 120, 0.2))',
  },
}

export const darkTheme: BaseTheme = {
  ...sharedTheme,
  mode: 'dark',
  colors: {
    background: '#10161f',
    backgroundAccent: '#17202b',
    surface: 'rgba(18, 24, 34, 0.88)',
    surfaceStrong: '#192231',
    border: 'rgba(148, 163, 184, 0.16)',
    text: '#f6efe6',
    textMuted: '#a7b0bf',
    primary: '#7bd3cb',
    primarySoft: 'rgba(123, 211, 203, 0.16)',
    secondary: '#ffb18a',
    danger: '#ff8f8f',
    success: '#66d19e',
    warning: '#f9c46b',
    overlay: 'rgba(3, 7, 18, 0.72)',
  },
  gradients: {
    page: 'radial-gradient(circle at top left, rgba(28, 50, 57, 0.95), transparent 32%), linear-gradient(145deg, #10161f 0%, #0f1722 55%, #17202b 100%)',
    hero: 'linear-gradient(135deg, rgba(123, 211, 203, 0.16), rgba(255, 177, 138, 0.18))',
  },
}

export type AppTheme = BaseTheme

export const focusRing = css`
  outline: 3px solid rgba(0, 109, 119, 0.26);
  outline-offset: 2px;
`
