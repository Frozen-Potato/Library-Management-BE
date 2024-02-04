import { type CrudType } from '../types/CrudStats.js'

export const httpMethodToCrudOperation = (method: string): CrudType | null => {
  switch (method) {
    case 'POST':
      return 'create'
    case 'GET':
      return 'read'
    case 'PUT':
    case 'PATCH':
      return 'update'
    case 'DELETE':
      return 'delete'
    default:
      return null
  }
}
