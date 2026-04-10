import type { Request, Response } from 'express'
import { ApiError } from '../../utils/ApiError'
import { catalogService } from './catalog.service'
import { getModelsQuerySchema, getProductsQuerySchema } from './catalog.validation'

export const catalogController = {
  async getCategories(_req: Request, res: Response) {
    const categories = await catalogService.getCategories()

    res.status(200).json({
      success: true,
      data: categories,
    })
  },

  async getBrands(_req: Request, res: Response) {
    const brands = await catalogService.getBrands()

    res.status(200).json({
      success: true,
      data: brands,
    })
  },

  async getModels(req: Request, res: Response) {
    const parsedQuery = getModelsQuerySchema.safeParse(req.query)

    if (!parsedQuery.success) {
      throw new ApiError(400, parsedQuery.error.issues[0]?.message || 'Ошибка валидации query')
    }

    const models = await catalogService.getModels(parsedQuery.data)

    res.status(200).json({
      success: true,
      data: models,
    })
  },

  async getProducts(req: Request, res: Response) {
    const parsedQuery = getProductsQuerySchema.safeParse(req.query)

    if (!parsedQuery.success) {
      throw new ApiError(400, parsedQuery.error.issues[0]?.message || 'Ошибка валидации query')
    }

    const result = await catalogService.getProducts(parsedQuery.data)

    res.status(200).json({
      success: true,
      data: result.items,
      meta: result.meta,
    })
  },

  async getProductById(req: Request, res: Response) {
    const productId = req.params.id as string

    if (!productId) {
      throw new ApiError(400, 'productId обязателен')
    }

    const product = await catalogService.getProductById(productId)

    res.status(200).json({
      success: true,
      data: product,
    })
  },
}
