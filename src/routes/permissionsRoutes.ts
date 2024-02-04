import express from 'express'

import PermissionsController from '../controllers/permissionsController.js'
import { checkAuth } from '../middlewares/checkAuth.js'
import { checkPermission } from '../middlewares/checkPermission.js'
import {
  validateCreatePermission,
  validateUpdatePermission,
} from '../middlewares/permissionValidate.js'

const router = express.Router()

router.get(
  '/',
  checkAuth,
  checkPermission('PERMISSIONS_READ'),
  PermissionsController.findAllPermissions
)
router.get(
  '/:permissionId',
  checkAuth,
  checkPermission('PERMISSIONS_READ'),
  PermissionsController.findOnePermission
)

router.post(
  '/',
  checkAuth,
  checkPermission('PERMISSIONS_CREATE'),
  validateCreatePermission,
  PermissionsController.createNewPermission
)
router.delete(
  '/:permissionId',
  checkAuth,
  checkPermission('PERMISSIONS_DELETE'),
  PermissionsController.deletePermission
)
router.put(
  '/:permissionId',
  checkAuth,
  checkPermission('PERMISSIONS_UPDATE'),
  validateUpdatePermission,
  PermissionsController.updatePermission
)

export default router
