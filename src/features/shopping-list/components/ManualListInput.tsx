import { useState, type FormEvent } from 'react'
import { Button } from '../../../components/common/Button'
import { parseManualListInput } from '../utils/manualListParser'

interface ManualListInputProps {
  onSubmit: (terms: string[]) => void
}

export function ManualListInput({ onSubmit }: ManualListInputProps) {
  const [value, setValue] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const terms = parseManualListInput(value)

    if (terms.length === 0) {
      return
    }

    onSubmit(terms)
    setValue('')
  }

  return (
    <form className="manual-list-input" onSubmit={handleSubmit}>
      <label htmlFor="manual-list">Añade productos a tu lista</label>
      <p id="manual-list-help">Escribe un producto por línea o sepáralos con comas.</p>
      <textarea
        id="manual-list"
        aria-describedby="manual-list-help"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={'Leche\nHuevos\nArroz'}
        rows={4}
      />
      <Button type="submit">Añadir a la lista</Button>
    </form>
  )
}
