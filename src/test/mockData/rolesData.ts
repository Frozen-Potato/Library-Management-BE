import mongoose from 'mongoose'

import { type RoleWithPermissionIds } from '../../types/Role.js'

const ObjectId = mongoose.Types.ObjectId

export const rolesData: Array<
  Partial<RoleWithPermissionIds & { _id: mongoose.Types.ObjectId }>
> = [
  {
    _id: new ObjectId('6546a7febac08f6bd30c0505'),
    title: 'Borrower',
    permissions: [
      new ObjectId('6546a7febac08f6bd30c0506'),
      new ObjectId('6546a7febac08f6bd30c0507'),
    ],
  },
]
