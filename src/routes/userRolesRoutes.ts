import express from 'express'

import UserRolesController from '../controllers/userRolesController.js'

const router = express.Router()

router.get('/', UserRolesController.findAllUserRole)
router.get('/:userId', UserRolesController.findByUserId)
// user_role is automatically created when user is created. Default role: "Borrower"
router.post('/:userId', UserRolesController.addRoleToUser)
router.delete('/:userId', UserRolesController.deleteUserRole)
router.put('/:userId', UserRolesController.updateUserRole)

export default router
