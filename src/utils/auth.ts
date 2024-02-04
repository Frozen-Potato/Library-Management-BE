export const RESOURCES = [
  'USERS',
  'BOOKS',
  'AUTHORS',
  'PERMISSIONS',
  'ROLES',
  'BORROW',
  'CART',
] as const

export const ACTIONS = [
  'DELETE',
  'DELETE_ONE',
  'UPDATE',
  'UPDATE_ONE',
  'CREATE',
  'CREATE_ONE',
  'READ',
  'READ_ONE',
] as const

export type Resource = (typeof RESOURCES)[number]
export type Action = (typeof ACTIONS)[number]

export type Permission = `${Resource}_${Action}`
