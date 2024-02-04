import express from 'express'

import BookAuthorController from '../controllers/bookAuthorController.js'

const router = express.Router()

router.get('/', BookAuthorController.getPairs)
router.post('/', BookAuthorController.createNewPair)
router.delete('/', BookAuthorController.deletePairs)
router.put('/', BookAuthorController.updatePair)

export default router
