import dotenv from 'dotenv'
import mongoose from 'mongoose'

import PermissionRepo from '../../dist/src/models/permissionsModel.js'
import RoleRepo from '../../dist/src/models/rolesModel.js'
import connectToMongoDB from '../../dist/src/mongoose.js'
import { ACTIONS, RESOURCES } from '../../dist/src/utils/auth.js'

dotenv.config()

connectToMongoDB()

async function createPermissionsAndRoles() {
  const uniquePermissions = RESOURCES.flatMap((resource) =>
    ACTIONS.map((action) => ({ action: `${resource}_${action}` }))
  )

  const insertedPermissions = await PermissionRepo.insertMany(uniquePermissions)
  const permissionMap = new Map(
    insertedPermissions.map((permission) => [permission.action, permission._id])
  )

  const roles = [
    {
      title: 'Admin',
      permissions: insertedPermissions.map((p) => p._id),
    },
    {
      title: 'Borrower',
      permissions: [
        'USERS_READ_ONE',
        'USERS_UPDATE_ONE',
        'BORROW_CREATE',
        'CART_READ_ONE',
        'CART_DELETE_ONE',
        'CART_UPDATE_ONE',
        'CART_CREATE_ONE',
      ].map((action) => permissionMap.get(action)),
    },
  ]

  for (const role of roles) {
    await RoleRepo.create(role)
  }
}

createPermissionsAndRoles()
  .then(() => {
    console.log('Initial permissions and roles created successfully.')
    void mongoose.connection.close()
  })
  .catch((error) => {
    console.error('Error creating initial permissions and roles:', error)
    void mongoose.connection.close()
  })
