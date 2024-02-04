import { type Types } from 'mongoose'
import { type z } from 'zod'

import { type roleSchema } from '../schemas/rolesSchema.js'
import { type BasicPermission } from './Permission.js'

export type RoleDTO = z.infer<typeof roleSchema>

type BasicRole = RoleDTO & { id: Types.ObjectId }

export type RoleWithPermissionIds = BasicRole & {
  permissions: Types.ObjectId[]
}

export type RoleWithPopulatedPermissions = BasicRole & {
  permissions: BasicPermission[]
}
