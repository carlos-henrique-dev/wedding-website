export interface IMember {
  name: string
  is_coming: boolean
}

export interface IGuest {
  family: string
  code: string
  confirmed: boolean
  inviteSent: boolean
  members: IMember[]
}

export type IGuestList = Array<Pick<IGuest, 'code'>>
