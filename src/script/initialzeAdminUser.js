import mongoose from 'mongoose'
import readline from 'readline'

import RoleRepo from '../../dist/src/models/rolesModel.js'
import UserRoleRepo from '../../dist/src/models/userRolesModel.js'
import connectToMongoDB from '../../dist/src/mongoose.js'
import UsersService from '../../dist/src/services/usersService.js'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const createAdmin = async (email, password) => {
  try {
    if (!isValidEmail(email)) {
      throw new Error('Invalid email address')
    }

    const adminRole = await RoleRepo.findOne({ title: 'Admin' })

    if (adminRole == null) {
      throw new Error('Admin role not found')
    }

    const newUser = { email, password }
    const newAdmin = await UsersService.createUser(newUser)

    const newAdminRole = {
      user_id: newAdmin._id,
      role_id: adminRole._id,
    }

    await UserRoleRepo.create(newAdminRole)
    console.log('Admin user created successfully.')
  } catch (err) {
    console.error('Error creating admin user:', err)
  } finally {
    void mongoose.disconnect()
    rl.close()
  }
}

const start = async () => {
  await connectToMongoDB()
  rl.question('Enter Admin Email: ', async (email) => {
    if (!isValidEmail(email)) {
      console.error('Invalid email address')
      void mongoose.disconnect()
      rl.close()
    } else {
      rl.question('Enter Admin Password: ', async (password) => {
        await createAdmin(email, password)
      })
    }
  })
}

void start()
