import { useNavigate } from 'react-router-dom'
import { PageContainer } from '../../../components/common/PageContainer'
import { GuestEntry } from '../components/GuestEntry'
import { UserSelector } from '../components/UserSelector'

export function LandingPage() {
  const navigate = useNavigate()
  return <PageContainer className="landing-page">
    <div className="landing-page__intro">
      <p className="eyebrow">Tu compra, mejor organizada</p><h1>Encuentra todo sin perder tiempo.</h1>
      <p>Mercadona Sync convierte tu lista de la compra en un recorrido claro y adaptable por la tienda.</p>
    </div>
    <div className="entry-grid">
      <UserSelector onSelect={() => navigate('/list')} />
      <GuestEntry onContinue={() => navigate('/list')} />
    </div>
  </PageContainer>
}
