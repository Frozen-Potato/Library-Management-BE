import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

import { type UserCreate } from '../types/User.js'
import { ApiError } from '../utils/ApiError.js'
import rolesService from './rolesService.js'
import userRolesService from './userRolesService.js'
import usersService from './usersService.js'

async function signin(credential: {
  email: string
  password: string
}): Promise<string | ApiError> {
  const user = await usersService.findByEmail(credential.email)

  if (user === null) {
    return ApiError.notFound('User not found')
  } else if (user instanceof Error) {
    return ApiError.badRequest('Bad request.', user.message)
  }

  const isValid = bcrypt.compareSync(credential.password, user.password)
  console.log('🚀 ~ file: authsService.ts:21 ~ signin ~ isValid:', isValid)

  if (!isValid) {
    return ApiError.unauthorized('Invalid password')
  }

  const payload = {
    userId: user.id,
    email: user.email,
  }

  const accessToken = jwt.sign(payload, process.env.TOKEN_SECRET as string, {
    expiresIn: '1h',
  })

  return accessToken
}

async function signup(user: UserCreate): Promise<string | ApiError> {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const defaultRole = await rolesService.findByTitle('Borrower')
    if (defaultRole == null)
      return ApiError.unprocessableEntity('Invalid default role')

    const newUser = await usersService.createUser(user, session)

    if (newUser == null) {
      return ApiError.conflict('User already exists')
    }
    if (newUser instanceof Error) {
      return ApiError.internal('Something wrong happened')
    }

    const newRole = { user_id: newUser.id, role_id: defaultRole.id }

    await userRolesService.addRoleToUser(newRole, { session })

    const payload = {
      userId: newUser.id,
      email: newUser.email,
    }

    const accessToken = jwt.sign(payload, process.env.TOKEN_SECRET as string, {
      expiresIn: '1h',
    })

    await session.commitTransaction()

    return accessToken
  } catch (error) {
    await session.abortTransaction()
    throw error
  }
}

export default {
  signin,
  signup,
}
