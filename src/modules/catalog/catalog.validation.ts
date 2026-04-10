import { z } from 'zod'

export const getModelsQuerySchema = z.object({
  brandId: z.string().trim().optional(),
})

export const getProductsQuerySchema = z.object({
  search: z.string().trim().optional(),
  categoryId: z.string().trim().optional(),
  brandId: z.string().trim().optional(),
  modelId: z.string().trim().optional(),
  condition: z.enum(['NEW', 'USED']).optional(),
  minPrice: z.coerce.number().int().min(0).optional(),
  maxPrice: z.coerce.number().int().min(0).optional(),
  sortBy: z.enum(['createdAt', 'price']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(12),
})

export type GetModelsQuery = z.infer<typeof getModelsQuerySchema>
export type GetProductsQuery = z.infer<typeof getProductsQuerySchema>
