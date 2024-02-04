import express from 'express'

import crudStatsController from '../controllers/crudStatsController.js'

const router = express.Router()

router.get('/', crudStatsController.getAllCrudStats)
router.get('/:crudType', crudStatsController.getOneCrudStats)

export default router
