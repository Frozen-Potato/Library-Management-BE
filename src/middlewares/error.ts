import { type NextFunction, type Request, type Response } from 'express'

import { ApiError } from '../utils/ApiError.js'

export function apiErrorHandler(
  error: typeof ApiError | Error,
  req: Request,
  res: Response,
  _: NextFunction
): void {
  if (error instanceof ApiError) {
    res
      .status(error.code)
      .json({ message: error.message, errors: error.errors })
    return
  }

  res.status(500).json({ message: 'Something went wrong' })
}
