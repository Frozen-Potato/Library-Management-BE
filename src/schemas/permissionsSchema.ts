import { z } from 'zod'

export const permissionSchema = z.object({
  action: z
    .string({ required_error: 'Action is required' })
    .min(1, 'Action can not be empty.'),
})
export const permissionCreateSchema = z.object({
  body: permissionSchema,
})

export const permissionUpdateSchema = z.object({
  body: permissionSchema,
})
