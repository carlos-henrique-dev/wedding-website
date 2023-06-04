import { Filters } from '../interfaces'

export const FILTERS_OPTIONS: Filters = [
  { label: 'Todos', value: 'all' },
  { label: 'Enviados', value: 'sent' },
  { label: 'Não enviados', value: 'notSent' },
  { label: 'Confirmados', value: 'confirmed' },
  { label: 'Não confirmados', value: 'notConfirmed' },
]
