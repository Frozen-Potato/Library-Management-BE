import { usersData } from '../mockData/usersData.js'
import UserRepo from '../../models/usersModel.js'
import app from '../../app.js'
import request from 'supertest'
import connect, { type MongoHelper } from '../db-helper.js'

describe('User controller', () => {
  let mongoHelper: MongoHelper

  beforeAll(async () => {
    mongoHelper = await connect()
  })

  beforeEach(async () => {
    await UserRepo.create(usersData)
  })

  afterEach(async () => {
    await mongoHelper.clearDatabase()
  })

  afterAll(async () => {
    await mongoHelper.closeDatabase()
  })

  describe('GET /users', () => {
    it('should return all users', async () => {
      const response = await request(app).get('/api/v1/users')

      expect(response.status).toBe(403)
    })
  })
})
