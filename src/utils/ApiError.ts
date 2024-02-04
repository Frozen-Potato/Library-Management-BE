export class ApiError {
  constructor(
    public code: number,
    public message: string,
    public errors?: object
  ) {
    this.code = code
    this.message = message
    if (errors != null) {
      this.errors = errors
    }
  }

  static badRequest(message: string, errors?: any): ApiError {
    return new ApiError(400, message, errors)
  }

  static unauthorized(message: string): ApiError {
    return new ApiError(401, message)
  }

  static forbidden(message: string): ApiError {
    return new ApiError(403, message)
  }

  static notFound(message: string): ApiError {
    return new ApiError(404, message)
  }

  static methodNotAllowed(message: string): ApiError {
    return new ApiError(405, message)
  }

  static conflict(message: string): ApiError {
    return new ApiError(409, message)
  }

  static unprocessableEntity(message: string): ApiError {
    return new ApiError(422, message)
  }

  static internal(message: string): ApiError {
    return new ApiError(500, message)
  }
}
