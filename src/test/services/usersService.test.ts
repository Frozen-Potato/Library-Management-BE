import { convertedUsersData, usersData } from '../mockData/usersData.js'
import UserRepo from '../../models/usersModel.js'
import connect, { type MongoHelper } from '../db-helper.js'
import usersService from '../../services/usersService.js'
import type { User } from '../../types/User.js'

describe('User Service', () => {
  let mongoHelper: MongoHelper

  beforeAll(async () => {
    mongoHelper = await connect()
  }, 100000)

  beforeEach(async () => {
    await UserRepo.create(convertedUsersData)
  }, 100000)

  afterEach(async () => {
    await mongoHelper.clearDatabase()
  }, 100000)

  afterAll(async () => {
    await mongoHelper.closeDatabase()
  }, 100000)

  describe('Find all users', () => {
    it('should find all users', async () => {
      const foundUsers = await usersService.findAll()

      expect(foundUsers).toHaveLength(usersData.length)
    })
  })

  describe('Find one user by ID', () => {
    // if this fail, please check user ID in usersData, it may cause the failure test
    const testUser = usersData[0]
    it('should find a user by their id', async () => {
      const foundUser = await usersService.findOne('655c81c6155012574e0bd4af')

      expect(foundUser).toHaveProperty('_id', testUser.id)
    })

    it('should return null when find by non-exist id', async () => {
      const nonExistUser = await usersService.findOne(
        '655c81c6155012574e0bd4aA'
      )

      expect(nonExistUser).toBeNull()
    })
  })

  describe('Find one user by email', () => {
    it('should find a user by their email', async () => {
      const testUser = convertedUsersData[2]
      const foundUser = await usersService.findByEmail(
        'tung.nguyen1@integrify.io'
      )

      expect(foundUser).toMatchObject(testUser)
    })

    it('should return null when find by non-exist email', async () => {
      const nonExistUser = await usersService.findByEmail('NULL@integrify.io')

      expect(nonExistUser).toBeNull()
    })
  })

  describe('Create new user', () => {
    it('should create new user with email which does not exist in the DB', async () => {
      const user = {
        firstName: 'TEST',
        lastName: 'TEST',
        email: 'TEST@mail.com',
        address: 'TEST',
        avatar: 'https://placehold.co/600x400',
        phoneNumber: 'TEST',
        password: 'TEST',
        confirmPassword: 'TEST',
      }
      const newUser = (await usersService.createUser(user)) as User

      expect(newUser).toHaveProperty('_id')
      expect(newUser.email).toEqual('TEST@mail.com')
    })

    it('should NOT create new user with existing email in the DB', async () => {
      const user = {
        firstName: 'TEST',
        lastName: 'TEST',
        email: 'tung.nguyen1@integrify.io',
        address: 'TEST',
        avatar: 'https://placehold.co/600x400',
        phoneNumber: 'TEST',
        password: 'TEST',
        confirmPassword: 'TEST',
      }
      const isAvailable = await usersService.createUser(user)

      expect(isAvailable).toBeNull()
    })
  })

  describe('Delete an user', () => {
    it('should delete an user with existing ID', async () => {
      const id = '655c81c6155012574e0bd4af'

      const deletedUser = (await usersService.deleteUser(id)) as User

      expect(deletedUser.email).toEqual('phuoc5@mail.com')
    })

    it('should NOT delete any user with non-existing ID', async () => {
      const wrongID = '655c81c6155012574e0bd4aA'
      const nonExistUser = await usersService.deleteUser(wrongID)

      expect(nonExistUser).toBeNull()
    })
  })

  describe('Update an user', () => {
    it('should update an user with existing ID', async () => {
      const updatedUser = (await usersService.updateUser(
        '655e4ea5ad90a281f06aa8c3',
        { email: 'newemail@integrify.io' }
      )) as User

      expect(updatedUser).toHaveProperty('_id')
      expect(updatedUser.email).toEqual('newemail@integrify.io')
    })

    it('should NOT update any user with non-existing ID', async () => {
      const isNull = await usersService.updateUser('655e4ea5ad90a281f06aa8cA', {
        email: 'newemail@integrify.io',
      })

      expect(isNull).toBeNull()
    })
  })
})
