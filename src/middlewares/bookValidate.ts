import { type NextFunction, type Request, type Response } from 'express'

import {
  bookCreateSchema,
  bookFilterSchema,
  bookUpdateSchema,
} from '../schemas/bookSchema.js'
import validatorTryCatch from '../utils/validatorTryCatch.js'
import booksService from '../services/booksService.js'
import { ApiError } from '../utils/ApiError.js'

export const validateDuplication = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const ISBN = req.body.ISBN
  const book = await booksService.getOneByISBN(ISBN)
  if (book === null) {
    next()
  }

  if (book instanceof Error) {
    next(ApiError.badRequest('Bad request.', book.message))
  }

  if (book != null) {
    next(ApiError.badRequest('Bad request, ISBN already exist'))
  }
}

export const validateFilteringQuery = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  validatorTryCatch(req.query, bookFilterSchema, next)
}

export const validateCreateBook = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  validatorTryCatch(req.body, bookCreateSchema, next)
}

export const validateUpdateBook = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  validatorTryCatch(req.body, bookUpdateSchema, next)
}
