import { type NextFunction } from 'express'
import { type ZodError, type ZodTypeAny } from 'zod'
import { ApiError } from './ApiError.js'
import customZodErrorParser from './customZodErrorParser.js'
import errorMap from './customZodError.js'

const validatorTryCatch = (
  data: Record<string, any>,
  schema: ZodTypeAny,
  next: NextFunction
): void => {
  try {
    schema.parse(data, errorMap)
    next()
  } catch (error) {
    const e = error as ZodError
    const errorMessages = e.flatten()
    next(
      ApiError.badRequest('Bad request.', customZodErrorParser(errorMessages))
    )
  }
}

export default validatorTryCatch
