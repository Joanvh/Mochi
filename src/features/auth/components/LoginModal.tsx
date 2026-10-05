import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import mercadonaSymbol from '../../../assets/branding/mercadona-symbol.png'
import { Button } from '../../../components/common/Button'
import { mercadonaApi, type BackendUser } from '../../../services/backend/MercadonaApiService'
import { useAppStore } from '../../../store/useAppStore'
import type { ShoppingListItem } from '../../../types'

interface LoginModalProps {
  onClose: () => void
}

export function LoginModal({ onClose }: LoginModalProps) {
  const navigate = useNavigate()
  const setCurrentUser = useAppStore((state) => state.setCurrentUser)
  const setDraftShoppingList = useAppStore((state) => state.setDraftShoppingList)
  const setActiveRoute = useAppStore((state) => state.setActiveRoute)
  const setCurrentStore = useAppStore((state) => state.setCurrentStore)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleLoginSuccess(user: BackendUser) {
    setIsSubmitting(true)
    setError(null)

    try {
      const store = await mercadonaApi.loadPrimaryStore()
      setCurrentStore(store)

      setCurrentUser({
        id: user.id,
        name: user.nombre,
        email: user.email,
        shoppingListId: `list_${user.id}`,
      })

      setActiveRoute(null)

      const shoppingListItems: ShoppingListItem[] = await Promise.all(
        user.lista_compra.map(async (rawText, index) => {
          const matches = await mercadonaApi.matchProducts(rawText, store.id)
          const bestMatch = matches[0]

          return {
            id: `item_${user.id}_${index}_${Date.now()}`,
            rawText,
            quantity: 1,
            productId: bestMatch?.product.id,
            status: bestMatch ? ('PENDING' as const) : ('UNRESOLVED' as const),
            source: 'USER_PROFILE' as const,
          }
        }),
      )

      setDraftShoppingList(shoppingListItems)

      onClose()
      navigate('/list')
    } catch {
      setError('No hemos podido conectar con el servicio de compra. Comprueba que la API está iniciada.')
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

    try {
      const authenticatedUser = await mercadonaApi.login(email, password)
      await handleLoginSuccess(authenticatedUser)
    } catch {
      setError('Correo o contraseña incorrectos, o no se ha podido contactar con la API.')
    }
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
            <img className="login-modal__logo" src={mercadonaSymbol} alt="Mercadona" />
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
      </div>
    </div>
  )
}
