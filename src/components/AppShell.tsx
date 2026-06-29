import { Outlet } from 'react-router-dom'
import styled from 'styled-components'
import { ThemeToggle } from './ThemeToggle'

const Shell = styled.div`
  width: min(1440px, calc(100% - 2rem));
  margin: 0 auto;
  padding: 1.25rem 0 2rem;
`

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem 1.25rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  backdrop-filter: blur(14px);
`

const Brand = styled.div`
  display: grid;
  gap: 0.2rem;

  h1 {
    margin: 0;
    font-size: clamp(1.6rem, 3vw, 2.4rem);
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`

export function AppShell() {
  return (
    <Shell>
      <Header>
        <Brand>
          <h1>TaskFlow</h1>
          <p>Advanced task board with search, filters, drag and drop and persistent state.</p>
        </Brand>
        <ThemeToggle />
      </Header>
      <Outlet />
    </Shell>
  )
}
