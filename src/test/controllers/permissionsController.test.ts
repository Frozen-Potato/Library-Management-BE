import { type NextFunction, type Request, type Response } from 'express'

import permissionsController from '../../controllers/permissionsController.js'
import PermissionsService from '../../services/permissionsService.js'
import { ApiError } from '../../utils/ApiError.js'
import { permissionsData } from '../mockData/permissionsData.js'

describe('Permissions Controller', () => {
  let req: Request
  let res: Response
  let next: NextFunction

  beforeEach(() => {
    req = {
      body: jest.fn(),
      params: jest.fn(),
    } as unknown as Request

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response

    next = jest.fn() as NextFunction
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('findAllPermissions', () => {
    const findAllPermissionsMock = jest.spyOn(PermissionsService, 'findAll')

    it('should return all permissions', async () => {
      const permissions = permissionsData
      findAllPermissionsMock.mockResolvedValue(permissions)

      await permissionsController.findAllPermissions(req, res)

      expect(findAllPermissionsMock).toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(permissions)
    })
  })

  describe('findOnePermission', () => {
    const findByIdMock = jest.spyOn(PermissionsService, 'findById')

    it('should return a permission', async () => {
      const permission = permissionsData[0]
      const permissionId = String(permission.id)
      findByIdMock.mockResolvedValue(permission)

      req.params = {
        permissionId,
      }

      await permissionsController.findOnePermission(req, res, next)

      expect(findByIdMock).toHaveBeenCalledWith(permissionId)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(permission)
    })

    it('should call next with an error if permission not found', async () => {
      const permission = permissionsData[0]
      const permissionId = String(permission.id)
      const error = ApiError.notFound('Permission not found')
      findByIdMock.mockResolvedValue(error)

      req.params = {
        permissionId,
      }

      await permissionsController.findOnePermission(req, res, next)

      expect(findByIdMock).toHaveBeenCalledWith(permissionId)
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('createNewPermission', () => {
    const createPermissionMock = jest.spyOn(
      PermissionsService,
      'createPermission'
    )

    it('should create a new permission and return 201 status code', async () => {
      const newPermission = permissionsData[0]
      createPermissionMock.mockResolvedValue(newPermission)

      req.body = newPermission

      await permissionsController.createNewPermission(req, res, next)

      expect(createPermissionMock).toHaveBeenCalledWith(newPermission)
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(newPermission)
    })

    it('should call next with an error if permission not created', async () => {
      const newPermission = {
        action: 'test',
      }
      const error = ApiError.internal('Error creating permission')
      createPermissionMock.mockResolvedValue(error)

      req.body = newPermission

      await permissionsController.createNewPermission(req, res, next)

      expect(createPermissionMock).toHaveBeenCalledWith(newPermission)
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('updatePermission', () => {
    const updatePermissionMock = jest.spyOn(
      PermissionsService,
      'updatePermission'
    )

    it('should update a permission and return 200 status code', async () => {
      const updatedPermission = permissionsData[0]
      updatePermissionMock.mockResolvedValue(updatedPermission)

      req.params = {
        permissionId: String(updatedPermission.id),
      }

      req.body = updatedPermission

      await permissionsController.updatePermission(req, res, next)

      expect(updatePermissionMock).toHaveBeenCalledWith(
        String(updatedPermission.id),
        updatedPermission
      )
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(updatedPermission)
    })

    it('should call next with an error if permission not found', async () => {
      const updatedPermission = permissionsData[0]
      const error = ApiError.notFound('Permission not found')
      updatePermissionMock.mockResolvedValue(error)

      req.params = {
        permissionId: String(updatedPermission.id),
      }

      req.body = updatedPermission

      await permissionsController.updatePermission(req, res, next)

      expect(updatePermissionMock).toHaveBeenCalledWith(
        String(updatedPermission.id),
        updatedPermission
      )
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('deletePermission', () => {
    const deletePermissionMock = jest.spyOn(
      PermissionsService,
      'deletePermission'
    )

    it('should delete a permission and return 204 status code', async () => {
      const deletedPermissionResponse = permissionsData[0]
      deletePermissionMock.mockResolvedValue(deletedPermissionResponse)

      req.params = {
        permissionId: String(deletedPermissionResponse.id),
      }

      await permissionsController.deletePermission(req, res, next)

      expect(deletePermissionMock).toHaveBeenCalledWith(
        String(deletedPermissionResponse.id)
      )
      expect(res.status).toHaveBeenCalledWith(204)
      expect(res.json).toHaveBeenCalledWith()
    })

    it('should return 404 status code if permission not found', async () => {
      deletePermissionMock.mockResolvedValue(
        ApiError.notFound('Permission not found')
      )

      req.params = {
        permissionId: String(permissionsData[0].id),
      }

      await permissionsController.deletePermission(req, res, next)

      expect(deletePermissionMock).toHaveBeenCalledWith(
        String(permissionsData[0].id)
      )

      expect(next).toHaveBeenCalledWith(
        ApiError.notFound('Permission not found')
      )
    })
  })
})
