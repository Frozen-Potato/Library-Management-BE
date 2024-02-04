import mongoose, { Types } from 'mongoose'

import {
  BookModel as BooksRepo,
  CopiesBookModel as CopiesBookRepo,
  BorrowedBookModel as BorrowedBookRepo,
} from '../models/bookModel.js'
import {
  type BookCopy,
  type Book,
  type BookFilterSchema,
  type PopulatedBook,
  type bookBorrowHistory,
} from '../types/Book.js'
import { type PaginatedData, type AtleastOne } from '../types/AdditionalType.js'
import UserRepo from '../models/usersModel.js'

const populatingAuthor = {
  $lookup: {
    from: 'authors',
    localField: 'author',
    foreignField: '_id',
    pipeline: [
      {
        $addFields: {
          fullName: { $concat: ['$firstName', ' ', '$lastName'] },
        },
      },
      { $project: { fullName: 1 } },
    ],
    as: 'author',
  },
}

const populatingCategory: {
  $lookup: {
    from: string
    localField: string
    foreignField: string
    pipeline: Array<{ $project: { name: number } }>
    as: string
  }
} = {
  $lookup: {
    from: 'categories',
    localField: 'category',
    foreignField: '_id',
    pipeline: [{ $project: { name: 1 } }],
    as: 'category',
  },
}

const AddAvailCopies = {
  $lookup: {
    from: 'copiesbooks',
    localField: '_id',
    foreignField: 'book_id',
    pipeline: [
      { $match: { is_Available: true } },
      { $count: 'total' },
      { $project: { total: { $ifNull: ['$total', 0] } } },
    ],
    as: 'availableCopies',
  },
}

const getAll = async (): Promise<PopulatedBook[]> => {
  const books = await BooksRepo.aggregate([
    populatingAuthor,
    populatingCategory,
    AddAvailCopies,
  ])

  books.forEach((data: any) => {
    if (data.availableCopies.length === 0) {
      data.availableCopies.push({ total: 0 })
    }
  })

  return books as PopulatedBook[]
}

const getFilteredBook = async (
  filter: BookFilterSchema
): Promise<PaginatedData<PopulatedBook> | Error> => {
  const searchQuery = filter.search ?? ''

  const sortBy =
    filter.sortBy !== undefined
      ? filter.sortBy === 'id'
        ? '_id'
        : filter.sortBy
      : '_id'

  const sortOrder =
    filter.sortOrder === 'asc' ? 1 : filter.sortOrder === 'desc' ? -1 : 1

  const page =
    filter.page !== undefined
      ? !Number.isNaN(+filter.page)
        ? +filter.page !== 0
          ? +filter.page
          : 1
        : 1
      : 1

  const perPage =
    filter.perPage !== undefined
      ? !Number.isNaN(+filter.perPage)
        ? +filter.perPage !== 0
          ? +filter.perPage
          : 10
        : 10
      : 10

  const limit = perPage
  const skip = perPage * (page - 1)

  const authorFilter = filter.authorName
  const categoryFilter = filter.categoryName

  delete filter.perPage
  delete filter.page
  delete filter.search
  delete filter.sortBy
  delete filter.sortOrder
  delete filter.filter
  delete filter.authorName
  delete filter.categoryName

  const modifiedFilter = {
    ...filter,
    'author.fullName': authorFilter,
    'category.name': categoryFilter,
  }

  const cleanedFilter = Object.entries(modifiedFilter).reduce(
    (acc, [k, v]) =>
      v != null && v !== '' && v !== undefined ? { ...acc, [k]: v } : acc,
    {}
  )

  try {
    const result = await BooksRepo.aggregate([
      populatingAuthor,
      populatingCategory,
      {
        $match: {
          ...cleanedFilter,
          $and: [
            {
              $or: [
                {
                  title: { $regex: `${searchQuery}`, $options: 'i' },
                },
                {
                  'author.fullName': {
                    $regex: `${searchQuery}`,
                    $options: 'i',
                  },
                },
              ],
            },
          ],
        },
      },
      AddAvailCopies,
      {
        $sort: {
          [sortBy]: sortOrder,
        },
      },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          pagination: [{ $count: 'total' }],
        },
      },
    ])

    result[0].data.forEach((data: any) => {
      if (data.availableCopies.length === 0) {
        data.availableCopies.push({ total: 0 })
      }
    })

    return {
      data: result[0].data,
      page,
      perPage,
      totalCount:
        result[0].pagination.length > 0 ? result[0].pagination[0].total : 0,
    }
  } catch (e) {
    const err = e as Error
    return err
  }
}

