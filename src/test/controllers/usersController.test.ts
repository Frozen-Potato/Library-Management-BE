import type { NextFunction } from 'express'
import usersController from '../../controllers/usersController.js'
import UsersService from '../../services/usersService.js'
import { ApiError } from '../../utils/ApiError.js'
import { usersData } from '../mockData/usersData.js'

describe('Users Controller Test', () => {
  let req: any
  let res: any
  let next: NextFunction

  beforeEach(() => {
    req = {
      body: jest.fn(),
      params: jest.fn(),
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }

    next = jest.fn() as NextFunction
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('findAllUsers', () => {
    const findAllUsersMock = jest.spyOn(UsersService, 'findAll')

    it('should return all users', async () => {
      const users = usersData
      findAllUsersMock.mockResolvedValue(users)

      await usersController.findAllUsers(req, res)

      expect(findAllUsersMock).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith(users)
    })
  })

  describe('findByEmail', () => {
    const findByEmailMock = jest.spyOn(UsersService, 'findByEmail')
    const user = usersData[0]
    const userEmail = user.email
    console.log(userEmail)

    it('should return one user', async () => {
      findByEmailMock.mockResolvedValue(user)

      req.params = {
        userEmail,
      }

      console.log(req.params)

      await usersController.findByEmail(req, res, next)

      expect(findByEmailMock).toHaveBeenCalled()
      // expect(findByEmailMock).toHaveBeenCalledWith(userEmail)
      expect(res.json).toHaveBeenCalledWith(user)
    })

    it('should call next with an error if user not found', async () => {
      const errorResult = null
      const error = ApiError.notFound('User not found')
      findByEmailMock.mockResolvedValue(errorResult)

      req.params = {
        userEmail,
      }

      await usersController.findByEmail(req, res, next)

      expect(findByEmailMock).toHaveBeenCalled()
      // expect(findByEmailMock).toHaveBeenCalledWith(userEmail)
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('findOneUser', () => {
    const findOneUserMock = jest.spyOn(UsersService, 'findOne')
    const user = usersData[0]
    const userId = String(user.id)

    it('should return one user', async () => {
      findOneUserMock.mockResolvedValue(user)

      req.params = {
        userId,
      }

      await usersController.findOneUser(req, res, next)

      expect(findOneUserMock).toHaveBeenCalledWith(userId)
      expect(res.json).toHaveBeenCalledWith(user)
    })

    it('should call next with an error if user not found', async () => {
      const errorResult = null
      const error = ApiError.notFound('User not found')
      findOneUserMock.mockResolvedValue(errorResult)

      req.params = {
        userId,
      }

      await usersController.findOneUser(req, res, next)

      expect(findOneUserMock).toHaveBeenCalled()
      expect(findOneUserMock).toHaveBeenCalledWith(userId)
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('createNewUser', () => {
    const createNewUserMock = jest.spyOn(UsersService, 'createUser')
    const newUser = usersData[0]

    it('should NOT create new user with existing email', async () => {
      const errorResult = null
      const error = ApiError.badRequest(
        'Email is not available, please insert another one'
      )

      createNewUserMock.mockResolvedValue(errorResult)

      req.body = newUser

      await usersController.createNewUser(req, res, next)

      expect(createNewUserMock).toHaveBeenCalledWith(newUser)
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('deleteUser', () => {
    const deleteUserMock = jest.spyOn(UsersService, 'deleteUser')
    const user = usersData[0]
    const userId = String(user.id)

    it('should delete an user with correct ID', async () => {
      deleteUserMock.mockResolvedValue(user)

      req.params = {
        userId,
      }

      await usersController.deleteUser(req, res, next)

      expect(deleteUserMock).toHaveBeenCalledWith(String(user.id))
      expect(res.status).toHaveBeenCalledWith(204)
    })

    it('should NOT delete any user with incorrect ID', async () => {
      const errorResult = null
      const error = ApiError.notFound('User does not exist')
      deleteUserMock.mockResolvedValue(errorResult)

      req.params = {
        userId,
      }

      await usersController.deleteUser(req, res, next)

      expect(deleteUserMock).toHaveBeenCalledWith(userId)
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('updateUser', () => {
    const updateUserMock = jest.spyOn(UsersService, 'updateUser')
    const user = usersData[0]
    const userId = String(user.id)

    it('should update an user with correct ID', async () => {
      updateUserMock.mockResolvedValue(user)

      req.body = user

      await usersController.updateUser(req, res, next)

      expect(res.json).toHaveBeenCalledWith(user)
    })

    it('should NOT update any user with incorrect ID', async () => {
      const errorResult = null
      const error = ApiError.notFound('User not found')
      updateUserMock.mockResolvedValue(errorResult)

      req.params = {
        userId,
      }

      req.body = {
        user,
      }

      await usersController.updateUser(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })
})
