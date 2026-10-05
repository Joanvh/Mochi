import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
        <p className="eyebrow">Tu compra, mejor organizada</p>
        <h1>Encuentra todo sin perder tiempo.</h1>
        <p>
          Mercadona Sync convierte tu lista de la compra en un recorrido claro y adaptable por la tienda.
        </p>
      </div>
      <div className="entry-grid">
        <UserSelector onSelect={() => setIsLoginModalOpen(true)} />
        <GuestEntry onContinue={() => navigate('/list')} />
      </div>
      {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} />}
    </PageContainer>
  )
}

