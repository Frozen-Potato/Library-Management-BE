import mongoose, { type ObjectId, type Types } from 'mongoose'

import UserRoleRepo from '../models/userRolesModel.js'
import type { UserRole, UserWithRole } from '../types/User.js'

async function addRoleToUser(
  newUserRole: UserRole,
  options = {}
): Promise<UserRole | Error | null> {
  try {
    const userRole = new UserRoleRepo(newUserRole)
    await userRole.save(options)
    return userRole as UserRole | null
  } catch (e) {
    const error = e as Error
    return error
  }
}

async function findAllUserRole(): Promise<UserWithRole[]> {
  const users = await UserRoleRepo.find()
    .populate('user')
    .populate('role')
    .exec()
  return users as unknown as UserWithRole[]
}

async function findByUserId(
  userId: string | Types.ObjectId
): Promise<UserRole[] | Error | null> {
  try {
    const id =
      typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId

    const userRole = await UserRoleRepo.find({ user_id: id }).exec()

    return userRole as unknown as UserRole[] | null
  } catch (e) {
    const error = e as Error
    return error
  }
}

async function deleteUserRole(
  userId: string
): Promise<UserRole | Error | null> {
  try {
    const id = new mongoose.Types.ObjectId(userId)
    const userRoleUpdate = await UserRoleRepo.findOneAndDelete({
      user: id,
    }).exec()
    return userRoleUpdate as unknown as UserRole | null
  } catch (e) {
    const error = e as Error
    return error
  }
}

async function updateUserRole(
  userId: string,
  payload: { role: ObjectId }
): Promise<UserRole | Error | null> {
  try {
    const id = new mongoose.Types.ObjectId(userId)
    const userRoleUpdate = await UserRoleRepo.findOneAndUpdate(
      { user: id },
      payload,
      {
        new: true,
      }
    )
      .populate('user')
      .populate('role')
      .exec()
    return userRoleUpdate as UserRole | null
  } catch (e) {
    const error = e as Error
    return error
  }
}

export default {
  addRoleToUser,
  findAllUserRole,
  findByUserId,
  updateUserRole,
  deleteUserRole,
}
