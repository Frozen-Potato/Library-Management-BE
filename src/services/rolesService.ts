import mongoose, { type Types } from 'mongoose'

import RoleRepo from '../models/rolesModel.js'
import type {
  RoleDTO,
  RoleWithPermissionIds,
  RoleWithPopulatedPermissions,
} from '../types/Role.js'
import { ApiError } from '../utils/ApiError.js'

const rolesService = {
  async findAll(): Promise<RoleWithPermissionIds[]> {
    const roles = await RoleRepo.find().exec()
    return roles as RoleWithPermissionIds[]
  },

  async findByTitle(title: string): Promise<RoleWithPermissionIds | null> {
    const role = await RoleRepo.findOne({ title })
    return role as RoleWithPermissionIds | null
  },

  async findById(
    roleId: string | Types.ObjectId
  ): Promise<RoleWithPermissionIds | null> {
    const role = await RoleRepo.findById(roleId)
    return role as RoleWithPermissionIds | null
  },

  async findByIdWithPermissions(
    roleId: string | Types.ObjectId
  ): Promise<RoleWithPopulatedPermissions | null> {
    const id =
      typeof roleId === 'string' ? new mongoose.Types.ObjectId(roleId) : roleId
    const role = await RoleRepo.findById(id).populate('permissions')
    return role as RoleWithPopulatedPermissions | null
  },

  async createRole(
    newRole: RoleDTO
  ): Promise<RoleWithPermissionIds | ApiError> {
    const isAvailable = await RoleRepo.exists({ title: newRole.title })
    if (isAvailable != null) {
      return ApiError.conflict('Role already exists')
    }

    try {
      const role = await RoleRepo.create(newRole)
      return role as RoleWithPermissionIds
    } catch (error) {
      return ApiError.internal((error as Error).message)
    }
  },

  async addPermission(
    roleId: Types.ObjectId,
    permissionId: Types.ObjectId
  ): Promise<RoleWithPermissionIds | ApiError> {
    const role = await RoleRepo.findById(roleId)
    if (role == null) {
      return ApiError.notFound('Role not found')
    }

    try {
      role.permissions.push(permissionId)
      await role.save()
      return role as RoleWithPermissionIds
    } catch (error) {
      return ApiError.internal((error as Error).message)
    }
  },
}

export default rolesService
