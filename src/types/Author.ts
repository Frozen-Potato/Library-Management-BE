import { type z } from 'zod'
import type mongoose from 'mongoose'

import { type authorCreateSchema } from '../schemas/authorsSchema.js'

type AuthorDTO = z.infer<typeof authorCreateSchema>

export type Author = AuthorDTO & { id: mongoose.Types.ObjectId }
