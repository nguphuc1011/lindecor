import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const updated = await prisma.product.updateMany({
    where: {
      type: 'retail',
      OR: [
        { category: null },
        { category: { notIn: ['Phụ kiện', 'Thiệp mời', 'Quà tặng'] } }
      ]
    },
    data: { category: 'Phụ kiện' }
  })
  console.log('Retail updated:', updated.count)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
