import { Button } from '../../../components/common/Button'

interface UserSelectorProps { onSelect: () => void }

export function UserSelector({ onSelect }: UserSelectorProps) {
  return <section className="entry-card" aria-labelledby="demo-user-title">
    <p className="entry-card__eyebrow">Compra preparada</p><h2 id="demo-user-title">Entrar con un perfil demo</h2>
    <p>Recupera una lista de compra preparada para recorrer la tienda.</p>
    <Button fullWidth onClick={onSelect}>Elegir perfil</Button>
  </section>
}
