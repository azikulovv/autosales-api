import type { NextFunction, Request, Response } from 'express'
import multer from 'multer'

type AppError = Error & {
  statusCode?: number
}

export const errorMiddleware = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.code === 'LIMIT_FILE_SIZE' ? 'Файл слишком большой' : 'Ошибка загрузки файла',
    })
  }

  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal server error'

  return res.status(statusCode).json({
    success: false,
    message,
  })
}
