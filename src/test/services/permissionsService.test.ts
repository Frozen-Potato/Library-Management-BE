import PermissionRepo from '../../models/permissionsModel.js'
import permissionsService from '../../services/permissionsService.js'
import {
  type BasicPermission,
  type PermissionDTO,
} from '../../types/Permission.js'
import { ApiError } from '../../utils/ApiError.js'
import connect, { type MongoHelper } from '../db-helper.js'
import {
  convertedPermissionsData,
  permissionsData,
} from '../mockData/permissionsData.js'

describe(' Service', () => {
  let mongoHelper: MongoHelper

  beforeAll(async () => {
    mongoHelper = await connect()
  }, 100000)

  beforeEach(async () => {
    await PermissionRepo.create(convertedPermissionsData)
  }, 100000)

  afterEach(async () => {
    await mongoHelper.clearDatabase()
  }, 100000)

  afterAll(async () => {
    await mongoHelper.closeDatabase()
  }, 100000)

  describe('Find Permission by ID', () => {
    it('should find a permission by ID', async () => {
      const existingPermission = permissionsData[0]
      const foundPermission = await permissionsService.findById(
        '6546a7febac08f6bd30c0505'
      )

      expect(foundPermission).toHaveProperty('_id', existingPermission.id)
    })

    it('should return null if permission is not found by ID', async () => {
      const permissionId = '655a849986b806b0c12880ce'
      const foundPermission = await permissionsService.findById(permissionId)

      expect(foundPermission).toBeInstanceOf(ApiError)
      expect((foundPermission as ApiError).message).toBe('Permission not found')
    })

    it('should return an ApiError if an internal error occurs', async () => {
      const permissionId = '655a849986b806b0c12880ce'

      jest
        .spyOn(PermissionRepo, 'findById')
        .mockRejectedValueOnce(new Error('Internal error'))

      const foundPermission = await permissionsService.findById(permissionId)

      expect(foundPermission).toBeInstanceOf(ApiError)
      expect((foundPermission as ApiError).message).toBe('Internal error')
    })
  })

  describe('Find All Permissions', () => {
    it('should find all permissions', async () => {
      const foundPermissions = await permissionsService.findAll()
      expect(foundPermissions).toHaveLength(permissionsData.length)
    })
  })

  describe('Create Permission', () => {
    it('should create a new permission', async () => {
      const newPermission = {
        action: 'USERS_READ',
      }

      const createdPermission =
        await permissionsService.createPermission(newPermission)

      expect(createdPermission).toHaveProperty('_id')
      expect((createdPermission as BasicPermission).action).toBe(
        newPermission.action
      )
    })

    it('should return an ApiError if permission already exists', async () => {
      const existingPermission: PermissionDTO = {
        action: 'USERS_CREATE',
      }

      const createdPermission =
        await permissionsService.createPermission(existingPermission)

      expect(createdPermission).toBeInstanceOf(ApiError)
      expect((createdPermission as ApiError).message).toBe(
        'Permission already exists'
      )
    })

    it('should return an ApiError if an internal error occurs', async () => {
      const newPermission: PermissionDTO = {
        action: 'read',
      }

      jest
        .spyOn(PermissionRepo, 'exists')
        .mockRejectedValueOnce(new Error('Internal error'))

      const createdPermission =
        await permissionsService.createPermission(newPermission)

      expect(createdPermission).toBeInstanceOf(ApiError)
      expect((createdPermission as ApiError).message).toBe('Internal error')
    })
  })
  describe('Delete Permission', () => {
    it('should delete a permission by ID', async () => {
      const permissionId = '6546a7febac08f6bd30c0505'
      const deletedPermission =
        await permissionsService.deletePermission(permissionId)

      expect(deletedPermission).toHaveProperty('_id')
    })

    it('should return an ApiError if permission is not found by ID', async () => {
      const permissionId = '655a849986b806b0c12880ce'

      const deletedPermission =
        await permissionsService.deletePermission(permissionId)

      expect(deletedPermission).toBeInstanceOf(ApiError)
      expect((deletedPermission as ApiError).message).toBe(
        'Permission not found'
      )
    })

    it('should return an ApiError if an internal error occurs', async () => {
      const permissionId = '655a849986b806b0c12880ce'
      jest
        .spyOn(PermissionRepo, 'findByIdAndDelete')
        .mockRejectedValueOnce(new Error('Internal error'))

      const deletedPermission =
        await permissionsService.deletePermission(permissionId)

      expect(deletedPermission).toBeInstanceOf(ApiError)
      expect((deletedPermission as ApiError).message).toBe('Internal error')
    })
  })

  describe('Update Permission', () => {
    it('should update a permission by ID', async () => {
      const permissionId = '6546a7febac08f6bd30c0505'
      const payload = {
        action: 'USERS_WRITE',
      }

      const updatedPermission = await permissionsService.updatePermission(
        permissionId,
        payload
      )

      expect(updatedPermission).toHaveProperty('_id')
      expect((updatedPermission as BasicPermission).action).toBe(payload.action)
    })

    it('should return an ApiError if permission is not found by ID', async () => {
      const permissionId = '655a849986b806b0c12880ce'
      const payload = {
        action: 'USERS_WRITE',
      }

      const updatedPermission = await permissionsService.updatePermission(
        permissionId,
        payload
      )

      expect(updatedPermission).toBeInstanceOf(ApiError)
      expect((updatedPermission as ApiError).message).toBe(
        'Permission not found'
      )
    })

    it('should return an ApiError if an internal error occurs', async () => {
      const permissionId = '655a849986b806b0c12880ce'
      const payload = {
        action: 'USERS_WRITE',
      }

      jest
        .spyOn(PermissionRepo, 'findOneAndUpdate')
        .mockRejectedValueOnce(new Error('Internal error'))

      const updatedPermission = await permissionsService.updatePermission(
        permissionId,
        payload
      )

      expect(updatedPermission).toBeInstanceOf(ApiError)
      expect((updatedPermission as ApiError).message).toBe('Internal error')
    })
  })
})
