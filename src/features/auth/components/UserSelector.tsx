import { Button } from '../../../components/common/Button'

interface UserSelectorProps {
  onSelect: () => void
}

export function UserSelector({ onSelect }: UserSelectorProps) {
  return (
    <section className="entry-card" aria-labelledby="demo-user-title">
      <p className="entry-card__eyebrow">Lista guardada</p>
      <h2 id="demo-user-title">Iniciar sesión con tu cuenta</h2>
      <p>Accede con tu usuario (Ana o Carlos) para cargar tu lista de compra ya preparada.</p>
      <Button fullWidth onClick={onSelect}>
        Iniciar sesión
      </Button>
    </section>
  )
}

