import { ButtonHTMLAttributes, ElementType } from 'react'
import styled, { css } from 'styled-components'
import { focusRing } from '../styles/theme'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  as?: ElementType
  variant?: ButtonVariant
  fullWidth?: boolean
}

const variants = {
  primary: css`
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => (theme.mode === 'light' ? '#ffffff' : '#08111f')};
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.secondary};
    color: #1f2937;
  `,
  ghost: css`
    background: ${({ theme }) => theme.colors.primarySoft};
    color: ${({ theme }) => theme.colors.text};
  `,
  danger: css`
    background: ${({ theme }) => theme.colors.danger};
    color: #ffffff;
  `,
}

const StyledButton = styled.button<{ $variant: ButtonVariant; $fullWidth?: boolean }>`
  border: 0;
  border-radius: ${({ theme }) => theme.radii.pill};
  padding: 0.8rem 1rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  transition: transform 0.18s ease, opacity 0.18s ease, box-shadow 0.18s ease;
  box-shadow: ${({ theme }) => theme.shadows.soft};
  ${({ $variant }) => variants[$variant]};

  &:hover {
    transform: translateY(-1px);
    opacity: 0.94;
  }

  &:focus-visible {
    ${focusRing}
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`

export function Button({ children, variant = 'primary', fullWidth, ...props }: ButtonProps) {
  return (
    <StyledButton $variant={variant} $fullWidth={fullWidth} {...props}>
      {children}
    </StyledButton>
  )
}
