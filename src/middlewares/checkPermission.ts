import type { NextFunction, Response } from 'express'

import rolesService from '../services/rolesService.js'
import userRolesService from '../services/userRolesService.js'
import { type WithAuthRequest } from '../types/User.js'
import { ApiError } from '../utils/ApiError.js'
import { type Permission } from '../utils/auth.js'

export function checkPermission(...permissions: Permission[]) {
  return async (req: WithAuthRequest, res: Response, next: NextFunction) => {
    const user = req.decoded
    if (user === null || user === undefined || user.userId.length === 0) {
      next(ApiError.unauthorized('Unauthorized'))
      return
    }

    const userRoles = await userRolesService.findByUserId(user.userId)
    const userPermissions: string[] = []

    if (
      userRoles !== null &&
      userRoles !== undefined &&
      !(userRoles instanceof Error)
    ) {
      const permissionsPromises = userRoles.map(async (userRole: any) => {
        const role = await rolesService.findByIdWithPermissions(
          userRole.role_id
        )

        if (role !== null && role !== undefined && !(role instanceof Error)) {
          role.permissions.forEach((permission) => {
            userPermissions.push(permission.action)
          })
        }
      })

      await Promise.all(permissionsPromises)
    }

    const hasGeneralPermission = permissions.some(
      (permission) =>
        !permission.endsWith('_ONE') && userPermissions.includes(permission)
    )

    const hasSelfOnlyPermission = permissions.some(
      (permission) =>
        permission.endsWith('_ONE') && userPermissions.includes(permission)
    )

    console.log(
      'SelfOnlyPermission:',
      hasSelfOnlyPermission,
      'PERMISSIONS 🤔🧠:',
      userPermissions
    )

    if (hasGeneralPermission) {
      next()
      return
    }

    if (hasSelfOnlyPermission) {
      const userId = req.params.userId
      if (user.userId === userId) {
        next()
        return
      }
    }

    next(ApiError.forbidden('Access Denied: Insufficient Permissions.'))
  }
}
