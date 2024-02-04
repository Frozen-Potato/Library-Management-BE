import type { NextFunction, Request, Response } from 'express'

import PermissionsService from '../services/permissionsService.js'
import { ApiError } from '../utils/ApiError.js'

const permissionsController = {
  async findAllPermissions(_: Request, res: Response): Promise<void> {
    const permissions = await PermissionsService.findAll()
    res.status(200).json(permissions)
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

    res.status(200).json(permission)
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
    res.status(204).json()
  },

  async updatePermission(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const permissionId = req.params.permissionId
    const body = req.body
    const permission = await PermissionsService.updatePermission(
      permissionId,
      body
    )

    if (permission instanceof ApiError) {
      next(permission)
      return
    }

    res.status(200).json(permission)
  },
}

export default permissionsController
