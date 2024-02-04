import type { NextFunction, Request, Response } from 'express'
import { z, type ZodError } from 'zod'

import { userCreateSchema, userUpdateSchema } from '../schemas/usersSchema.js'
import { ApiError } from '../utils/ApiError.js'

export async function validateCreateUser(
  req: Request,
  _: Response,
  next: NextFunction
): Promise<void> {
  const bodySchema = z.object({
    body: userCreateSchema,
  })

  try {
    await bodySchema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    })
    next()
  } catch (error) {
    const e = error as ZodError
    const errorMessages: string[] = []
    JSON.parse(e.message).forEach((element: any) => {
      errorMessages.push(element.message)
    })
    next(ApiError.badRequest('Bad request.', errorMessages.join(' ')))
  }
}

export async function validateUpdateUser(
  req: Request,
  _: Response,
  next: NextFunction
): Promise<void> {
  try {
    await userUpdateSchema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    })
    next()
  } catch (error) {
    const e = error as ZodError
    const errorMessages: string[] = []
    JSON.parse(e.message).forEach((element: any) => {
      errorMessages.push(element.message)
    })

    next(ApiError.badRequest('Bad request.', errorMessages.join(' ')))
  }
}
