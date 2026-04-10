import { prisma } from '../../prisma/client'
import { ApiError } from '../../utils/ApiError'
import type { GetModelsQuery, GetProductsQuery } from './catalog.validation'

export const catalogService = {
  async getCategories() {
    return prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    })
  },

  async getBrands() {
    return prisma.brand.findMany({
      orderBy: {
        name: 'asc',
      },
    })
  },

  async getModels(query: GetModelsQuery) {
    return prisma.carModel.findMany({
      where: {
        brandId: query.brandId || undefined,
      },
      include: {
        brand: true,
      },
      orderBy: {
        name: 'asc',
      },
    })
  },

  async getProducts(query: GetProductsQuery) {
    const page = query.page ?? 1
    const limit = query.limit ?? 12
    const skip = (page - 1) * limit

    const where = {
      isPublished: true,
      categoryId: query.categoryId || undefined,
      brandId: query.brandId || undefined,
      modelId: query.modelId || undefined,
      condition: query.condition || undefined,
      price: {
        gte: query.minPrice,
        lte: query.maxPrice,
      },
      OR: query.search
        ? [
            {
              title: {
                contains: query.search,
              },
            },
            {
              description: {
                contains: query.search,
              },
            },
            {
              article: {
                contains: query.search,
              },
            },
          ]
        : undefined,
    }

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: {
            orderBy: { sortOrder: 'asc' },
          },
          category: true,
          brand: true,
          model: true,
          seller: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  phone: true,
                },
              },
            },
          },
        },
        orderBy: {
          [query.sortBy ?? 'createdAt']: query.sortOrder ?? 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  },

  async getProductById(productId: string) {
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        isPublished: true,
      },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        category: true,
        brand: true,
        model: true,
        seller: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
          },
        },
      },
    })

    if (!product) {
      throw new ApiError(404, 'Товар не найден')
    }

    return product
  },
}
