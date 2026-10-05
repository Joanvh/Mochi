import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import mercadonaSyncLogo from '../assets/branding/mercadona-sync-logo.png'
import { LoginModal } from '../features/auth/components/LoginModal'
import { useAppStore } from '../store/useAppStore'
import { PAGE_TITLES } from './routes'

export function AppShell() {
  const location = useLocation()
  const pageTitle = PAGE_TITLES[location.pathname] ?? 'Mercadona Sync'
  const isLanding = location.pathname === '/'
  const currentUser = useAppStore((state) => state.currentUser)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link className="app-brand" to="/" aria-label="Ir al inicio de Mercadona Sync">
          <img className="app-brand__logo" src={mercadonaSyncLogo} alt="Mercadona Sync" />
        </Link>
        <div className="app-header__right">
          {!isLanding && <p className="app-header__context">{pageTitle}</p>}
          {currentUser ? (
            <div className="app-header__user">
              <span className="app-header__user-name" title={currentUser.email}>
                👤 {currentUser.name}
              </span>
              <button
                type="button"
                className="app-header__user-btn"
                onClick={() => setIsLoginModalOpen(true)}
                title="Cambiar de usuario"
              >
                Cambiar
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="app-header__login-btn"
              onClick={() => setIsLoginModalOpen(true)}
            >
              Iniciar sesión
            </button>
          )}
        </div>
      </header>
      <main className="app-main"><Outlet /></main>
      {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} />}
    </div>
  )
}
