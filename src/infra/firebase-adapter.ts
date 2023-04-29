import { IDatabaseClient, IGuest, IGuestList } from '@/interfaces'
import { fireStoreInstance } from '@/config'

export class FireStoreAdapter implements IDatabaseClient {
  private readonly fireStore = fireStoreInstance

  getOne = async (code: string) => {
    const result = await this.fireStore.collection('guests').where('code', '==', code).get()

    const data = result.docs[0].data() as IGuest

    return data
  }

  getCodes = async () => {
    const result = await this.fireStore.collection('guests').select('code').get()

    const data = result.docs.map((guest) => guest.data()) as IGuestList

    return data
  }
}
