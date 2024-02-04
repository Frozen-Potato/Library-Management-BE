import { type Model } from 'mongoose'

const filter = async (
  searchFields: any[], // This field will be used for search
  filter: Record<string, any>,
  repo: Model<any>
): Promise<Record<string, any> | Error> => {
  const Repo = repo

  const searchQuery = filter.search ?? ''

  const sortBy = filter.sortBy ?? '_id'
  const sortOrder =
    filter.sortOrder === 'asc' ? 1 : filter.sortOrder === 'desc' ? -1 : 1

  const page =
    'page' in filter
      ? !Number.isNaN(+filter.page)
        ? +filter.page !== 0
          ? +filter.page
          : 1
        : 1
      : 1

  const perPage =
    'perPage' in filter
      ? !Number.isNaN(+filter.perPage)
        ? +filter.perPage !== 0
          ? +filter.perPage
          : 10
        : 10
      : 10

  const limit = perPage
  const skip = perPage * (page - 1)
  delete filter.perPage
  delete filter.page
  delete filter.search
  delete filter.sortBy
  delete filter.sortOrder
  delete filter.filter

  const searchFilter: any[] = []
  searchFields.forEach((searchField) => {
    searchFilter.push({ [searchField]: { $regex: `${searchQuery}` } })
  })

  filter = {
    ...filter,
    $and: [
      {
        $or: searchFilter,
      },
    ],
  }

  try {
    const count = await Repo.countDocuments(filter, {
      author: { $regex: `${searchQuery}` },
    })
    const data = await Repo.find(filter)
      .sort({ [sortBy]: sortOrder })
      .limit(limit)
      .skip(skip)
    const result = { data, page, perPage, totalCount: count }
    return result
  } catch (e) {
    const err = e as Error
    return err
  }
}

export default {
  filter,
}
