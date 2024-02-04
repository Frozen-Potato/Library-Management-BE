import { type convertedPaginationDataType } from '../types/AdditionalType.js'

export const convertedPaginationData = (
  data: any[],
  page?: number,
  perPage?: number,
  totalCount?: number
): convertedPaginationDataType => {
  const dataLength = data.length === 0 ? 1 : data.length
  totalCount = totalCount ?? dataLength
  page = page ?? 1
  perPage = perPage ?? dataLength
  const totalPageCount = Math.ceil(totalCount / perPage)
  const result = {
    perPage,
    page,
    totalCount,
    totalPageCount,
    data,
  }
  return result
}
