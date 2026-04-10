import type { UserRole } from '@prisma/client'

export type JwtPayloadData = {
  userId: string
  role: UserRole
}

export type SafeUser = {
  id: string
  name: string
  email: string
  phone: string | null
  role: UserRole
  createdAt: Date
  updatedAt: Date
}
