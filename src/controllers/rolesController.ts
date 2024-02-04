import type { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'

import RolesService from '../services/rolesService.js'
import { ApiError } from '../utils/ApiError.js'

export async function findAllRoles(_: Request, res: Response): Promise<void> {
  const roles = await RolesService.findAll()
  res.json(roles)
}

export async function createNewRole(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const newRole = req.body
  const role = await RolesService.createRole(newRole)
  if (role === null) {
    next(
      ApiError.badRequest(
        'This ROLE is not available, please insert another one'
      )
    )
    return
  }
  res.status(201).json(role)
}

export async function addPermission(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const roleId = new mongoose.Types.ObjectId(req.params.roleId)
  const permissionId = new mongoose.Types.ObjectId(req.body.permissionId)
  const role = await RolesService.addPermission(roleId, permissionId)

  res.status(201).json(role)
}

export default {
  findAllRoles,
  createNewRole,
  addPermission,
}
