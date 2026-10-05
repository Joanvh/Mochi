import { Button } from '../../../components/common/Button'

interface ReportButtonProps {
  onClick: () => void
}

export function ReportButton({ onClick }: ReportButtonProps) {
  return (
    <Button className="report-button" fullWidth variant="secondary" onClick={onClick}>
      <span className="report-button__icon" aria-hidden="true">!</span>
      <span className="report-button__copy"><strong>Reportar una incidencia</strong><small>Ayuda a mejorar el recorrido</small></span>
      <span className="report-button__arrow" aria-hidden="true">›</span>
    </Button>
  )
}
