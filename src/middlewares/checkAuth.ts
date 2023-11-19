import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import type { DecodedUser } from '../types/User.js'
import { ApiError } from '../utils/ApiError.js'

export interface WithAuthRequest extends Request {
  decoded?: DecodedUser
}

export async function checkAuth(
  req: WithAuthRequest,
  _: Response,
  next: NextFunction
): Promise<void> {
  const token = req.headers.authorization?.split(' ')[1]
  if (token === undefined) {
    next(
      ApiError.forbidden(
        'TOKEN is missing (Unauthorized to proceed action) ❌🔙❌'
      )
    )
    return
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.TOKEN_SECRET as string
    ) as DecodedUser

    req.decoded = decoded
    next()
  } catch (e) {
    next(ApiError.forbidden('Invalid token'))
  }
}
