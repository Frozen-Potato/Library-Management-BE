import type { NextFunction, Request, Response } from 'express'

import UserRolesService from '../services/userRolesService.js'

import { ApiError } from '../utils/ApiError.js'
import mongoose from 'mongoose'

export async function findAllUserRole(
  _: Request,
  res: Response
): Promise<void> {
  const users = await UserRolesService.findAllUserRole()

  res.json(users)
}

export async function findByUserId(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userId = req.params.userId
  const user = await UserRolesService.findByUserId(userId)

  if (user === null) {
    next(ApiError.notFound('User not found'))
    return
  } else if (user instanceof Error) {
    next(ApiError.badRequest('Bad request.', user.message))
    return
  }
  res.json(user)
}

export async function addRoleToUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userId = new mongoose.Types.ObjectId(req.params.userId)
  const roleId = new mongoose.Types.ObjectId(req.body.role)
  const newRoleToUser = await UserRolesService.addRoleToUser({
    user_id: userId,
    role_id: roleId,
  })

  if (newRoleToUser === null) {
    next(ApiError.badRequest('User or Role does not exist'))
    return
  } else if (newRoleToUser instanceof Error) {
    next(ApiError.badRequest('Bad request.', newRoleToUser.message))
    return
  }

  res.json(newRoleToUser)
}

export async function deleteUserRole(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userId = req.params.userId
  const user = await UserRolesService.deleteUserRole(userId)
  if (user === null) {
    next(ApiError.notFound('User not found'))
    return
  } else if (user instanceof Error) {
    next(ApiError.badRequest('Bad request.', user.message))
    return
  }

  res.sendStatus(204)
}
export async function updateUserRole(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userId = req.params.userId
  const body = req.body
  const user = await UserRolesService.updateUserRole(userId, body)
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
  findAllUserRole,
  findByUserId,
  deleteUserRole,
  addRoleToUser,
  updateUserRole,
}
