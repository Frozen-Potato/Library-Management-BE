import mongoose from 'mongoose'

import { type CartItem } from '../types/CartItem.js'
import CartsRepo from '../models/cartsModel.js'
import CartItemRepo from '../models/cartItemModel.js'
import { type Cart } from '../types/Cart.js'
import BooksService from './booksService.js'

async function getAllCarts(): Promise<Cart[]> {
  const cartItems = await CartsRepo.find().exec()
  return cartItems as Cart[]
}

async function getAllCartItems(): Promise<CartItem[]> {
  const cartItems = await CartItemRepo.find().exec()
  return cartItems as CartItem[]
}

async function getCartByUserId(
  userId: string
): Promise<CartItem | null | Error> {
  try {
    const id = new mongoose.Types.ObjectId(userId)
    const cart = await CartsRepo.findOne({ user_id: id })

    if (cart === null) {
      return cart
    }

    const cartId = cart._id

    const cartItems = await CartItemRepo.aggregate([
      {
        $match: {
          cart_id: cartId,
        },
      },
      {
        $lookup: {
          from: 'books',
          localField: 'books',
          foreignField: '_id',
          pipeline: [
            {
              $project: {
                title: 1,
                description: 1,
                author: 1,
                img: 1,
              },
            },
            {
              $lookup: {
                from: 'authors',
                localField: 'author',
                foreignField: '_id',
                pipeline: [
                  {
                    $addFields: {
                      fullName: {
                        $concat: ['$firstName', ' ', '$lastName'],
                      },
                    },
                  },
                  { $project: { fullName: 1 } },
                ],
                as: 'author',
              },
            },
          ],
          as: 'books',
        },
      },
    ])

    return cartItems[0] as CartItem
  } catch (e) {
    const err = e as Error
    return err
  }
}

async function addToCart({
  userId,
  bookId,
}: {
  userId: string
  bookId: string
}): Promise<CartItem | undefined | Error> {
  try {
    const id = new mongoose.Types.ObjectId(userId)
    let cart = await CartsRepo.findOne({ user_id: id })

    if (cart === null) {
      const newCart = new CartsRepo({
        user_id: id,
      })
      await newCart.save()
      cart = newCart

      const cartId = cart._id
      const newCartItem = new CartItemRepo({
        cart_id: cartId,
        books: [new mongoose.Types.ObjectId(bookId)],
      })
      const res = await newCartItem.save()
      return res as CartItem | undefined
    } else {
      const cartId = cart._id
      const res = await CartItemRepo.findOneAndUpdate(
        { cart_id: cartId },
        { $addToSet: { books: bookId } },
        { new: true, upsert: true }
      )

      return res as CartItem | undefined
    }
  } catch (e) {
    const err = e as Error
    return err
  }
}

async function removeFromCart({
  userId,
  bookId,
}: {
  userId: string
  bookId: string
}): Promise<CartItem | null | Error> {
  try {
    const id = new mongoose.Types.ObjectId(userId)
    const cart = await CartsRepo.findOne({ user_id: id })

    if (cart !== null) {
      const cartId = cart._id

      const res = await CartItemRepo.findOneAndUpdate(
        { cart_id: cartId },
        {
          $pull: {
            books: new mongoose.Types.ObjectId(bookId),
          },
        },
        {
          new: true,
        }
      )

      return res as CartItem | null
    }

    return cart
  } catch (e) {
    const err = e as Error
    return err
  }
}

async function deleteCart(userId: string): Promise<boolean | Error> {
  try {
    const id = new mongoose.Types.ObjectId(userId)
    const cart = await CartsRepo.findOne({ user_id: id })

    if (cart !== null) {
      const cartId = cart._id
      await CartItemRepo.deleteMany({ cart_id: cartId })
      await cart.deleteOne()
      return true
    }

    return false
  } catch (e) {
    const err = e as Error
    return err
  }
}

async function checkout(userId: string): Promise<boolean | Error> {
  try {
    const id = new mongoose.Types.ObjectId(userId)
    const cart = await CartsRepo.findOne({ user_id: id })

    if (cart !== null) {
      const cartId = cart._id

      // find list of books in the cart
      const cartItem = await CartItemRepo.find({ cart_id: cartId }).exec()

      // get all book_id of books
      const bookIds: string[] = cartItem[0].books.map((book) =>
        String(book._id)
      )

      // update the availability status for the books
      const res = await BooksService.updateMultiAvailableStatus(
        userId,
        bookIds,
        false
      )

      if (res === false) {
        return false
      }

      // delete all the books in cart
      await CartItemRepo.deleteOne({ cart_id: cartId })

      // delete cart of user
      await cart.deleteOne()

      return true
    }

    return false
  } catch (e) {
    const err = e as Error
    return err
  }
}

export default {
  getAllCarts,
  getAllCartItems,
  getCartByUserId,
  addToCart,
  removeFromCart,
  deleteCart,
  checkout,
}