const getOneById = async (
  bookId: string
): Promise<PopulatedBook | null | Error> => {
  try {
    const id = new Types.ObjectId(bookId)
    const book = await BooksRepo.aggregate([
      {
        $match: {
          _id: id,
        },
      },
      populatingAuthor,
      populatingCategory,
    ])
    return book.length > 0 ? (book[0] as PopulatedBook) : null
  } catch (e) {
    const err = e as Error
    return err
  }
}

const getOneByISBN = async (
  ISBN: string
): Promise<PopulatedBook | null | Error> => {
  try {
    const book = await BooksRepo.aggregate([
      {
        $match: {
          ISBN,
        },
      },
      populatingAuthor,
      populatingCategory,
    ])
    return book.length > 0 ? (book[0] as PopulatedBook) : null
  } catch (e) {
    const err = e as Error
    return err
  }
}

const getAllCopies = async (): Promise<BookCopy[]> => {
  const books = await CopiesBookRepo.find().exec()
  return books as BookCopy[]
}

const getCopiesByBookId = async (bookId: string): Promise<BookCopy[]> => {
  const id = new Types.ObjectId(bookId)
  const books = await CopiesBookRepo.find({ book_id: id }).exec()
  return books as BookCopy[]
}

const createOne = async (
  payload: AtleastOne<Book, 'ISBN'>
): Promise<Book | undefined> => {
  const newBook = new BooksRepo(payload)
  const result = await newBook.save()

  if (result !== undefined) {
    await createOneCopy(result.id)
  }

  return result as Book | undefined
}

const createOneCopy = async (bookId: string): Promise<BookCopy | undefined> => {
  const id = new Types.ObjectId(bookId)
  const newCopy = new CopiesBookRepo({ book_id: id, is_Available: true })
  const result = await newCopy.save()
  return result as BookCopy | undefined
}

const updateOne = async (
  bookId: string,
  payload: Partial<Book>
): Promise<Book | null | Error> => {
  try {
    const id = new Types.ObjectId(bookId)
    const filter = { _id: id }
    const updatedBook = await BooksRepo.findByIdAndUpdate(filter, payload, {
      new: true,
    })
    return updatedBook as Book | null
  } catch (e) {
    const err = e as Error
    return err
  }
}

const updateAvailableStatus = async (
  bookId: string,
  newStatus: boolean
): Promise<boolean | BookCopy | Error> => {
  try {
    const copiesBook = await CopiesBookRepo.find({ book_id: bookId })

    if (copiesBook.length === 0) {
      return false
    }

    const availbleCopy = copiesBook.find(
      (book) => book.is_Available === !newStatus
    )

    if (availbleCopy === undefined) {
      return false
    }

    const newCopyStatus = {
      is_Available: newStatus,
    }

    const filter = { _id: availbleCopy._id }

    const updatedStatus = await CopiesBookRepo.findByIdAndUpdate(
      filter,
      newCopyStatus,
      { new: true }
    )

    return updatedStatus !== null ? (updatedStatus as BookCopy) : false
  } catch (e) {
    const err = e as Error
    return err
  }
}

