import type { NextFunction, Request, Response } from 'express'

import PermissionsService from '../services/permissionsService.js'
import { ApiError } from '../utils/ApiError.js'

const permissionsController = {
  async findAllPermissions(_: Request, res: Response): Promise<void> {
    const permissions = await PermissionsService.findAll()
    res.json(permissions)
  },

  async findOnePermission(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const permissionId = req.params.permissionId
    const permission = await PermissionsService.findById(permissionId)

    if (permission instanceof ApiError) {
      next(permission)
      return
    }

    res.json(permission)
  },

  async createNewPermission(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const newPermission = req.body
    const permission = await PermissionsService.createPermission(newPermission)

    if (permission instanceof ApiError) {
      next(permission)
      return
    }

    res.status(201).json(permission)
  },

  async deletePermission(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const deletedPermissionId = req.params.permissionId
    const permission =
      await PermissionsService.deletePermission(deletedPermissionId)

    if (permission instanceof ApiError) {
      next(permission)
      return
    }
    res.status(204).json(permission)
  },

  async updatePermission(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const permissionId = req.params.permissionId
    const body = req.body
    const user = await PermissionsService.updatePermission(permissionId, body)

    if (user instanceof ApiError) {
      next(user)
      return
    }

    res.status(200).json(user)
  },
}

export default permissionsController
