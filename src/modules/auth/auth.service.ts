import type { UserRole } from '@prisma/client'
import { prisma } from '../../prisma/client'
import { ApiError } from '../../utils/ApiError'
import { comparePassword, hashPassword } from '../../utils/hash'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/tokens'
import type { LoginInput, RegisterInput } from './auth.validation'

const getSafeUser = (user: {
  id: string
  name: string
  email: string
  phone: string | null
  role: UserRole
  createdAt: Date
  updatedAt: Date
}) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

export const authService = {
  async register(input: RegisterInput) {
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: input.email },
    })

    if (existingUserByEmail) {
      throw new ApiError(409, 'Пользователь с таким email уже существует')
    }

    if (input.phone) {
      const existingUserByPhone = await prisma.user.findUnique({
        where: { phone: input.phone },
      })

      if (existingUserByPhone) {
        throw new ApiError(409, 'Пользователь с таким номером уже существует')
      }
    }

    const hashedPassword = await hashPassword(input.password)

    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone || null,
        password: hashedPassword,
        role: input.role ?? 'BUYER',
      },
    })

    if (user.role === 'SELLER') {
      await prisma.sellerProfile.create({
        data: {
          userId: user.id,
          shopName: input.name,
        },
      })
    }

    const payload = {
      userId: user.id,
      role: user.role,
    }

    const accessToken = generateAccessToken(payload)
    const refreshToken = generateRefreshToken(payload)

    return {
      user: getSafeUser(user),
      accessToken,
      refreshToken,
    }
  },

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    })

    if (!user) {
      throw new ApiError(401, 'Неверный email или пароль')
    }

    const isPasswordValid = await comparePassword(input.password, user.password)

    if (!isPasswordValid) {
      throw new ApiError(401, 'Неверный email или пароль')
    }

    const payload = {
      userId: user.id,
      role: user.role,
    }

    const accessToken = generateAccessToken(payload)
    const refreshToken = generateRefreshToken(payload)

    return {
      user: getSafeUser(user),
      accessToken,
      refreshToken,
    }
  },

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new ApiError(404, 'Пользователь не найден')
    }

    return getSafeUser(user)
  },

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new ApiError(401, 'Refresh token отсутствует')
    }

    let payload: { userId: string; role: UserRole }

    try {
      payload = verifyRefreshToken(refreshToken)
    } catch {
      throw new ApiError(401, 'Недействительный refresh token')
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    })

    if (!user) {
      throw new ApiError(401, 'Пользователь не найден')
    }

    const nextPayload = {
      userId: user.id,
      role: user.role,
    }

    const nextAccessToken = generateAccessToken(nextPayload)
    const nextRefreshToken = generateRefreshToken(nextPayload)

    return {
      user: getSafeUser(user),
      accessToken: nextAccessToken,
      refreshToken: nextRefreshToken,
    }
  },
}
