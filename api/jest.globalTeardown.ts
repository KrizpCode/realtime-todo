import { prisma } from './src/db/client'

export default async () => {
  await prisma.$disconnect()
}
