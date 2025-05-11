import express from 'express'

import BookController from '../controllers/bookController.js'
import {
  validateCreateBook,
  validateDuplication,
  validateFilteringQuery,
  validateUpdateBook,
} from '../middlewares/bookValidate.js'
import { checkAuth } from '../middlewares/checkAuth.js'
import { checkPermission } from '../middlewares/checkPermission.js'
const router = express.Router()

/**
 * @swagger
 * /api/v1/books:
 *  get:
 *    summery: Return all books or books with filtering and pagination
 *    parameters:
 *      - in: query
 *        name: filter
 *        schema:
 *          type: interger
 *        description: Choose between 1 and 0 to indicate wherether the data is filtered or not (default is 0)
 *      - in: query
 *        name: page
 *        schema:
 *          type: interger
 *        description: Choose page number
 *      - in: query
 *        name: perPage
 *        schema:
 *          type: interger
 *        description: Number of data entries per page
 *      - in: query
 *        name: search
 *        schema:
 *          type: string
 *        description: Search string
 *      - in: query
 *        name: sortBy
 *        schema:
 *          type: string
 *        description: Choose which field the data is sorted by allows id, title, edition, category, publisher
 *      - in: query
 *        name: sortOrder
 *        schema:
 *          type: string
 *        description: Choose sort order ('asc' or 'desc')
 *      - in: query
 *        name: authorName
 *        schema:
 *          type: string
 *        description: Filter result by author fullname
 *      - in: query
 *        name: categoryName
 *        schema:
 *          type: string
 *        description: Filter result by category name
 *      - in: query
 *        name: edition
 *        schema:
 *          type: string
 *        description: Filter result by edition
 *      - in: query
 *        name: publisher
 *        schema:
 *          type: string
 *        description: Filter result by publisher
 */
router.get('/', validateFilteringQuery, BookController.getBooks)

// Get all book copies
router.get('/copy', BookController.getAllBookCopies)

// Get user borrow history
/**
 * @swagger
 * /api/v1/books/history:
 *   get:
 *     summary: Get borrow history for the logged-in user
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Borrow history list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BookBorrowHistory'
 *       401:
 *         description: Unauthorized
 */
router.get('/history', checkAuth, BookController.getUserBorrowHistory)

// Get Book with given id
/**
 * @swagger
 * /api/v1/books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     tags: [Books]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Book ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 */
router.get('/:id', BookController.getBookById)

// Get Book with given ISBN
/**
 * @swagger
 * /api/v1/books/{isbn}:
 *   get:
 *     summary: Get a book by ISBN
 *     tags: [Books]
 *     parameters:
 *       - name: ISBN
 *         in: path
 *         required: true
 *         description: Book ISBN
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 */
router.get('/ISBN/:ISBN', BookController.getBookByISBN)

// Get Book copy with given book id
router.get('/copy/:id', BookController.getBookCopiesWithBookId)

// Create new Book (require admin auth)
/**
 * @swagger
 * /api/v1/books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       201:
 *         description: Book created
 *       400:
 *         description: Invalid input
 */
router.post(
  '/',
  checkAuth,
  checkPermission('BOOKS_CREATE'),
  validateCreateBook,
  validateDuplication,
  BookController.createNewBook
)

//
// router.post('/all', BookController.createCopies)

// Create new Book copy with given id
router.post(
  '/copy/:id',
  checkAuth,
  checkPermission('BOOKS_CREATE'),
  BookController.createNewCopy
)

// Delete Book with given id (require admin auth)
router.delete(
  '/:id',
  checkAuth,
  checkPermission('BOOKS_DELETE'),
  BookController.deleteBookById
)

// Update Book with given id (require admin auth)
router.put('/:id', validateUpdateBook, BookController.updateBookInfo)

// borrow Book with given array of book_id (require user/admin auth)
/**
 * @swagger
 * /api/v1/books/borrow:
 *   post:
 *     summary: Borrow multiple books by their IDs
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of book IDs to borrow
 *     responses:
 *       200:
 *         description: Books successfully borrowed
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       400:
 *         description: Some books are not available or borrow limit reached
 *       404:
 *         description: Some books not found
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/borrow',
  checkAuth,
  checkPermission('BORROW_UPDATE'),
  BookController.borrowBookById
)

// return Book with given array of book_id(require user/admin auth)
/**
 * @swagger
 * /api/v1/books/return:
 *   post:
 *     summary: Return multiple borrowed books by their IDs
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of book IDs to return
 *     responses:
 *       200:
 *         description: Books successfully returned
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       400:
 *         description: Some books are not borrowed or already returned
 *       404:
 *         description: Some books not found
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/return',
  checkAuth,
  checkPermission('BORROW_UPDATE'),
  BookController.returnBookById
)

export default router

