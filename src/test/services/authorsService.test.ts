import mongoose from 'mongoose'

import connect, { type MongoHelper } from '../db-helper.js'
import { authorsData } from '../mockData/authorsData.js'
import AuthorRepo from '../../models/authorsModel.js'
import AuthorsService from '../../services/authorsService.js'

describe('Testing /authors services', () => {
  let mongoHelper: MongoHelper

  beforeAll(async () => {
    mongoHelper = await connect()
  }, 100000)

  beforeEach(async () => {
    await AuthorRepo.create(authorsData[0])
  }, 100000)

  afterEach(async () => {
    await mongoHelper.clearDatabase()
  }, 100000)

  afterAll(async () => {
    await mongoHelper.closeDatabase()
  }, 100000)

  describe('Create a new author', () => {
    test('should create a new author to the database', async () => {
      const newAuthor = {
        firstName: 'William',
        lastName: 'Shakespeare',
        books: [
          new mongoose.Types.ObjectId('6546a899f28fbf438938fb12'),
          new mongoose.Types.ObjectId('6546a899f28fbf438938fb13'),
        ],
      }
      const response = await AuthorsService.createOne(newAuthor)

      expect(response).toHaveProperty('_id')
      expect(response).toHaveProperty('firstName', newAuthor.firstName)
    })

    test('should fail to add an existing author to the database', async () => {
      const newAuthor = {
        firstName: 'Leo',
        lastName: 'Tolstoy',
        books: [
          new mongoose.Types.ObjectId('6546a899f28fbf438938fb12'),
          new mongoose.Types.ObjectId('6546a899f28fbf438938fb13'),
        ],
      }
      const response = await AuthorsService.createOne(newAuthor)

      expect(response).toBe(false)
    })
  })

  describe('Get authors', () => {
    test('should get all authors in the database', async () => {
      const response = await AuthorsService.getAll()

      expect(response.length).toBe(1)
      expect(response[0]).toHaveProperty('firstName', authorsData[0].firstName)
      expect(response[0]).toHaveProperty('lastName', authorsData[0].lastName)
    })

    test('should get an author by _id in the database', async () => {
      const response = await AuthorsService.getOne('6546a7febac08f6bd30c0505')

      expect(response).toHaveProperty('_id')
      expect(response).toHaveProperty('firstName', authorsData[0].firstName)
      expect(response).toHaveProperty('lastName', authorsData[0].lastName)
    })
  })

  describe('Update author', () => {
    test('should update author by id in the database', async () => {
      const id = '6546a7febac08f6bd30c0505'
      const payload = {
        lastName: 'Messi',
      }
      const response = await AuthorsService.updateOne(id, payload)

      expect(response).toHaveProperty('_id')
      expect(response).toHaveProperty('lastName', payload.lastName)
    })
  })

  describe('Delete author', () => {
    test('should delete an existing author by id in the database', async () => {
      const response = await AuthorsService.deleteOne(
        '6546a7febac08f6bd30c0505'
      )

      expect(response).toBe(true)
    })

    test('should fail to delete a non-existing existing author by id in the database', async () => {
      const response = await AuthorsService.deleteOne(
        '6546a7febac08f6bd30c0506'
      )

      expect(response).toBe(false)
    })
  })
})
