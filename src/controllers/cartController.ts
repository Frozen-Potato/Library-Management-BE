import { type NextFunction, type Response } from 'express'

import { ApiError } from '../utils/ApiError.js'
import CartsService from '../services/cartsService.js'
import { type WithAuthRequest } from '../types/User.js'

async function getUserCart(
  req: WithAuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const decoded = req.decoded
  const userId = decoded?.userId as string
  const cartItems = await CartsService.getCartByUserId(userId)

  if (cartItems === null) {
    next(ApiError.notFound('Cart not found.'))
    return
  } else if (cartItems instanceof Error) {
    next(ApiError.badRequest('Bad request.', cartItems.message))
    return
  }

  res.json(cartItems)
}

async function addToCart(
  req: WithAuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const decoded = req.decoded
  const userId = decoded?.userId as string
  const bookId = req.body.book_id

  const result = await CartsService.addToCart({ userId, bookId })

  if (result instanceof Error) {
    next(ApiError.badRequest('Bad request.', result.message))
    return
  } else if (result === undefined) {
    next(ApiError.internal('Something went wrong.'))
    return
  }

  res.status(201).json(result)
}

async function removeFromCart(
  req: WithAuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const decoded = req.decoded
  const userId = decoded?.userId as string
  const bookId = req.params.bookId

  const result = await CartsService.removeFromCart({ userId, bookId })

  if (result instanceof Error) {
    next(ApiError.badRequest('Bad request.', result.message))
    return
  } else if (result === null) {
    next(ApiError.notFound('Cart not found.'))
    return
  }

  res.sendStatus(204)
}

async function checkout(
  req: WithAuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const decoded = req.decoded
  const userId = decoded?.userId as string

  const result = await CartsService.checkout(userId)

  if (result instanceof Error) {
    next(ApiError.badRequest('Bad request.', result.message))
    return
  } else if (!result) {
    next(ApiError.internal('Something went wrong.'))
    return
  }

  res.status(200).json({ acknowledged: true })
}

export default {
  getUserCart,
  addToCart,
  removeFromCart,
  checkout,
}
