import type { Request, Response } from 'express'
import { ApiError } from '../../utils/ApiError'
import { sellersService } from './sellers.service'
import { updateSellerProfileSchema } from './sellers.validation'

export const sellersController = {
  async getMyProfile(req: Request, res: Response) {
    if (!req.user) {
      throw new ApiError(401, 'Не авторизован')
    }

    const profile = await sellersService.getMyProfile(req.user.userId)

    res.status(200).json({
      success: true,
      data: profile,
    })
  },

  async updateMyProfile(req: Request, res: Response) {
    if (!req.user) {
      throw new ApiError(401, 'Не авторизован')
    }

    const parsedData = updateSellerProfileSchema.safeParse(req.body)

    if (!parsedData.success) {
      throw new ApiError(400, parsedData.error.issues[0]?.message || 'Ошибка валидации')
    }

    const profile = await sellersService.updateMyProfile(req.user.userId, parsedData.data)

    res.status(200).json({
      success: true,
      message: 'Профиль продавца обновлен',
      data: profile,
    })
  },
}
