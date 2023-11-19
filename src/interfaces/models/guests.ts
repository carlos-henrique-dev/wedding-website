export interface IMember {
  name: string
  is_coming: boolean
}

export type TSide = 'bride' | 'groom'

export interface IGuest {
  family: string
  code: string
  confirmed: boolean
  absent: boolean
  inviteSent: boolean
  members: IMember[]
  openedTimes: number
  side: TSide
  group: string
}

export type IGuestList = Array<Pick<IGuest, 'code'>>
