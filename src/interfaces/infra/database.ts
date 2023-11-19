import { IGuest } from '../models'

export interface IDatabaseClient {
  getOne: (code: string) => Promise<IGuest | null>
}
