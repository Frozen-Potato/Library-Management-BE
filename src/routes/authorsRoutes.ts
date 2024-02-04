import express from 'express'

import AuthorsController from '../controllers/authorsController.js'
import {
  validateCreateAuthor,
  validateUpdateAuthor,
} from '../middlewares/authorValidate.js'
import { checkAuth } from '../middlewares/checkAuth.js'
import { checkPermission } from '../middlewares/checkPermission.js'

const router = express.Router()

router.get('/', AuthorsController.getAllAuthors)
router.post(
  '/',
  checkAuth,
  checkPermission('AUTHORS_CREATE_ONE'),
  validateCreateAuthor,
  AuthorsController.createNewAuthor
)
router.get('/:authorId', AuthorsController.getAuthorById)
router.delete(
  '/:authorId',
  checkAuth,
  checkPermission('AUTHORS_DELETE_ONE'),
  AuthorsController.deleteAuthor
)
router.put(
  '/:authorId',
  checkAuth,
  checkPermission('AUTHORS_UPDATE_ONE'),
  validateUpdateAuthor,
  AuthorsController.updateAuthorInfo
)

export default router
