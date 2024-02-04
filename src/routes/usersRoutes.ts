import express from 'express'
import passport from 'passport'

import authController from '../controllers/authsController.js'
import UsersController from '../controllers/usersController.js'
import { checkAuth } from '../middlewares/checkAuth.js'
import { checkPermission } from '../middlewares/checkPermission.js'
import {
  validateCreateUser,
  validateUpdateUser,
} from '../middlewares/userValidate.js'

const router = express.Router()

router.get(
  '/',
  checkAuth,
  checkPermission('USERS_READ'),
  UsersController.findAllUsers
)
router.post('/signup', validateCreateUser, authController.signup)
router.post('/signin', authController.signin)

router.post(
  '/login-google',
  passport.authenticate('google-id-token', { session: false }),
  authController.loginWithGoogle
)

router.get('/profile', checkAuth, UsersController.getUserProfile)

router.get(
  '/:userId',
  checkAuth,
  checkPermission('USERS_READ', 'USERS_READ_ONE'),
  UsersController.findOneUser
)

router.post('/', validateCreateUser, UsersController.createNewUser)

router.delete('/:userId', UsersController.deleteUser)

router.put('/update', checkAuth, validateUpdateUser, UsersController.updateUser)

router.put(
  '/:userId',
  checkAuth,
  checkPermission('USERS_UPDATE'),
  validateUpdateUser,
  UsersController.updateUser
)

export default router
