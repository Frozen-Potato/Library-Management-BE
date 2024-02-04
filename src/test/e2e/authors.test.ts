import request from 'supertest'

import connect, { type MongoHelper } from '../db-helper.js'
import { authorsData } from '../mockData/authorsData.js'
import AuthorRepo from '../../models/authorsModel.js'
import app from '../../app.js'

describe('Testing /authors', () => {
  let mongoHelper: MongoHelper

  beforeAll(async () => {
    mongoHelper = await connect()
  })

  beforeEach(async () => {
    await AuthorRepo.create(authorsData[0])
  })

  afterEach(async () => {
    await mongoHelper.clearDatabase()
  })

  afterAll(async () => {
    await mongoHelper.closeDatabase()
  })

  describe('Create a new author', () => {
    test('should create a new author to the database', async () => {
      const newAuthor = {
        firstName: 'William',
        lastName: 'Shakespeare',
        books: ['6546a899f28fbf438938fb12', '6546a899f28fbf438938fb13'],
      }

      const response = await request(app)
        .post('/api/v1/authors')
        .send(newAuthor)

      expect(response).toHaveProperty('status', 403)
    })

    test('should fail to add an existing author to the database', async () => {
      const newAuthor = {
        firstName: 'Leo',
        lastName: 'Tolstoy',
        books: ['6546a899f28fbf438938fb12', '6546a899f28fbf438938fb13'],
      }

      const response = await request(app)
        .post('/api/v1/authors')
        .send(newAuthor)

      expect(response).toHaveProperty('status', 403)
    })
  })

  describe('Get authors', () => {
    test('should get all authors in the database', async () => {
      const response = await request(app).get('/api/v1/authors')

      expect(response).toHaveProperty('status', 200)
      expect(response.text).toMatch('_id')
    })

    test('should get an author by _id in the database', async () => {
      const response = await request(app).get(
        '/api/v1/authors/6546a7febac08f6bd30c0505'
      )

      expect(response).toHaveProperty('status', 200)
      expect(response.text).toMatch('_id')
    })

    test('should fail to get a non-existing author by _id in the database', async () => {
      const response = await request(app).get(
        '/api/v1/authors/6546a7febac08f6bd30c0506'
      )

      expect(response).toHaveProperty('status', 404)
      expect(response.text).toMatch('Author not found.')
    })
  })

  describe('Update author', () => {
    test('should update author by id in the database', async () => {
      const payload = {
        lastName: 'Messi',
      }

      const response = await request(app)
        .put('/api/v1/authors/6546a7febac08f6bd30c0505')
        .send(payload)

      expect(response).toHaveProperty('status', 403)
    })

    test('should fail to update a non-existing author by id in the database', async () => {
      const payload = {
        lastName: 'Messi',
      }

      const response = await request(app)
        .put('/api/v1/authors/6546a7febac08f6bd30c0506')
        .send(payload)

      expect(response).toHaveProperty('status', 403)
    })
  })

  describe('Delete author', () => {
    test('should delete an existing author by id in the database', async () => {
      const response = await request(app).delete(
        '/api/v1/authors/6546a7febac08f6bd30c0505'
      )

      expect(response).toHaveProperty('status', 403)
    })

    test('should fail to delete a non-existing existing author by id in the database', async () => {
      const response = await request(app).delete(
        '/api/v1/authors/6546a7febac08f6bd30c0506'
      )

      expect(response).toHaveProperty('status', 403)
    })
  })
})
