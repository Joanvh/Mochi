import usersData from '../data/users.json'
import type { DemoUser } from '../types'

export interface UserAccount {
  email: string
  id: string
  lista_compra: string[]
  nombre: string
  password?: string
}

export class JsonUserRepository {
  private readonly users: UserAccount[] = usersData as UserAccount[]

  async authenticate(email: string, password: string): Promise<UserAccount | null> {
    const normalizedEmail = email.trim().toLocaleLowerCase('es-ES')
    const user = this.users.find((candidate) => (
      candidate.email.toLocaleLowerCase('es-ES') === normalizedEmail
      && candidate.password === password
    ))

    return user ?? null
  }

  async getById(id: string): Promise<UserAccount | null> {
    return this.users.find((user) => user.id === id) ?? null
  }

  async getDemoUsers(): Promise<DemoUser[]> {
    return this.users.map((user) => ({
      id: user.id,
      name: user.nombre,
      email: user.email,
      shoppingListId: `list_${user.id}`,
    }))
  }
}
