import { PrismaClient } from '@/generated/prisma' 


console.log('Initializing Prisma Client...')

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

console.log('Prisma Client initialized successfully')