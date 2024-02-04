import Stats from '../models/statsModel.js'
import type { CrudStats, CrudType } from '../types/CrudStats.js'

async function createNewCrudStats(): Promise<CrudStats | Error> {
  const newCrudStats = new Stats({
    name: 'crud-stats',
    data: {
      create: {
        total: 0,
        successful: 0,
      },
      read: {
        total: 1,
        successful: 1,
      },
      update: {
        total: 0,
        successful: 0,
      },
      delete: {
        total: 0,
        successful: 0,
      },
    },
  })

  try {
    const savedCrudStats = await newCrudStats.save()
    return savedCrudStats?.data
  } catch (e) {
    return e as Error
  }
}

async function getAll(): Promise<CrudStats | Error> {
  try {
    const crudStats = await Stats.findOne({ name: 'crud-stats' })
    if (crudStats == null) {
      try {
        return await createNewCrudStats()
      } catch (e) {
        return e as Error
      }
    }

    return crudStats?.data as CrudStats
  } catch (e) {
    return e as Error
  }
}

async function getOne(
  type: keyof CrudStats
): Promise<CrudStats | undefined | Error> {
  try {
    const crudStats = await Stats.findOne({ name: 'crud-stats' })
    if (crudStats == null) {
      try {
        return await createNewCrudStats()
      } catch (e) {
        return e as Error
      }
    }
    return crudStats?.data as CrudStats
  } catch (e) {
    return e as Error
  }
}

async function increment(
  type: CrudType,
  isSuccess: boolean
): Promise<CrudStats | Error> {
  const filter = { name: 'crud-stats' }
  let update

  if (isSuccess) {
    update = {
      $inc: {
        [`data.${type}.total`]: 1,
        [`data.${type}.successful`]: 1,
      },
    }
  } else {
    update = {
      $inc: {
        [`data.${type}.total`]: 1,
      },
    }
  }

  const options = { new: true }
  try {
    const updatedCrudStats = await Stats.findOneAndUpdate(
      filter,
      update,
      options
    )
    return updatedCrudStats?.data
  } catch (e) {
    return e as Error
  }
}

export default { getAll, increment, getOne }
