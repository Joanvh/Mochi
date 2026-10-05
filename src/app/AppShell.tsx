import { Link, Outlet, useLocation } from 'react-router-dom'
import { PAGE_TITLES } from './routes'

export function AppShell() {
  const location = useLocation()
  const pageTitle = PAGE_TITLES[location.pathname] ?? 'Mercadona Sync'
  const isLanding = location.pathname === '/'

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link className="app-brand" to="/" aria-label="Ir al inicio de Mercadona Sync">
          <span className="app-brand__mark" aria-hidden="true">M</span>
          <span>Mercadona Sync</span>
        </Link>
        {!isLanding && <p className="app-header__context">{pageTitle}</p>}
      </header>
      <main className="app-main"><Outlet /></main>
    </div>
  )
}
