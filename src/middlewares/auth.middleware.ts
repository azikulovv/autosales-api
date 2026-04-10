import type { NextFunction, Request, Response } from 'express'
import type { UserRole } from '@prisma/client'
import { ApiError } from '../utils/ApiError'
import { verifyAccessToken } from '../utils/tokens'

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Требуется авторизация'))
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    return next(new ApiError(401, 'Токен не передан'))
  }

  try {
    const payload = verifyAccessToken(token)

    req.user = {
      userId: payload.userId,
      role: payload.role,
    }

    next()
  } catch {
    next(new ApiError(401, 'Недействительный access token'))
  }
}

export const allowRoles = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, 'Требуется авторизация'))
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Недостаточно прав'))
    }

    next()
  }
}
