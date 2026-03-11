import { PrismaClient } from '@prisma/client'

const dbUrl = "postgresql://postgres:LinDecor%400822551209@db.hqojjjtzqgerurzdznqn.supabase.co:5432/postgres"

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl,
    },
  },
})

const sqlitePrisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./prisma/dev.db',
    },
  },
})

async function migrate() {
  console.log('🚀 Đang bắt đầu quá trình chuyển dữ liệu bộ lọc...')
  
  try {
    const oldFilters = await sqlitePrisma.$queryRawUnsafe(`SELECT * FROM FilterOption`)
    console.log(`📦 Tìm thấy ${oldFilters.length} bộ lọc trong SQLite.`)

    if (oldFilters.length === 0) return

    console.log('🔗 Đang kết nối với Supabase...')
    
    let count = 0
    for (const filter of oldFilters) {
      await prisma.filterOption.create({
        data: {
          category: filter.category,
          value: filter.value,
          order: filter.order || 0,
          type: filter.type || 'template'
        }
      })
      count++
      if (count % 5 === 0) console.log(`✅ Đã chuyển ${count}/${oldFilters.length} bộ lọc...`)
    }

    console.log('🎉 CHÚC MỪNG! Toàn bộ bộ lọc đã được chuyển lên Supabase thành công.')

  } catch (error) {
    console.error('💥 Lỗi:', error)
  } finally {
    await prisma.$disconnect()
    await sqlitePrisma.$disconnect()
  }
}

migrate()
