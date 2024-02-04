interface ParsingType {
  field: string
  error: string
}

const customZodErrorParser = (error: Record<string, any>): ParsingType[] => {
  const errorMap: ParsingType[] = []
  const fieldErrors = error.fieldErrors

  Object.keys(fieldErrors).forEach((key) => {
    errorMap.push({
      field: key,
      error: fieldErrors[key].join(' and '),
    })
  })

  if (error.formErrors.length > 0) {
    errorMap.push({
      field: 'Form Error',
      error: error.formErrors.join(''),
    })
  }

  return errorMap
}

export default customZodErrorParser
