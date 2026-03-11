import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function test() {
  console.log("--- ĐANG KIỂM TRA KẾT NỐI PRISMA ---")
  console.log("DATABASE_URL:", process.env.DATABASE_URL?.substring(0, 20) + "...")
  
  try {
    const count = await prisma.product.count()
    console.log("✅ Kết nối thành công! Số lượng sản phẩm:", count)
    
    const settings = await prisma.setting.findMany()
    console.log("✅ Bảng Setting: ok, bản ghi:", settings.length)

    const banners = await prisma.banner.findMany()
    console.log("✅ Bảng Banner: ok, bản ghi:", banners.length)

    const services = await prisma.service.findMany()
    console.log("✅ Bảng Service: ok, bản ghi:", services.length)

    const filters = await prisma.filterOption.findMany()
    console.log("✅ Bảng FilterOption: ok, bản ghi:", filters.length)
  } catch (error) {
    console.error("❌ Lỗi kết nối Database:", error)
  } finally {
    await prisma.$disconnect()
  }
}

test()
