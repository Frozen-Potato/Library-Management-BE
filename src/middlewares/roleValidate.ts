import type { NextFunction, Request, Response } from 'express'
import type { ZodError } from 'zod'

import { roleCreateSchema } from '../schemas/rolesSchema.js'
import { ApiError } from '../utils/ApiError.js'

export async function validateCreateRole(
  req: Request,
  _: Response,
  next: NextFunction
): Promise<void> {
  try {
    await roleCreateSchema.parseAsync({
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
