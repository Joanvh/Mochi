import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/common/Button'
import { JsonProductRepository } from '../../../repositories/JsonProductRepository'
import { JsonUserRepository, type UserAccount } from '../../../repositories/JsonUserRepository'
import { ProductMatchingService } from '../../../services/product_matching/ProductMatchingService'
import { useAppStore } from '../../../store/useAppStore'
import type { ShoppingListItem } from '../../../types'

interface LoginModalProps {
  onClose: () => void
}

const userRepository = new JsonUserRepository()
const productRepository = new JsonProductRepository()
const productMatchingService = new ProductMatchingService(productRepository)

// Demo accounts info from users.json
const DEMO_ACCOUNTS = [
  {
    id: 'usr_001',
    email: 'ana@ejemplo.com',
    nombre: 'Ana García',
    password: 'demo',
    items: ['Leche sin lactosa', 'Arroz', 'Pollo'],
    tag: 'Perfil habitual',
  },
  {
    id: 'usr_002',
    email: 'carlos@ejemplo.com',
    nombre: 'Carlos Vegano',
    password: 'demo',
    items: ['Agua', 'Macarrones', 'Tomate'],
    tag: 'Perfil vegetal',
  },
]

export function LoginModal({ onClose }: LoginModalProps) {
  const navigate = useNavigate()
  const setCurrentUser = useAppStore((state) => state.setCurrentUser)
  const setDraftShoppingList = useAppStore((state) => state.setDraftShoppingList)
  const setActiveRoute = useAppStore((state) => state.setActiveRoute)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleLoginSuccess(user: UserAccount) {
    setIsSubmitting(true)
    setError(null)

    try {
      // 1. Set current user in global store
      setCurrentUser({
        id: user.id,
        name: user.nombre,
        email: user.email,
        shoppingListId: `list_${user.id}`,
      })

      // 2. Clear old route to prepare fresh route for this user's list
      setActiveRoute(null)

      // 3. Populate shopping list from user's lista_compra and match with catalogue
      const shoppingListItems: ShoppingListItem[] = await Promise.all(
        user.lista_compra.map(async (rawText, index) => {
          const matches = await productMatchingService.match(rawText)
          const bestMatch = matches[0]

          return {
            id: `item_${user.id}_${index}_${Date.now()}`,
            rawText,
            quantity: 1,
            productId: bestMatch ? bestMatch.productId : undefined,
            status: bestMatch ? ('PENDING' as const) : ('UNRESOLVED' as const),
            source: 'USER_PROFILE' as const,
          }
        }),
      )

      setDraftShoppingList(shoppingListItems)

      // 4. Close modal and navigate to shopping list
      onClose()
      navigate('/list')
    } catch {
      setError('Error al cargar la lista del usuario. Inténtalo de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password) {
      setError('Por favor, introduce tu correo y contraseña.')
      return
    }

    const authenticatedUser = await userRepository.authenticate(email, password)
    if (!authenticatedUser) {
      setError('Correo o contraseña incorrectos. Puedes usar una de las cuentas demo abajo.')
      return
    }

    await handleLoginSuccess(authenticatedUser)
  }

  function handleQuickLogin(account: (typeof DEMO_ACCOUNTS)[number]) {
    setEmail(account.email)
    setPassword(account.password)
    const safeUser: UserAccount = {
      id: account.id,
      email: account.email,
      nombre: account.nombre,
      lista_compra: account.items,
    }
    void handleLoginSuccess(safeUser)
  }

  return (
    <div
      className="login-modal__backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="login-modal">
        <header className="login-modal__header">
          <div>
            <p className="eyebrow">Mercadona Sync</p>
            <h2 id="login-modal-title">Iniciar sesión</h2>
          </div>
          <button
            type="button"
            className="login-modal__close"
            onClick={onClose}
            aria-label="Cerrar ventana"
          >
            ✕
          </button>
        </header>

        <p className="login-modal__description">
          Accede con tu cuenta registrada para cargar tu lista de compra guardada y optimizar tu recorrido.
        </p>

        {error && (
          <div className="login-modal__error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-modal__form">
          <div className="login-modal__field">
            <label htmlFor="login-email">Correo electrónico</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@mercadona.es"
              autoComplete="username"
              required
            />
          </div>

          <div className="login-modal__field">
            <label htmlFor="login-password">Contraseña</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          <Button type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Iniciando sesión…' : 'Entrar a mi cuenta'}
          </Button>
        </form>

        <div className="login-modal__divider">
          <span>o accede con un perfil demo</span>
        </div>

        <div className="login-modal__quick-list">
          {DEMO_ACCOUNTS.map((acc) => (
            <button
              key={acc.id}
              type="button"
              className="login-modal__quick-card"
              onClick={() => handleQuickLogin(acc)}
              disabled={isSubmitting}
            >
              <div className="login-modal__quick-top">
                <span className="login-modal__quick-avatar">
                  {acc.nombre.charAt(0)}
                </span>
                <div className="login-modal__quick-info">
                  <strong>{acc.nombre}</strong>
                  <span className="login-modal__quick-email">{acc.email}</span>
                </div>
                <span className="login-modal__quick-tag">{acc.tag}</span>
              </div>
              <div className="login-modal__quick-items">
                <span className="login-modal__quick-items-label">Lista incorporada:</span>
                <span className="login-modal__quick-items-list">
                  {acc.items.join(' · ')}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
