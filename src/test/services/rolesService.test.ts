import mongoose from 'mongoose'

import RoleRepo from '../../models/rolesModel.js'
import rolesService from '../../services/rolesService.js'
import { type RoleWithPermissionIds } from '../../types/Role.js'
import { ApiError } from '../../utils/ApiError.js'
import connect, { type MongoHelper } from '../db-helper.js'
import { rolesData } from '../mockData/rolesData.js'

describe('Roles Service', () => {
  let mongoHelper: MongoHelper

  beforeAll(async () => {
    mongoHelper = await connect()
  }, 100000)

  beforeEach(async () => {
    await RoleRepo.create(rolesData)
  }, 100000)

  afterEach(async () => {
    await mongoHelper.clearDatabase()
  }, 100000)

  afterAll(async () => {
    await mongoHelper.closeDatabase()
  }, 100000)

  describe('Create Role', () => {
    it('should create a new role', async () => {
      const newRole = { title: 'Borrowernew' }
      const createdRole = await rolesService.createRole(newRole)

      expect(createdRole).toHaveProperty('_id')
      expect(createdRole).toHaveProperty('title', newRole.title)
    })

    it('should return an error if the role already exists', async () => {
      const newRole = { title: 'Borrower' }
      const createdRole = await rolesService.createRole(newRole)

      expect(createdRole).toBeInstanceOf(ApiError)
      expect((createdRole as ApiError).message).toBe('Role already exists')
    })
  })

  describe('Find Role by ID', () => {
    it('should find a role by ID', async () => {
      const existingRole = rolesData[0]
      const foundRole = await rolesService.findById('6546a7febac08f6bd30c0505')

      expect(foundRole).toHaveProperty('_id', existingRole._id)
    })

    it('should return null if role is not found by ID', async () => {
      const roleId = '655a849986b806b0c12880ce'
      const foundRole = await rolesService.findById(roleId)

      expect(foundRole).toBeNull()
    })
  })

  describe('Find Role by Title', () => {
    it('should find a role by title', async () => {
      const title = 'Borrower'
      const foundRole = await rolesService.findByTitle(title)

      expect(foundRole).toHaveProperty('title', title)
    })

    it('should return null if role is not found by title', async () => {
      const title = 'Nonexistent Role'
      const foundRole = await rolesService.findByTitle(title)

      expect(foundRole).toBeNull()
    })
  })

  describe('Find All Roles', () => {
    it('should find all roles', async () => {
      const foundRoles = await rolesService.findAll()
      expect(foundRoles).toHaveLength(rolesData.length)
    })
  })

  describe('Add Permission', () => {
    it('should add a permission to a role', async () => {
      const roleId = new mongoose.Types.ObjectId(rolesData[0]._id)
      const permissionId = new mongoose.Types.ObjectId(
        '655a849986b806b0c12880d0'
      )

      const updatedRole = await rolesService.addPermission(roleId, permissionId)

      expect(updatedRole).toHaveProperty('permissions')
      expect((updatedRole as RoleWithPermissionIds).permissions).toContain(
        permissionId
      )
    })

    it('should return an error if the role does not exist', async () => {
      const nonExistentRoleId = new mongoose.Types.ObjectId()
      const permissionId = new mongoose.Types.ObjectId(
        '655a849986b806b0c12880d0'
      )

      const result = await rolesService.addPermission(
        nonExistentRoleId,
        permissionId
      )

      expect(result).toBeInstanceOf(ApiError)
      expect((result as ApiError).message).toBe('Role not found')
    })
  })
})
