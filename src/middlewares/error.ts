import { type NextFunction, type Request, type Response } from 'express'

import { ApiError } from '../utils/ApiError.js'

export function apiErrorHandler(
  error: typeof ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (error instanceof ApiError) {
    res.status(error.code).json({ msg: error.message })
    return
  }

  res.status(500).json({ msg: 'Something went wrong' })
}
