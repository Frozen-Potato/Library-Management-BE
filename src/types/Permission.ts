import { type Types } from 'mongoose'
import { type z } from 'zod'

import { type permissionSchema } from '../schemas/permissionsSchema.js'

export type PermissionDTO = z.infer<typeof permissionSchema>
export type BasicPermission = PermissionDTO & { id: Types.ObjectId }
export type PermissionUpdate = Omit<BasicPermission, 'id'>
