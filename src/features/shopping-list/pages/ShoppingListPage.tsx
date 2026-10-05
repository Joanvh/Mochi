import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/common/Button'
import { PageContainer } from '../../../components/common/PageContainer'
import { mercadonaApi } from '../../../services/backend/MercadonaApiService'
import { useAppStore } from '../../../store/useAppStore'
import type { ShoppingListItem } from '../../../types'
import { ManualListInput } from '../components/ManualListInput'
import { ProductMatchSelector, type ProductMatchOption } from '../components/ProductMatchSelector'
import { ShoppingListEditor } from '../components/ShoppingListEditor'

let nextDraftItemId = 0

function createDraftItem(rawText: string): ShoppingListItem {
  return {
    id: `draft_${nextDraftItemId++}`,
    rawText,
    quantity: 1,
    status: 'UNRESOLVED',
    source: 'MANUAL',
  }
}

export function ShoppingListPage() {
  const navigate = useNavigate()
  const items = useAppStore((state) => state.draftShoppingList)
  const setItems = useAppStore((state) => state.setDraftShoppingList)
  const currentStore = useAppStore((state) => state.currentStore)
  const setCurrentStore = useAppStore((state) => state.setCurrentStore)
  const [isMatching, setIsMatching] = useState(false)
  const [matchOptions, setMatchOptions] = useState<Record<string, ProductMatchOption[]>>({})
  const [unmatchedItemIds, setUnmatchedItemIds] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  async function addTerms(terms: string[]) {
    setIsMatching(true)
    setError(null)

    try {
      const store = currentStore ?? await mercadonaApi.loadPrimaryStore()
      if (!currentStore) setCurrentStore(store)
      const entries = await Promise.all(terms.map(async (term) => {
        const item = createDraftItem(term)
        const options = await getMatchOptions(term, store.id)

        if (options.length === 1) {
          return {
            item: { ...item, productId: options[0].product.id, status: 'PENDING' as const },
            options: [] as ProductMatchOption[],
            unmatched: false,
          }
        }

        return { item, options, unmatched: options.length === 0 }
      }))

    setItems([...items, ...entries.map((entry) => entry.item)])
      setMatchOptions((currentOptions) => ({
        ...currentOptions,
        ...Object.fromEntries(entries.filter((entry) => entry.options.length > 1).map((entry) => [entry.item.id, entry.options])),
      }))
      setUnmatchedItemIds((currentIds) => [
        ...currentIds,
        ...entries.filter((entry) => entry.unmatched).map((entry) => entry.item.id),
      ])
    } catch {
      setError('No hemos podido consultar el clasificador de productos. Comprueba que la API está iniciada.')
    } finally {
      setIsMatching(false)
    }
  }

  function removeItem(itemId: string) {
    setItems(items.filter((item) => item.id !== itemId))
    setUnmatchedItemIds((currentIds) => currentIds.filter((id) => id !== itemId))
    setMatchOptions((currentOptions) => {
      const { [itemId]: _removed, ...remainingOptions } = currentOptions
      return remainingOptions
    })
  }

  function selectMatch(itemId: string, productId: string) {
    setItems(items.map((item) => (
      item.id === itemId ? { ...item, productId, status: 'PENDING' } : item
    )))
    setUnmatchedItemIds((currentIds) => currentIds.filter((id) => id !== itemId))
    setMatchOptions((currentOptions) => {
      const { [itemId]: _resolved, ...remainingOptions } = currentOptions
      return remainingOptions
    })
  }

  return (
    <PageContainer className="shopping-list-page">
      <p className="eyebrow">Paso 1 · Lista de compra</p>
      <h1>¿Qué necesitas hoy?</h1>
      <p className="shopping-list-page__description">
        Añade los productos que quieres comprar. Los relacionaremos con las categorías y ubicaciones de la tienda.
      </p>
      {error && <p className="login-modal__error" role="alert">{error}</p>}
      <ManualListInput isSubmitting={isMatching} onSubmit={addTerms} />
      <ShoppingListEditor items={items} unmatchedItemIds={unmatchedItemIds} onRemove={removeItem} />
      {items.flatMap((item) => matchOptions[item.id] ? [{ item, options: matchOptions[item.id] }] : []).map(({ item, options }) => (
        <ProductMatchSelector key={item.id} itemId={item.id} query={item.rawText} options={options} onSelect={(productId) => selectMatch(item.id, productId)} />
      ))}
      <Button fullWidth disabled={items.length === 0 || items.some((item) => item.status === 'UNRESOLVED')} onClick={() => navigate('/recommendations')}>
        Confirmar lista
      </Button>
    </PageContainer>
  )
}

async function getMatchOptions(query: string, storeId: string): Promise<ProductMatchOption[]> {
  const matches = await mercadonaApi.matchProducts(query, storeId)
  return matches.map(({ product, match }) => ({ product, match }))
}
