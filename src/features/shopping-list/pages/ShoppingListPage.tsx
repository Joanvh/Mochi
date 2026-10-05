import { useState } from 'react'
import { Button } from '../../../components/common/Button'
import { PageContainer } from '../../../components/common/PageContainer'
import type { ShoppingListItem } from '../../../types'
import { ManualListInput } from '../components/ManualListInput'
import { ShoppingListEditor } from '../components/ShoppingListEditor'

function createDraftItem(rawText: string, index: number): ShoppingListItem {
  return {
    id: `draft_${Date.now()}_${index}`,
    rawText,
    quantity: 1,
    status: 'UNRESOLVED',
    source: 'MANUAL',
  }
}

export function ShoppingListPage() {
  const [items, setItems] = useState<ShoppingListItem[]>([])

  function addTerms(terms: string[]) {
    setItems((currentItems) => [...currentItems, ...terms.map(createDraftItem)])
  }

  function removeItem(itemId: string) {
    setItems((currentItems) => currentItems.filter((item) => item.id !== itemId))
  }

  return (
    <PageContainer className="shopping-list-page">
      <p className="eyebrow">Paso 1 · Lista de compra</p>
      <h1>¿Qué necesitas hoy?</h1>
      <p className="shopping-list-page__description">
        Añade los productos que quieres comprar. Los relacionaremos con el catálogo en el siguiente bloque.
      </p>
      <ManualListInput onSubmit={addTerms} />
      <ShoppingListEditor items={items} onRemove={removeItem} />
      <Button fullWidth disabled={items.length === 0}>Confirmar lista</Button>
    </PageContainer>
  )
}
