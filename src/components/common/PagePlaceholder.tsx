import { Link } from 'react-router-dom'
import { PageContainer } from './PageContainer'

interface PagePlaceholderProps { eyebrow: string; title: string; description: string }

export function PagePlaceholder({ eyebrow, title, description }: PagePlaceholderProps) {
  return <PageContainer className="page-placeholder">
    <p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="page-placeholder__description">{description}</p>
    <Link className="button button--secondary" to="/">Volver al inicio</Link>
  </PageContainer>
}
