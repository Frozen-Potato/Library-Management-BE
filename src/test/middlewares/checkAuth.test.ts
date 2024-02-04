import { type NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { checkAuth } from '../../middlewares/checkAuth.js'
import { ApiError } from '../../utils/ApiError.js'

jest.mock('jsonwebtoken')

describe('checkAuth', () => {
  let req: any
  let res: any
  let next: NextFunction

  beforeEach(() => {
    req = {
      headers: {
        authorization: 'Bearer valid_token',
      },
    }
    res = {}

    next = jest.fn()

    jwt.verify = jest.fn().mockReturnValue({
      userId: '123',
      email: 'email@gmai.com',
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call next() if token is valid', async () => {
    console.log('🚀 ~ file: checkAuth.test.ts:37 ~ test ~ req:', req)
    await checkAuth(req, res, next)

    expect(req.decoded).toEqual({ userId: '123', email: 'email@gmai.com' })
    expect(next).toHaveBeenCalled()
  })

  test('should call next() if token is missing', async () => {
    req.headers.authorization = undefined

    await checkAuth(req, res, next)

    expect(next).toHaveBeenCalledWith(
      ApiError.forbidden(
        'TOKEN is missing (Unauthorized to proceed action) ❌🔙❌'
      )
    )
  })

  test('should call next() if token is invalid', async () => {
    jwt.verify = jest.fn().mockImplementation(() => {
      throw new Error('Invalid token')
    })

    await checkAuth(req, res, next)

    expect(next).toHaveBeenCalledWith(ApiError.forbidden('Invalid token'))
  })
})
