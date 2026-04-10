import { prisma } from '../../prisma/client'
import { ApiError } from '../../utils/ApiError'
import type { UpdateSellerProfileInput } from './sellers.validation'

const normalizeOptionalString = (value?: string) => {
  if (value === undefined) return undefined
  return value === '' ? null : value
}

export const sellersService = {
  async getMyProfile(userId: string) {
    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
          },
        },
      },
    })

    if (!sellerProfile) {
      throw new ApiError(404, 'Профиль продавца не найден')
    }

    return sellerProfile
  },

  async updateMyProfile(userId: string, input: UpdateSellerProfileInput) {
    const existingProfile = await prisma.sellerProfile.findUnique({
      where: { userId },
    })

    if (!existingProfile) {
      throw new ApiError(404, 'Профиль продавца не найден')
    }

    const updatedProfile = await prisma.sellerProfile.update({
      where: { userId },
      data: {
        shopName: input.shopName ?? undefined,
        description: normalizeOptionalString(input.description),
        city: normalizeOptionalString(input.city),
        address: normalizeOptionalString(input.address),
        avatar: normalizeOptionalString(input.avatar),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
          },
        },
      },
    })

    return updatedProfile
  },
}
