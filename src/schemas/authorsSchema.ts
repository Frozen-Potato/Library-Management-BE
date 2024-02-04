import mongoose from 'mongoose'
import { z } from 'zod'

export const authorCreateSchema = z
  .object({
    firstName: z
      .string({
        required_error: 'First name is required.',
      })
      .min(1, 'First name cannot be empty.'),
    lastName: z
      .string({
        required_error: 'Last name is required.',
      })
      .min(1, 'Last name cannot be empty.'),
    books: z
      .array(
        z
          .string()
          .min(1, 'Book id cannot be empty.')
          .transform((val) => new mongoose.Types.ObjectId(val))
      )
      .min(1, { message: 'Book array cannot be empty.' })
      .default([]),
    image: z
      .string({ required_error: 'Image URL cannot be empty.' })
      .url({ message: 'Invalid URL.' }),
  })
  .strict()

export const authorUpdateSchema = z
  .object({
    firstName: z.string().min(1, 'First name cannot be empty.').optional(),
    lastName: z.string().min(1, 'Last name cannot be empty.').optional(),
    books: z
      .string()
      .min(1, 'Book id cannot be empty.')
      .transform((val) => new mongoose.Types.ObjectId(val))
      .array()
      .nonempty({ message: 'Book array cannot be empty.' })
      .optional(),
    image: z
      .string({ required_error: 'Image URL cannot be empty.' })
      .url({ message: 'Invalid URL.' })
      .optional(),
  })
  .strict()
