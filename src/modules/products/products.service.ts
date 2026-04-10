import { prisma } from '../../prisma/client'
import { ApiError } from '../../utils/ApiError'
import type { CreateProductInput, UpdateProductInput } from './products.validation'

const normalizeOptionalString = (value?: string) => {
  if (value === undefined) return undefined
  return value === '' ? null : value
}

const getSellerProfileByUserId = async (userId: string) => {
  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: { userId },
  })

  if (!sellerProfile) {
    throw new ApiError(404, 'Профиль продавца не найден')
  }

  return sellerProfile
}

const ensureCategoryExists = async (categoryId: string) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  })

  if (!category) {
    throw new ApiError(404, 'Категория не найдена')
  }

  return category
}

const ensureBrandExists = async (brandId: string) => {
  const brand = await prisma.brand.findUnique({
    where: { id: brandId },
  })

  if (!brand) {
    throw new ApiError(404, 'Бренд не найден')
  }

  return brand
}

const ensureModelValid = async (modelId: string | null | undefined, brandId: string) => {
  if (!modelId) return null

  const model = await prisma.carModel.findUnique({
    where: { id: modelId },
  })

  if (!model) {
    throw new ApiError(404, 'Модель не найдена')
  }

  if (model.brandId !== brandId) {
    throw new ApiError(400, 'Модель не принадлежит выбранному бренду')
  }

  return model
}

export const productsService = {
  async create(userId: string, input: CreateProductInput) {
    const sellerProfile = await getSellerProfileByUserId(userId)

    await ensureCategoryExists(input.categoryId)
    await ensureBrandExists(input.brandId)
    await ensureModelValid(input.modelId || null, input.brandId)

    const product = await prisma.product.create({
      data: {
        sellerId: sellerProfile.id,
        categoryId: input.categoryId,
        brandId: input.brandId,
        modelId: input.modelId || null,
        title: input.title,
        description: normalizeOptionalString(input.description),
        price: input.price,
        stock: input.stock ?? 1,
        article: normalizeOptionalString(input.article),
        condition: input.condition ?? 'USED',
        isPublished: input.isPublished ?? false,
        images: {
          create: (input.images ?? []).map((image, index) => ({
            url: image.url,
            sortOrder: image.sortOrder ?? index,
          })),
        },
      },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        category: true,
        brand: true,
        model: true,
      },
    })

    return product
  },

  async getMyProducts(userId: string) {
    const sellerProfile = await getSellerProfileByUserId(userId)

    return prisma.product.findMany({
      where: {
        sellerId: sellerProfile.id,
      },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        category: true,
        brand: true,
        model: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  },

  async getMyProductById(userId: string, productId: string) {
    const sellerProfile = await getSellerProfileByUserId(userId)

    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        sellerId: sellerProfile.id,
      },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        category: true,
        brand: true,
        model: true,
      },
    })

    if (!product) {
      throw new ApiError(404, 'Товар не найден')
    }

    return product
  },

  async update(userId: string, productId: string, input: UpdateProductInput) {
    const sellerProfile = await getSellerProfileByUserId(userId)

    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productId,
        sellerId: sellerProfile.id,
      },
      include: {
        images: true,
      },
    })

    if (!existingProduct) {
      throw new ApiError(404, 'Товар не найден')
    }

    const nextCategoryId = input.categoryId ?? existingProduct.categoryId
    const nextBrandId = input.brandId ?? existingProduct.brandId
    const nextModelId =
      input.modelId === undefined ? existingProduct.modelId : input.modelId || null

    if (input.categoryId) {
      await ensureCategoryExists(input.categoryId)
    }

    if (input.brandId) {
      await ensureBrandExists(input.brandId)
    }

    await ensureModelValid(nextModelId, nextBrandId)
    await ensureCategoryExists(nextCategoryId)
    await ensureBrandExists(nextBrandId)

    const updatedProduct = await prisma.$transaction(async (tx) => {
      if (input.images) {
        await tx.productImage.deleteMany({
          where: { productId: existingProduct.id },
        })
      }

      const product = await tx.product.update({
        where: { id: existingProduct.id },
        data: {
          title: input.title ?? undefined,
          description: normalizeOptionalString(input.description),
          price: input.price ?? undefined,
          stock: input.stock ?? undefined,
          categoryId: nextCategoryId,
          brandId: nextBrandId,
          modelId: nextModelId,
          article: normalizeOptionalString(input.article),
          condition: input.condition ?? undefined,
          isPublished: input.isPublished ?? undefined,
          images: input.images
            ? {
                create: input.images.map((image, index) => ({
                  url: image.url,
                  sortOrder: image.sortOrder ?? index,
                })),
              }
            : undefined,
        },
        include: {
          images: {
            orderBy: { sortOrder: 'asc' },
          },
          category: true,
          brand: true,
          model: true,
        },
      })

      return product
    })

    return updatedProduct
  },

  async remove(userId: string, productId: string) {
    const sellerProfile = await getSellerProfileByUserId(userId)

    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productId,
        sellerId: sellerProfile.id,
      },
    })

    if (!existingProduct) {
      throw new ApiError(404, 'Товар не найден')
    }

    await prisma.product.delete({
      where: { id: existingProduct.id },
    })

    return {
      id: existingProduct.id,
    }
  },
}
