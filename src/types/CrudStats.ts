export type CrudType = 'create' | 'read' | 'update' | 'delete'

export interface CrudOperation {
  total: number
  successful: number
}

export type CrudStats = {
  [key in CrudType]: CrudOperation
}
