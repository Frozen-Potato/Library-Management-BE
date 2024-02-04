import { type Request } from 'express'
import type { JwtPayload } from 'jsonwebtoken'
import type mongoose from 'mongoose'
import type { z } from 'zod'

import type { userCreateSchema, userSchema } from '../schemas/usersSchema.js'
import { type RoleWithPermissionIds } from './Role.js'

type ObjectId = mongoose.Types.ObjectId

// User
export type UserDTO = z.infer<typeof userSchema>
export type User = UserDTO & { id: ObjectId }
export type UserUpdate = Omit<Partial<User>, 'id'>
export type UserCreate = z.infer<typeof userCreateSchema>
export interface DecodedUser extends JwtPayload {
  userId: string
  email: string
}

export interface WithAuthRequest extends Request {
  decoded?: DecodedUser
}
// User-Role (bridge table)

export interface UserRole {
  user_id: ObjectId
  role_id: ObjectId
}

export interface UserWithRole {
  user_id: User
  role_id: RoleWithPermissionIds
}

export type PopulatedUser = UserDTO & {
  role: Array<{
    id: ObjectId
    title: string
  }>
}
