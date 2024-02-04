import type { NextFunction, Request, Response } from 'express'

import UserRolesService from '../services/userRolesService.js'
import UsersService from '../services/usersService.js'
import { ApiError } from '../utils/ApiError.js'
import { type WithAuthRequest } from '../types/User.js'
import RoleRepo from '../models/rolesModel.js'

export async function findAllUsers(_: Request, res: Response): Promise<void> {
  const users = await UsersService.findAll()

  res.json(users)
}

export async function findOneUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userId = req.params.userId
  const user = await UsersService.findOne(userId)

  if (user === null) {
    next(ApiError.notFound('User not found'))
    return
  } else if (user instanceof Error) {
    next(ApiError.badRequest('Bad request.', user.message))
    return
  }
  res.json(user)
}
export async function findByEmail(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userEmail = req.params.email
  const user = await UsersService.findByEmail(userEmail)

  if (user === null) {
    next(ApiError.notFound('User not found'))
    return
  } else if (user instanceof Error) {
    next(ApiError.badRequest('Bad request.', user.message))
    return
  }
  res.json(user)
}

export async function getUserProfile(
  req: WithAuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const decoded = req.decoded
  const userId = decoded?.userId as string
  const userData = await UsersService.findProfile(userId)

  if (userData instanceof ApiError) {
    next(ApiError.badRequest('Bad request.', userData.message))
    return
  }

  if (userData.length === 0) {
    next(ApiError.notFound('User not found'))
    return
  }

  res.json(userData[0])
}

export async function createNewUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const newUser = req.body
  const user = await UsersService.createUser(newUser)
  if (user === null) {
    next(
      ApiError.badRequest('Email is not available, please insert another one')
    )
    return
  } else if (!(user instanceof Error)) {
    const role = await RoleRepo.findOne({ title: 'Borrower' })
    if (role !== null && role !== undefined) {
      await UserRolesService.addRoleToUser({
        user_id: user.id,
        role_id: role.id,
      })
    }
  }

  res.status(201).json(user)
}

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const deletedUserId = req.params.userId
  const user = await UsersService.deleteUser(deletedUserId)

  if (user === null) {
    next(ApiError.notFound('User does not exist'))
    return
  } else if (user instanceof Error) {
    console.log(user.message)
    next(ApiError.badRequest('Bad request.', user.message))
    return
  }
  res.status(204).json()
}

export async function updateUser(
  req: WithAuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const decoded = req.decoded
  const userId = decoded?.userId as string
  const body = req.body
  const user = await UsersService.updateUser(userId, body)
  if (user === null) {
    next(ApiError.notFound('User not found'))
    return
  } else if (user instanceof Error) {
    next(ApiError.badRequest('Bad request.', user.message))
    return
  }

  res.json(user)
}
export async function updateUserById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userId = req.params.userId
  const body = req.body
  const user = await UsersService.updateUser(userId, body)
  if (user === null) {
    next(ApiError.notFound('User not found'))
    return
  } else if (user instanceof Error) {
    next(ApiError.badRequest('Bad request.', user.message))
    return
  }

  res.json(user)
}

export default {
  findOneUser,
  findByEmail,
  findAllUsers,
  getUserProfile,
  createNewUser,
  deleteUser,
  updateUser,
  updateUserById,
}
