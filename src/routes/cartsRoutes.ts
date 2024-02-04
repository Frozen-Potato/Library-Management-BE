import express from 'express'

import CartsController from '../controllers/cartsController.js'
import { checkAuth } from '../middlewares/checkAuth.js'
import { checkPermission } from '../middlewares/checkPermission.js'

const router = express.Router()

router.get(
  '/',
  checkAuth,
  checkPermission('CART_READ'),
  CartsController.getAllCarts
)
router.get(
  '/items',
  checkAuth,
  checkPermission('CART_READ'),
  CartsController.getAllCartItems
)
router.get(
  '/:userId',
  checkAuth,
  checkPermission('CART_READ_ONE'),
  CartsController.getCartByUserId
)

router.put(
  '/:userId',
  checkAuth,
  // checkPermission('CART_UPDATE_ONE'),
  checkPermission('CART_READ_ONE'),
  CartsController.addToCart
)
router.post(
  '/:userId/checkout',
  checkAuth,
  checkPermission('CART_UPDATE_ONE'),
  CartsController.checkout
)
router.delete(
  '/:userId/:bookId',
  checkAuth,
  checkPermission('CART_DELETE_ONE'),
  CartsController.removeFromCart
)
router.delete(
  '/:userId',
  checkAuth,
  checkPermission('CART_DELETE'),
  CartsController.deleteCart
)

export default router
