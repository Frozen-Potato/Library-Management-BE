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

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *    summary: Get a list of all users
 *    security:
 *     - bearerAuth: []
 *    responses:
 *      200:
 *        description: Successful response
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 */
router.get(
  '/',
  checkAuth,
  checkPermission('USERS_READ'),
  UsersController.findAllUsers
)

/**
 * @swagger
 * /api/v1/users/signup:
 *    post:
 *      summary: Sign up/create new account/user
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                firstName:
 *                  type: string
 *                lastName:
 *                   type: string
 *                email:
 *                   type: string
 *                address:
 *                   type: string
 *                avatar:
 *                   type: string
 *                phoneNumber:
 *                   type: string
 *                password:
 *                   type: string
 *      response:
 *        201:
 *           description: Successful response
 *        400:
 *           description: Bad request
 */
router.post('/signup', validateCreateUser, authController.signup)

/**
 * @swagger
 * /api/v1/users/signin:
 *    post:
 *      summary: Sign in
 *      requestBody:
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *            required:
 *                - email
 *                - password
 *      responses:
 *        200:
 *          description: Successful response
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  accessToken: string
 *        400:
 *          description: Bad request
 *        500:
 *          description: Internal server error
 *          content:
 *           application/json:
 *            schema:
 *               type: object
 *               properties:
 *                 message: string
 */
router.post('/signin', authController.signin)

router.post(
  '/login-google',
  passport.authenticate('google-id-token', { session: false }),
  authController.loginWithGoogle
)

/**
 * @swagger
 * /api/v1/users/profile:
 *    get:
 *      summary: Get user's profile
 *      requestBody:
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *               accessToken: string
 *      responses:
 *        200:
 *          description: Successful response
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                  title:
 *                    type: string
 *        400:
 *          description: Bad request
 *        500:
 *          description: Internal server error
 *          content:
 *           application/json:
 *            schema:
 *               type: object
 *               properties:
 *                 message: string
 */
router.get('/profile', checkAuth, UsersController.getUserProfile)

/**
 * @swagger
 * /api/v1/users/{userId}:
 *    get:
 *      summary: Get user by ID
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: userId
 *          required: true
 *          description: The user id
 *          example: 655461aee5407a09ec63d104
 *      requestBody:
 *       content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *               accessToken:
 *                  type: string
 *                  description: User ID
 *                  example: 65609a888593268849a68eb8
 *      responses:
 *        200:
 *          description: Successful response
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                  title:
 *                    type: string
 *        400:
 *          description: Bad request
 *        404:
 *          description: User not found
 *          content:
 *           application/json:
 *            schema:
 *               type: object
 *               properties:
 *                  message: string
 *
 */
router.get(
  '/:userId',
  checkAuth,
  checkPermission('USERS_READ', 'USERS_READ_ONE'),
  UsersController.findOneUser
)

router.post('/', validateCreateUser, UsersController.createNewUser)

/**
 * @swagger
 * /api/v1/users/{userId}:
 *    delete:
 *      summary: Delete user by ID
 *      parameters:
 *        - in: path
 *          name: userId
 *          required: true
 *          description: The user id
 *          example: 655461aee5407a09ec63d104
 *      responses:
 *        204:
 *          description: Successful response
 *        400:
 *          description: Bad request
 *        404:
 *          description: User not found
 *          content:
 *           application/json:
 *            schema:
 *               type: object
 *               properties:
 *                  message: string
 */
router.delete('/:userId', UsersController.deleteUser)

/**
 * @swagger
 * /api/v1/users/update:
 *    get:
 *      summary: Get user by ID
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: roleId
 *          required: true
 *          description: The role id
 *          example: 655461aee5407a09ec63d104
 *      requestBody:
 *       content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *               accessToken:
 *                  type: string
 *                  description: User ID
 *                  example: 65609a888593268849a68eb8
 *      responses:
 *        200:
 *          description: Successful response
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                  title:
 *                    type: string
 *        400:
 *          description: Bad request
 *        404:
 *          description: User not found
 *          content:
 *           application/json:
 *            schema:
 *               type: object
 *               properties:
 *                  message: string
 */
router.put('/update', checkAuth, validateUpdateUser, UsersController.updateUser)

router.put(
  '/:userId',
  checkAuth,
  checkPermission('USERS_UPDATE'),
  validateUpdateUser,
  UsersController.updateUser
)

export default router
