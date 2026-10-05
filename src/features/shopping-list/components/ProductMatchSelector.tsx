import type { Product, ProductMatch } from '../../../types'
import { Button } from '../../../components/common/Button'

export interface ProductMatchOption {
  product: Product
  match: ProductMatch
}

interface ProductMatchSelectorProps {
  itemId: string
  options: ProductMatchOption[]
  query: string
  onSelect: (productId: string) => void
}

export function ProductMatchSelector({ itemId, options, query, onSelect }: ProductMatchSelectorProps) {
  return (
    <section className="product-match-selector" aria-labelledby={`match-${itemId}`}>
      <p className="product-match-selector__title" id={`match-${itemId}`}>¿Qué producto quieres decir con “{query}”?</p>
      <div className="product-match-selector__options">
        {options.map(({ match, product }) => (
          <Button key={product.id} variant="secondary" fullWidth onClick={() => onSelect(product.id)}>
            <span>{product.name}</span>
            <small>{Math.round(match.score * 100)}% de coincidencia</small>
          </Button>
        ))}
      </div>
    </section>
  )
}
