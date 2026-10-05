import type { ShoppingListItem } from '../../../types'
import { Button } from '../../../components/common/Button'

interface ShoppingListEditorProps {
  items: ShoppingListItem[]
  onRemove: (itemId: string) => void
}

export function ShoppingListEditor({ items, onRemove }: ShoppingListEditorProps) {
  if (items.length === 0) {
    return <p className="empty-list">Aún no has añadido ningún producto.</p>
  }

  return (
    <ul className="shopping-list-editor" aria-label="Productos de tu lista">
      {items.map((item) => (
        <li key={item.id} className="shopping-list-editor__item">
          <div>
            <p>{item.rawText}</p>
            <span className="status-badge">Pendiente de identificar</span>
          </div>
          <Button variant="secondary" onClick={() => onRemove(item.id)} aria-label={`Eliminar ${item.rawText}`}>
            Eliminar
          </Button>
        </li>
      ))}
    </ul>
  )
}
