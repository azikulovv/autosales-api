import type { Request, Response } from 'express'
import { authService } from './auth.service'
import { loginSchema, registerSchema } from './auth.validation'
import { ApiError } from '../../utils/ApiError'
import { clearRefreshTokenCookie, setRefreshTokenCookie } from '../../utils/tokens'

export const authController = {
  async register(req: Request, res: Response) {
    const parsedData = registerSchema.safeParse(req.body)

    if (!parsedData.success) {
      throw new ApiError(400, parsedData.error.issues[0]?.message || 'Ошибка валидации')
    }

    const result = await authService.register(parsedData.data)

    setRefreshTokenCookie(res, result.refreshToken)

    res.status(201).json({
      success: true,
      message: 'Регистрация прошла успешно',
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    })
  },

  async login(req: Request, res: Response) {
    const parsedData = loginSchema.safeParse(req.body)

    if (!parsedData.success) {
      throw new ApiError(400, parsedData.error.issues[0]?.message || 'Ошибка валидации')
    }

    const result = await authService.login(parsedData.data)

    setRefreshTokenCookie(res, result.refreshToken)

    res.status(200).json({
      success: true,
      message: 'Вход выполнен успешно',
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    })
  },

  async me(req: Request, res: Response) {
    if (!req.user) {
      throw new ApiError(401, 'Не авторизован')
    }

    const user = await authService.getMe(req.user.userId)

    res.status(200).json({
      success: true,
      data: user,
    })
  },

  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies?.refreshToken as string | undefined

    if (!refreshToken) {
      throw new ApiError(401, 'Refresh token отсутствует')
    }

    const result = await authService.refresh(refreshToken)

    setRefreshTokenCookie(res, result.refreshToken)

    res.status(200).json({
      success: true,
      message: 'Токены обновлены',
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    })
  },

  async logout(_req: Request, res: Response) {
    clearRefreshTokenCookie(res)

    res.status(200).json({
      success: true,
      message: 'Вы вышли из аккаунта',
    })
  },
}
