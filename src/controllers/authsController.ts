/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { type NextFunction, type Request, type Response } from 'express'
import jwt from 'jsonwebtoken'

import authsService from '../services/authsService.js'
import { ApiError } from '../utils/ApiError.js'
import type { User, UserCreate } from '../types/User.js'

async function signin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { email, password } = req.body

  const credencial = { email, password }
  try {
    const accessToken = await authsService.signin(credencial)
    if (accessToken === null) {
      next(ApiError.notFound('User not found'))
      return
    } else if (accessToken instanceof Error) {
      next(ApiError.badRequest('Bad request.', accessToken.message))
      return
    }
    res.json({ accessToken })
  } catch (err) {
    next(ApiError.internal('Internal server error'))
  }
}

function loginWithGoogle(req: any, res: Response): void {
  const user = req.user as User | undefined

  if (user) {
    const payload = {
      userId: user.id,
      email: user.email,
    }

    const accessToken = jwt.sign(payload, process.env.TOKEN_SECRET as string, {
      expiresIn: '1h',
    })
    res.json({ accessToken })
  }
}

async function signup(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      phoneNumber,
      avatar,
      address,
    } = req.body
    const user: UserCreate = {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      phoneNumber,
      avatar,
      address,
    }
    const accessToken = await authsService.signup(user)

    if (accessToken instanceof ApiError) {
      next(accessToken)
    }

    res.status(201).json({ accessToken })
  } catch (error) {
    if (error instanceof ApiError) {
      next(error)
    } else {
      next(ApiError.internal('Internal server error'))
    }
  }
}

export default {
  signin,
  loginWithGoogle,
  signup,
}
