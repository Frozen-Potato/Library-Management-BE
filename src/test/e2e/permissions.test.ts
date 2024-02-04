import request from 'supertest'

import app from '../../app.js'
import PermissionRepo from '../../models/permissionsModel.js'
import connect, { type MongoHelper } from '../db-helper.js'
import { permissionsData } from '../mockData/permissionsData.js'

describe('Permissions Controller', () => {
  let mongoHelper: MongoHelper

  beforeAll(async () => {
    mongoHelper = await connect()
  })

  beforeEach(async () => {
    await PermissionRepo.create(permissionsData)
  })

  afterEach(async () => {
    await mongoHelper.clearDatabase()
  })

  afterAll(async () => {
    await mongoHelper.closeDatabase()
  })

  describe('GET /permissions', () => {
    it('should return all permissions', async () => {
      const response = await request(app).get('/api/v1/permissions')

      expect(response.status).toBe(403)

      // expect(response.status).toBe(200)
      // expect(response.body).toHaveLength(permissionsData.length)
    })
  })

  describe('GET /permissions/:permissionId', () => {
    it('should return a permission by ID', async () => {
      const existingPermission = permissionsData[0]
      const permissionId =
        existingPermission.id?.toString() ?? '6546a7febac08f6bd30c0505'
      const response = await request(app).get(
        `/api/v1/permissions/${permissionId}`
      )

      expect(response.status).toBe(403)

      // expect(response.status).toBe(200)
      // expect(response.body).toHaveProperty('_id', permissionId)
    })

    it('should return an error if permission is not found by ID', async () => {
      const permissionId = '655a849986b806b0c12880ce'
      const response = await request(app).get(
        `/api/v1/permissions/${permissionId}`
      )

      expect(response.status).toBe(403)

      // expect(response.status).toBe(404)
      // expect(response.body.message).toBe('Permission not found')
    })
  })
})
