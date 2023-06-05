export interface IMember {
  name: string
  is_coming: boolean
}

export interface IGuest {
  family: string
  code: string
  confirmed: boolean
  absent: boolean
  inviteSent: boolean
  members: IMember[]
  openedTimes: number
  side: 'bride' | 'groom'
}

export type IGuestList = Array<Pick<IGuest, 'code'>>
