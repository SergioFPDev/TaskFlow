import { InputHTMLAttributes } from 'react'
import styled from 'styled-components'
import { focusRing } from '../styles/theme'

const InputShell = styled.label`
  display: grid;
  gap: 0.4rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.95rem;
`

const InputField = styled.input`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceStrong};
  color: ${({ theme }) => theme.colors.text};
  padding: 0.85rem 1rem;

  &:focus-visible {
    ${focusRing}
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
}

export function Input({ label, ...props }: InputProps) {
  return (
    <InputShell>
      <span>{label}</span>
      <InputField {...props} />
    </InputShell>
  )
}
