import { Filters, Sorter } from '../interfaces'

export const FILTERS_OPTIONS: Filters = [
  { label: 'Todos', value: 'all' },
  { label: 'Enviados', value: 'sent' },
  { label: 'Não enviados', value: 'notSent' },
  { label: 'Confirmados', value: 'confirmed' },
  { label: 'Não confirmados', value: 'notConfirmed' },
  { label: 'Não Comparecerá', value: 'absent' },
  { label: 'Lado da noiva', value: 'bride' },
  { label: 'Lado do noivo', value: 'groom' },
]

export const SORT_OPTIONS: Array<Sorter> = [
  { label: 'Nome da família', value: 'familyName' },
  { label: 'Convites não enviados', value: 'notSent' },
]

export const GROUP_OPTIONS: Array<Sorter> = [
  { label: '1ª Opção', value: 'firstOption' },
  { label: '2ª Opção', value: 'secondOption' },
  { label: '3ª Opção', value: 'thirdOption' },
  { label: '4ª Opção', value: 'fourthOption' },
]
