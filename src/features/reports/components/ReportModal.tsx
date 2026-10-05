import { useMemo, useState } from 'react'
import { Button } from '../../../components/common/Button'
import { mercadonaApi } from '../../../services/backend/MercadonaApiService'
import type { Incident, Store } from '../../../types'

interface ReportModalProps {
  onClose: () => void
  onReported: (incident: Incident) => void
  store: Store
}

interface ReportTypeOption {
  label: string
  targetType: Incident['targetType']
  type: Incident['type']
}

interface TargetOption {
  id: string
  label: string
}

const REPORT_TYPE_OPTIONS: ReportTypeOption[] = [
  { type: 'PRODUCT_OUT_OF_STOCK', label: 'Producto agotado', targetType: 'PRODUCT' },
  { type: 'CONGESTION', label: 'Mucha gente', targetType: 'EDGE' },
  { type: 'SPILL', label: 'Derrame', targetType: 'EDGE' },
  { type: 'BLOCKED_AISLE', label: 'Pasillo bloqueado', targetType: 'EDGE' },
  { type: 'RESTOCKING', label: 'Reposición', targetType: 'EDGE' },
  { type: 'LONG_CHECKOUT_QUEUE', label: 'Cola larga', targetType: 'CHECKOUT' },
]

export function ReportModal({ onClose, onReported, store }: ReportModalProps) {
  const [reportType, setReportType] = useState<Incident['type']>('PRODUCT_OUT_OF_STOCK')
  const [isPrepared, setIsPrepared] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const selectedOption = REPORT_TYPE_OPTIONS.find((option) => option.type === reportType) ?? REPORT_TYPE_OPTIONS[0]
  const targets = useMemo(() => getTargets(store, selectedOption.targetType), [selectedOption.targetType, store])
  const [targetId, setTargetId] = useState(targets[0]?.id ?? '')

  function changeReportType(nextType: Incident['type']) {
    const option = REPORT_TYPE_OPTIONS.find((candidate) => candidate.type === nextType) ?? REPORT_TYPE_OPTIONS[0]
    const nextTargets = getTargets(store, option.targetType)
    setReportType(nextType)
    setTargetId(nextTargets[0]?.id ?? '')
    setIsPrepared(false)
  }

  async function prepareReport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    try {
      const incident = await mercadonaApi.reportIncident(store, {
        type: reportType,
        targetId,
        targetType: selectedOption.targetType,
      })
      onReported(incident)
      setIsPrepared(true)
    } catch {
      setError('No se ha podido enviar la incidencia. Comprueba la conexión con la API.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return <div className="report-modal__backdrop" role="presentation">
    <section className="report-modal" role="dialog" aria-modal="true" aria-labelledby="report-modal-title">
      <div className="report-modal__header">
        <div><p className="eyebrow">Ayuda a otros clientes</p><h2 id="report-modal-title">Reportar incidencia</h2></div>
        <button className="report-modal__close" type="button" onClick={onClose} aria-label="Cerrar reporte">×</button>
      </div>
      <form className="report-modal__form" onSubmit={prepareReport}>
        <label htmlFor="report-type">¿Qué ocurre?</label>
        <select id="report-type" value={reportType} onChange={(event) => changeReportType(event.target.value as Incident['type'])}>
          {REPORT_TYPE_OPTIONS.map((option) => <option key={option.type} value={option.type}>{option.label}</option>)}
        </select>
        <label htmlFor="report-target">¿Dónde?</label>
        <select id="report-target" value={targetId} onChange={(event) => { setTargetId(event.target.value); setIsPrepared(false) }}>
          {targets.map((target) => <option key={target.id} value={target.id}>{target.label}</option>)}
        </select>
        {isPrepared && <p className="report-modal__notice" role="status">Incidencia enviada. Estamos recalculando el recorrido.</p>}
        {error && <p className="login-modal__error" role="alert">{error}</p>}
        <div className="report-modal__actions">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>Cancelar</Button>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Enviando…' : 'Enviar incidencia'}</Button>
        </div>
      </form>
    </section>
  </div>
}

function getTargets(store: Store, targetType: Incident['targetType']): TargetOption[] {
  if (targetType === 'PRODUCT') {
    return store.productLocations.map((location) => ({
      id: location.productId,
      label: location.displayLabel ?? location.productId,
    }))
  }

  if (targetType === 'CHECKOUT') {
    return store.checkouts.map((checkout) => ({ id: checkout.id, label: checkout.name }))
  }

  return store.graph.edges.map((edge) => ({ id: edge.id, label: `Tramo ${edge.id.replace('edge_', '')}` }))
}