const updateMultiAvailableStatus = async (
  userId: string,
  bookIds: string[],
  newStatus: boolean
): Promise<boolean | Error | PopulatedBook[]> => {
  const count: Record<string, any> = {}

  for (const bookId of bookIds) {
    count[bookId] = count[bookId] === undefined ? 1 : count[bookId] + 1
  }

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    let availableCheck = true
    const availableBooks = []
    const unavailableBooks: PopulatedBook[] = []
    const checkedId: Record<string, any> = {}

    for (const bookId of bookIds) {
      const copiesBook = await CopiesBookRepo.find({
        book_id: bookId,
        is_Available: !newStatus,
      })

      if (copiesBook.length < count[bookId]) {
        const unavailableBook = await getOneById(bookId)
        if (
          unavailableBooks.find(
            (e) =>
              JSON.stringify(e) ===
              JSON.stringify(unavailableBook as PopulatedBook)
          ) === undefined
        ) {
          unavailableBooks.push(unavailableBook as PopulatedBook)
        }

        availableCheck = false
      } else {
        checkedId[bookId] =
          checkedId[bookId] === undefined ? 0 : checkedId[bookId] + 1
        availableBooks.push(copiesBook[checkedId[bookId]])
      }
    }

    console.log(unavailableBooks)

    if (!availableCheck) {
      return unavailableBooks
    }

    for (const book of availableBooks) {
      let selectedCopyId: mongoose.Types.ObjectId

      if (!newStatus) {
        selectedCopyId = book._id

        const newBorrowBook = new BorrowedBookRepo({
          user_id: userId,
          copy_id: selectedCopyId,
          borrowed_Date: new Date(),
        })

        await newBorrowBook.save()
      } else {
        const availableBooks = await CopiesBookRepo.aggregate([
          {
            $match: {
              book_id: book.book_id,
              is_Available: false,
            },
          },
          {
            $lookup: {
              from: 'borrowedbooks',
              localField: '_id',
              foreignField: 'copy_id',
              as: 'data',
            },
          },
          {
            $unwind: {
              path: '$data',
              preserveNullAndEmptyArrays: false,
            },
          },
          {
            $match: {
              'data.returned_Date': { $exists: false },
              'data.user_id': new mongoose.Types.ObjectId(userId),
            },
          },
        ]).exec()

        if (availableBooks.length === 0) {
          return false
        }

        await BorrowedBookRepo.findByIdAndUpdate(
          {
            _id: availableBooks[0].data._id,
          },
          {
            returned_Date: new Date(),
          }
        )

        selectedCopyId = availableBooks[0]._id
      }

      await CopiesBookRepo.findByIdAndUpdate(
        { _id: selectedCopyId },
        { is_Available: newStatus }
      ).exec()
    }

    await session.commitTransaction()
    return true
  } catch (e) {
    await session.abortTransaction()
    const err = e as Error
    return err
  }
}

const deleteOne = async (bookId: string): Promise<boolean | Error> => {
  try {
    const id = new Types.ObjectId(bookId)
    const book = await BooksRepo.findById(id)
    const bookCopies = await CopiesBookRepo.find({ book_id: id })

    if (!(bookCopies instanceof Error || bookCopies === null)) {
      bookCopies.forEach(async (book) => {
        await book.deleteOne()
      })
    }

    if (!(book instanceof Error || book === null)) {
      await book.deleteOne()
      return true
    }
    return false
  } catch (e) {
    const err = e as Error
    return err
  }
}

const getHistory = async (
  userId: string
): Promise<bookBorrowHistory | Error | undefined> => {
  try {
    const result = await UserRepo.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $project: {
          _id: 1,
        },
      },
      {
        $lookup: {
          from: 'borrowedbooks',
          localField: '_id',
          foreignField: 'user_id',
          pipeline: [
            {
              $project: { _id: 0, user_id: 0 },
            },
            {
              $lookup: {
                from: 'copiesbooks',
                localField: 'copy_id',
                foreignField: '_id',
                pipeline: [
                  {
                    $project: { book_id: 1, _id: 0 },
                  },
                  {
                    $lookup: {
                      from: 'books',
                      localField: 'book_id',
                      foreignField: '_id',
                      pipeline: [{ $project: { title: 1, img: 1 } }],
                      as: 'bookTitle',
                    },
                  },
                  {
                    $project: { book_id: 0 },
                  },
                ],
                as: 'book',
              },
            },
            {
              $project: { copy_id: 0, user_id: 0 },
            },
          ],
          as: 'history',
        },
      },
    ])

    if (result.length > 0) {
      const nonEmptyResult = result[0]
      const history = nonEmptyResult.history

      const modifiedHistory: any[] = []

      history.forEach((e: any) => {
        if ('__v' in e) {
          delete e.__v
        }
        modifiedHistory.push({
          ...e,
          book: e.book.length > 0 ? e.book[0] : {},
          returned: 'returned_Date' in e,
        })
      })

      modifiedHistory.forEach((e) => {
        if ('bookTitle' in e.book) {
          e.book = e.book.bookTitle.length > 0 ? e.book.bookTitle[0] : {}
        }
      })

      const cleanedResult = { history: modifiedHistory }

      return cleanedResult
    }

    return undefined
  } catch (e) {
    const err = e as Error
    return err
  }
}

export default {
  getAll,
  getFilteredBook,
  getOneByISBN,
  getOneById,
  getCopiesByBookId,
  getAllCopies,
  getHistory,
  createOne,
  createOneCopy,
  updateOne,
  updateAvailableStatus,
  updateMultiAvailableStatus,
  deleteOne,
}
