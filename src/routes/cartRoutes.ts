import express from 'express'

import CartController from '../controllers/cartController.js'
import { checkAuth } from '../middlewares/checkAuth.js'

const router = express.Router()

router.get('/', checkAuth, CartController.getUserCart)

router.put('/', checkAuth, CartController.addToCart)
router.post('/checkout', checkAuth, CartController.checkout)
router.delete('/book/:bookId', checkAuth, CartController.removeFromCart)

export default router
