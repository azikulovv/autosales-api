import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '@prisma/client'
import { env } from 'node:process'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const adapter = new PrismaBetterSqlite3({
  url: env.DATABASE_URL ?? 'file:./dev.db',
})

export const prisma =
  global.prisma ??
  new PrismaClient({
    adapter,
    log: ['warn', 'error'],
  })

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}
