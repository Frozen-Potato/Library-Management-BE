import { type NextFunction, type Response } from 'express'
import mongoose from 'mongoose'

import { checkPermission } from '../../middlewares/checkPermission.js'
import rolesService from '../../services/rolesService.js'
import userRolesService from '../../services/userRolesService.js'
import { type WithAuthRequest } from '../../types/User.js'
import { ApiError } from '../../utils/ApiError.js'
import { type Permission } from '../../utils/auth.js'

const ObjectId = mongoose.Types.ObjectId
describe('checkPermission middleware', () => {
  let req: WithAuthRequest
  let res: Response
  let next: NextFunction

  beforeEach(() => {
    req = {
      decoded: {
        userId: 'user123',
      },
      params: {
        userId: 'user123',
      },
    } as unknown as WithAuthRequest

    res = {} as Response
    next = jest.fn() as NextFunction
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call next() if user has general permission', async () => {
    const permissions: Permission[] = ['USERS_READ']

    jest.spyOn(userRolesService, 'findByUserId').mockResolvedValueOnce([
      {
        user_id: new ObjectId('6555e4e7d7634b8aa1dfe0f1'),
        role_id: new ObjectId('655461b3e5407a09ec63d108'),
      },
    ])

    jest.spyOn(rolesService, 'findByIdWithPermissions').mockResolvedValueOnce({
      id: new ObjectId('655461b3e5407a09ec63d108'),
      title: 'Admin',
      permissions: [
        {
          id: new ObjectId('655a849986b806b0c12880ce'),
          action: 'USERS_READ',
        },
      ],
    })

    await checkPermission(...permissions)(req, res, next)

    expect(next).toHaveBeenCalledWith()
  })

  it('should call next() if user has self-only permission', async () => {
    const permissions: Permission[] = ['USERS_READ', 'USERS_READ_ONE']

    jest.spyOn(userRolesService, 'findByUserId').mockResolvedValueOnce([
      {
        user_id: new ObjectId('6555e4e7d7634b8aa1dfe0f1'),
        role_id: new ObjectId('655461b3e5407a09ec63d108'),
      },
    ])

    jest.spyOn(rolesService, 'findByIdWithPermissions').mockResolvedValueOnce({
      id: new ObjectId('655461b3e5407a09ec63d108'),
      title: 'Borrower',
      permissions: [
        {
          id: new ObjectId('655a849a86b806b0c12880e5'),
          action: 'USERS_READ_ONE',
        },
      ],
    })

    await checkPermission(...permissions)(req, res, next)

    expect(next).toHaveBeenCalledWith()
  })

  it('should call next() if user has both general and self-only permission', async () => {
    const permissions: Permission[] = ['USERS_READ']

    jest.spyOn(userRolesService, 'findByUserId').mockResolvedValueOnce([
      {
        user_id: new ObjectId('6555e4e7d7634b8aa1dfe0f1'),
        role_id: new ObjectId('655461b3e5407a09ec63d108'),
      },
    ])

    jest.spyOn(rolesService, 'findByIdWithPermissions').mockResolvedValueOnce({
      id: new ObjectId('655461b3e5407a09ec63d108'),
      title: 'Admin',
      permissions: [
        {
          id: new ObjectId('655a849a86b806b0c12880e5'),
          action: 'USERS_READ_ONE',
        },
        {
          id: new ObjectId('655a849986b806b0c12880ce'),
          action: 'USERS_READ',
        },
      ],
    })

    await checkPermission(...permissions)(req, res, next)

    expect(next).toHaveBeenCalledWith()
  })

  it('should call next() if user has no permission', async () => {
    const permissions: Permission[] = ['USERS_READ']

    jest.spyOn(userRolesService, 'findByUserId').mockResolvedValueOnce([
      {
        user_id: new ObjectId('6555e4e7d7634b8aa1dfe0f1'),
        role_id: new ObjectId('655461b3e5407a09ec63d108'),
      },
    ])

    jest.spyOn(rolesService, 'findByIdWithPermissions').mockResolvedValueOnce({
      id: new ObjectId('655461b3e5407a09ec63d108'),
      title: 'Borrower',
      permissions: [],
    })

    await checkPermission(...permissions)(req, res, next)

    expect(next).toHaveBeenCalledWith(
      ApiError.forbidden('Access Denied: Insufficient Permissions.')
    )
  })

  it('should call next() if user is undefined', async () => {
    const permissions: Permission[] = ['USERS_READ']

    req.decoded = undefined

    await checkPermission(...permissions)(req, res, next)

    expect(next).toHaveBeenCalledWith(ApiError.unauthorized('Unauthorized'))
  })
})
