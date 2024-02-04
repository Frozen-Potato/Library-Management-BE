import mongoose from 'mongoose'

import PermissionRepo from '../models/permissionsModel.js'
import type {
  BasicPermission,
  PermissionDTO,
  PermissionUpdate,
} from '../types/Permission.js'
import { ApiError } from '../utils/ApiError.js'

const permissionsService = {
  async findAll(): Promise<BasicPermission[]> {
    const permissions = await PermissionRepo.find().exec()
    return permissions as BasicPermission[]
  },

  async findById(permissionId: string): Promise<BasicPermission | ApiError> {
    try {
      const permission = await PermissionRepo.findById(permissionId)

      if (permission == null) {
        return ApiError.notFound('Permission not found')
      }

      return permission as BasicPermission
    } catch (error) {
      return ApiError.internal((error as Error).message)
    }
  },

  async createPermission(
    newPermission: PermissionDTO
  ): Promise<BasicPermission | ApiError> {
    try {
      const isAvailable = await PermissionRepo.exists({
        action: newPermission.action,
      })
      if (isAvailable == null) {
        const permission = await PermissionRepo.create(newPermission)
        return permission as BasicPermission
      }
      return ApiError.conflict('Permission already exists')
    } catch (error) {
      return ApiError.internal((error as Error).message)
    }
  },

  async deletePermission(
    permissionId: string
  ): Promise<BasicPermission | ApiError> {
    try {
      const result = await PermissionRepo.findByIdAndDelete(permissionId)

      if (result === null) {
        return ApiError.notFound('Permission not found')
      }
      return result as unknown as BasicPermission
    } catch (error) {
      return ApiError.internal((error as Error).message)
    }
  },

  async updatePermission(
    permissionId: string,
    payload: PermissionUpdate
  ): Promise<BasicPermission | ApiError> {
    try {
      const id = new mongoose.Types.ObjectId(permissionId)
      const updatedPermission = await PermissionRepo.findOneAndUpdate(
        { _id: id },
        payload,
        { new: true }
      )

      if (updatedPermission === null) {
        return ApiError.notFound('Permission not found')
      }

      return updatedPermission as BasicPermission
    } catch (error) {
      return ApiError.internal((error as Error).message)
    }
  },
}

export default permissionsService
