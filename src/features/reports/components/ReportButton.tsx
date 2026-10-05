import { Button } from '../../../components/common/Button'

interface ReportButtonProps {
  onClick: () => void
}

export function ReportButton({ onClick }: ReportButtonProps) {
  return <Button fullWidth variant="secondary" onClick={onClick}>Reportar incidencia</Button>
}
