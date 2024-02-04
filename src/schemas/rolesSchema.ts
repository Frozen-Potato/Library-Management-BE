import { z } from 'zod'

export const roleSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(1, 'Title can not be empty.'),
})
export const roleCreateSchema = z.object({
  body: roleSchema,
})
