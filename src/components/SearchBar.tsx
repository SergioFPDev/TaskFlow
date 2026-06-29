import styled from 'styled-components'
import { Input } from './Input'

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
}

const SearchWrap = styled.div`
  min-width: min(100%, 340px);
`

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <SearchWrap>
      <Input
        label="Search tasks"
        placeholder="Search by title, description or tag"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </SearchWrap>
  )
}
