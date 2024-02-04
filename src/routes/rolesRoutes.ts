import express from 'express'

import RolesController from '../controllers/rolesController.js'
import { checkAuth } from '../middlewares/checkAuth.js'
import { checkPermission } from '../middlewares/checkPermission.js'
import { validateCreateRole } from '../middlewares/roleValidate.js'

const router = express.Router()

/**
 * @swagger
 * /api/v1/roles:
 *   get:
 *     summary: Get all roles
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get(
  '/',
  checkAuth,
  checkPermission('ROLES_READ'),
  RolesController.findAllRoles
)

/**
 * @swagger
 * /api/v1/roles:
 *   post:
 *     summary: Create a new role
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The role title
 *                 example: ADMIN
 *     responses:
 *       201:
 *         description: Successful response
 */
router.post(
  '/',
  checkAuth,
  checkPermission('ROLES_CREATE'),
  validateCreateRole,
  RolesController.createNewRole
)

/**
 * @swagger
 * /api/v1/roles/{roleId}/addPermission:
 *   post:
 *     summary: add a permission to a role
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         description: The role id
 *         example: 655461aee5407a09ec63d104
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               permissionId:
 *                 type: string
 *                 description: The permission id
 *                 example: 65609a888593268849a68eb8
 *     responses:
 *       201:
 *         description: Successful response
 */
router.post(
  '/:roleId/addPermission',
  checkAuth,
  checkPermission('ROLES_UPDATE'),
  RolesController.addPermission
)

export default router
