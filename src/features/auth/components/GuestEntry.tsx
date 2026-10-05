import { Button } from '../../../components/common/Button'

interface GuestEntryProps { onContinue: () => void }

export function GuestEntry({ onContinue }: GuestEntryProps) {
  return <section className="entry-card" aria-labelledby="guest-entry-title">
    <p className="entry-card__eyebrow">Compra rápida</p><h2 id="guest-entry-title">Continuar como invitado</h2>
    <p>Escribe o pega tu lista y te ayudaremos a encontrar cada producto.</p>
    <Button fullWidth variant="secondary" onClick={onContinue}>Crear una lista</Button>
  </section>
}
