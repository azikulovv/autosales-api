import type { Request, Response } from 'express'
import { ApiError } from '../../utils/ApiError'
import { productsService } from './products.service'
import { createProductSchema, updateProductSchema } from './products.validation'

export const productsController = {
  async create(req: Request, res: Response) {
    if (!req.user) {
      throw new ApiError(401, 'Не авторизован')
    }

    const parsedData = createProductSchema.safeParse(req.body)

    if (!parsedData.success) {
      throw new ApiError(400, parsedData.error.issues[0]?.message || 'Ошибка валидации')
    }

    const product = await productsService.create(req.user.userId, parsedData.data)

    res.status(201).json({
      success: true,
      message: 'Товар создан',
      data: product,
    })
  },

  async getMyProducts(req: Request, res: Response) {
    if (!req.user) {
      throw new ApiError(401, 'Не авторизован')
    }

    const products = await productsService.getMyProducts(req.user.userId)

    res.status(200).json({
      success: true,
      data: products,
    })
  },

  async getMyProductById(req: Request, res: Response) {
    if (!req.user) {
      throw new ApiError(401, 'Не авторизован')
    }

    const productId = req.params.id as string

    const product = await productsService.getMyProductById(req.user.userId, productId)

    res.status(200).json({
      success: true,
      data: product,
    })
  },

  async update(req: Request, res: Response) {
    if (!req.user) {
      throw new ApiError(401, 'Не авторизован')
    }

    const productId = req.params.id as string
    const parsedData = updateProductSchema.safeParse(req.body)

    if (!parsedData.success) {
      throw new ApiError(400, parsedData.error.issues[0]?.message || 'Ошибка валидации')
    }

    const product = await productsService.update(req.user.userId, productId, parsedData.data)

    res.status(200).json({
      success: true,
      message: 'Товар обновлен',
      data: product,
    })
  },

  async remove(req: Request, res: Response) {
    if (!req.user) {
      throw new ApiError(401, 'Не авторизован')
    }

    const productId = req.params.id as string

    const result = await productsService.remove(req.user.userId, productId)

    res.status(200).json({
      success: true,
      message: 'Товар удален',
      data: result,
    })
  },
}
