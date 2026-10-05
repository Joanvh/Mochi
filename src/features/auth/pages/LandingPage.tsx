import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import mercadonaSyncLogo from '../../../assets/branding/mercadona-sync-logo.png'
import { PageContainer } from '../../../components/common/PageContainer'
import { GuestEntry } from '../components/GuestEntry'
import { LoginModal } from '../components/LoginModal'
import { UserSelector } from '../components/UserSelector'

export function LandingPage() {
  const navigate = useNavigate()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  return (
    <PageContainer className="landing-page">
      <div className="landing-page__intro">
        <img className="landing-page__sync-logo" src={mercadonaSyncLogo} alt="Mercadona Sync" />
        <p className="eyebrow">Tu compra, mejor organizada</p>
        <h1>Tu lista. Tu ruta. Sin vueltas.</h1>
        <p>
          Prepara tu compra y encuentra cada producto con un recorrido claro y adaptable por la tienda.
        </p>
        <div className="landing-page__benefits" aria-label="Ventajas de Mercadona Sync">
          <span>✓ Lista inteligente</span><span>⌁ Ruta optimizada</span><span>◉ Siempre al día</span>
        </div>
      </div>
      <div className="entry-grid">
        <UserSelector onSelect={() => setIsLoginModalOpen(true)} />
        <GuestEntry onContinue={() => navigate('/list')} />
      </div>
      {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} />}
    </PageContainer>
  )
}
