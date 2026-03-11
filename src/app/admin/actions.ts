'use server'

import { prisma } from '../../lib/prisma'
import { revalidatePath } from 'next/cache'
import { createClient } from '@supabase/supabase-js'

console.log("--- ACTIONS LOADED ---")

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn("⚠️ THIẾU CẤU HÌNH SUPABASE TRONG ENV")
}

const supabase = createClient(
  supabaseUrl || '',
  supabaseKey || ''
)

// --- 1. XỬ LÝ ẢNH (DÙNG SUPABASE STORAGE) ---
async function saveImage(file: File) {
  if (!file || file.size === 0) return '/placeholder.png'
  
  try {
    const bytes = await file.arrayBuffer()
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    
    console.log("Đang upload ảnh lên Supabase:", filename)

    // Kiểm tra xem bucket có tồn tại không
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
    if (bucketError) {
      console.error("Lỗi liệt kê bucket:", bucketError)
    } else {
      const exists = buckets.find(b => b.name === 'images')
      if (!exists) {
        throw new Error("Bucket 'images' chưa được tạo trong Supabase Storage. Hãy tạo bucket tên là 'images' và để chế độ Public.")
      }
    }

    const { data, error } = await supabase.storage
      .from('images')
      .upload(filename, bytes, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: true
      })

    if (error) {
      console.error("Lỗi upload Supabase chi tiết:", error)
      throw new Error(`Lỗi Supabase Storage: ${error.message || 'Không xác định'}. Hãy kiểm tra xem bucket 'images' đã được tạo chưa?`)
    }

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filename)

    console.log("Upload thành công, publicUrl:", publicUrl)
    return publicUrl
  } catch (err) {
    console.error("Lỗi xử lý ảnh:", err)
    throw err // Ném lỗi để frontend bắt được
  }
}

// --- HÀM HELPER SINH MÃ MẪU TỰ ĐỘNG ---
function getAbbreviation(text: string) {
  if (!text) return 'MAU'
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Bỏ dấu tiếng Việt
    .split(/\s+/)
    .map(word => word[0])
    .join('')
    .toUpperCase()
}

async function generateNextCode(topic: string | null) {
  const prefix = topic ? getAbbreviation(topic) : 'MAU'
  
  // Tìm mã lớn nhất có cùng prefix
  const lastProduct = await prisma.product.findFirst({
    where: {
      code: {
        startsWith: prefix
      }
    },
    orderBy: {
      code: 'desc'
    }
  })

  let nextNumber = 555
  if (lastProduct && lastProduct.code) {
    const lastNumberStr = lastProduct.code.replace(prefix, '')
    const lastNumber = parseInt(lastNumberStr)
    if (!isNaN(lastNumber)) {
      nextNumber = lastNumber + 1
    }
  }

  return `${prefix}${nextNumber}`
}

// --- 2. QUẢN LÝ BỘ LỌC (DÙNG CHO TRANG FILTERS) ---
export async function addFilterOption(formData: FormData) {
  const category = formData.get('category') as string
  const value = formData.get('value') as string
  const type = formData.get('type') as string || 'template'
  if (!value) return

  // Kiểm tra trùng lặp
  const existing = await prisma.filterOption.findFirst({
    where: { category, value, type }
  })
  if (existing) return

  await prisma.filterOption.create({
    data: { category, value, type }
  })
  revalidatePath('/admin')
}

export async function updateFilterOption(id: string, newValue: string) {
  await prisma.filterOption.update({
    where: { id },
    data: { value: newValue }
  })
  revalidatePath('/admin')
}

export async function deleteFilterOption(id: string) {
  await prisma.filterOption.delete({ where: { id } })
  revalidatePath('/admin')
}

export async function renameCategory(oldCategory: string, newCategory: string, type: string) {
  if (!newCategory || oldCategory === newCategory) return
  await prisma.filterOption.updateMany({
    where: { category: oldCategory, type },
    data: { category: newCategory }
  })
  revalidatePath('/admin')
}

export async function deleteCategory(category: string, type: string) {
  await prisma.filterOption.deleteMany({
    where: { category, type }
  })
  revalidatePath('/admin')
}

export async function updateFilterOrder(categories: string[], type: string) {
  // Cập nhật 'order' cho tất cả FilterOption dựa trên thứ tự category được truyền vào trong cùng một type
  await Promise.all(categories.map((cat, index) => 
    prisma.filterOption.updateMany({
      where: { category: cat, type },
      data: { order: index }
    })
  ))
  revalidatePath('/admin')
}

export async function getAllAdminData() {
  console.log("--- ĐANG LẤY DỮ LIỆU ADMIN ---")
  try {
    const [filters, products, settings, banners, services, processSteps, testimonials] = await Promise.all([
      prisma.filterOption.findMany({ 
        orderBy: [
          { order: 'asc' },
          { category: 'asc' }
        ]
      }),
      prisma.product.findMany({
        orderBy: { createdAt: 'desc' }
      }),
      prisma.setting.findMany(),
      prisma.banner.findMany({
        orderBy: { order: 'asc' }
      }),
      prisma.service.findMany({ orderBy: { order: 'asc' } }),
      prisma.processStep.findMany({ orderBy: { order: 'asc' } }),
      prisma.testimonial.findMany({ orderBy: { order: 'asc' } })
    ])
    console.log("--- LẤY DỮ LIỆU THÀNH CÔNG ---")

    const settingsMap: Record<string, string> = {}
    settings.forEach(s => {
      settingsMap[s.key] = s.value
    })

    return {
      filters,
      products,
      settings: settingsMap,
      banners,
      services,
      processSteps,
      testimonials
    }
  } catch (error) {
    console.error("--- LỖI KHI LẤY DỮ LIỆU ADMIN:", error)
    throw error
  }
}

export async function getFilters() {
  return await prisma.filterOption.findMany({ 
    orderBy: [
      { order: 'asc' },
      { category: 'asc' }
    ] 
  })
}

// --- 3. QUẢN LÝ NỘI DUNG (DÙNG CHO TRANG DESIGNS & PRODUCTS) ---
export async function addProduct(formData: FormData) {
  const type = formData.get('type') as string // 'template' hoặc 'retail'
  const file = formData.get('file') as File
  const imageUrl = await saveImage(file)

  // Lấy tất cả các filter categories hiện có cho type này
  const allFilters = await prisma.filterOption.findMany({
    where: { type }
  })
  const categories = Array.from(new Set(allFilters.map(f => f.category)))

  const getMulti = (name: string) => {
    const values = formData.getAll(name)
    return values.length > 0 ? values.join(', ') : null
  }

  const filterData: Record<string, string | null> = {}
  categories.forEach(cat => {
    filterData[cat] = getMulti(cat)
  })

  // Sinh mã mẫu tự động nếu là template
  let code = null
  if (type === 'template') {
    const firstTheme = formData.get('theme') as string // Lấy giá trị đầu tiên được chọn
    code = await generateNextCode(firstTheme)
  }

  try {
    await prisma.product.create({
      data: {
        name: formData.get('name') as string,
        code: code,
        type: type,
        imageUrl: imageUrl,
        price: parseFloat(formData.get('price') as string) || 0,
        description: formData.get('description') as string || "",
        category: type,
        filterData: JSON.stringify(filterData)
      }
    })
    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    console.error("Lỗi khi lưu Database:", error)
    return { success: false, error: error.message || "Không thể lưu dữ liệu sản phẩm" }
  }
}

// Lấy danh sách sản phẩm để hiển thị
export async function getProducts() {
  return await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  })
}

export async function updateProduct(formData: FormData) {
  const id = formData.get('id') as string
  const type = formData.get('type') as string
  const file = formData.get('file') as File
  
  let imageUrl = formData.get('currentImageUrl') as string
  if (file && file.size > 0) {
    imageUrl = await saveImage(file)
  }

  // Lấy tất cả các filter categories hiện có
  const allFilters = await prisma.filterOption.findMany({
    where: { type }
  })
  const categories = Array.from(new Set(allFilters.map(f => f.category)))

  const getMulti = (name: string) => {
    const values = formData.getAll(name)
    return values.length > 0 ? values.join(', ') : null
  }

  const filterData: Record<string, string | null> = {}
  categories.forEach(cat => {
    filterData[cat] = getMulti(cat)
  })

  try {
    await prisma.product.update({
      where: { id },
      data: {
        name: formData.get('name') as string,
        code: formData.get('code') as string || undefined,
        type: type,
        imageUrl: imageUrl,
        price: parseFloat(formData.get('price') as string) || 0,
        description: formData.get('description') as string || "",
        filterData: JSON.stringify(filterData)
      }
    })

    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    console.error("Lỗi khi cập nhật Database:", error)
    return { success: false, error: error.message || "Không thể cập nhật dữ liệu sản phẩm" }
  }
}

// --- 4. CÀI ĐẶT CHUNG ---
export async function getSettings() {
  const settings = await prisma.setting.findMany()
  const result: Record<string, string> = {}
  settings.forEach(s => {
    result[s.key] = s.value
  })
  return result
}

export async function updateSetting(key: string, value: string) {
  await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value }
  })
  revalidatePath('/admin')
  revalidatePath('/')
}

export async function updateSettings(data: Record<string, string>) {
  const operations = Object.entries(data).map(([key, value]) => 
    prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    })
  )
  await prisma.$transaction(operations)
  revalidatePath('/admin')
  revalidatePath('/')
}

export async function uploadLogo(formData: FormData) {
  try {
    const file = formData.get('logo') as File
    console.log("--- BẮT ĐẦU UPLOAD LOGO ---")
    console.log("File:", file?.name, "Size:", file?.size)

    if (!file || file.size === 0) {
      return { success: false, error: "Không tìm thấy file logo" }
    }
    
    const logoUrl = await saveImage(file)
    console.log("--- LƯU ẢNH THÀNH CÔNG, CẬP NHẬT SETTING ---")
    
    await updateSetting('logo', logoUrl)
    
    revalidatePath('/admin')
    revalidatePath('/')
    
    return { success: true, url: logoUrl }
  } catch (error: any) {
    console.error("--- LỖI UPLOAD LOGO CỰC CHI TIẾT:", error)
    return { 
      success: false, 
      error: error.message || "Lỗi không xác định khi upload logo" 
    }
  }
}

export async function uploadBannerImage(formData: FormData) {
  try {
    const file = formData.get('bannerImageFile') as File
    if (!file || file.size === 0) return { success: false, error: "Không tìm thấy file banner" }
    
    const bannerUrl = await saveImage(file)
    await updateSetting('bannerImage', bannerUrl)
    
    revalidatePath('/admin')
    revalidatePath('/')
    
    return { success: true, url: bannerUrl }
  } catch (error: any) {
    console.error("Lỗi upload banner setting:", error)
    return { success: false, error: error.message }
  }
}

// --- 5. QUẢN LÝ SLIDE BANNER ---
export async function getBanners() {
  return await prisma.banner.findMany({
    orderBy: { order: 'asc' }
  })
}

export async function addBanner(formData: FormData) {
  try {
    const file = formData.get('image') as File
    if (!file || file.size === 0) return { success: false, error: "Vui lòng chọn ảnh banner" }
    
    const imageUrl = await saveImage(file)
    
    await prisma.banner.create({
      data: {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        imageUrl: imageUrl,
        buttonText: formData.get('buttonText') as string || "Xem chi tiết",
        buttonLink: formData.get('buttonLink') as string || "/",
        order: parseInt(formData.get('order') as string) || 0
      }
    })
    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    console.error("Lỗi khi thêm banner:", error)
    return { success: false, error: error.message || "Không thể thêm banner" }
  }
}

export async function updateBanner(formData: FormData) {
  try {
    const id = formData.get('id') as string
    const file = formData.get('image') as File
    let imageUrl = formData.get('currentImageUrl') as string

    if (file && file.size > 0) {
      imageUrl = await saveImage(file)
    }

    await prisma.banner.update({
      where: { id },
      data: {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        imageUrl: imageUrl,
        buttonText: formData.get('buttonText') as string,
        buttonLink: formData.get('buttonLink') as string,
        order: parseInt(formData.get('order') as string) || 0
      }
    })
    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    console.error("Lỗi khi cập nhật banner:", error)
    return { success: false, error: error.message || "Không thể cập nhật banner" }
  }
}

export async function deleteBanner(id: string) {
  await prisma.banner.delete({ where: { id } })
  revalidatePath('/')
  revalidatePath('/admin')
}

// --- 6. QUẢN LÝ DỊCH VỤ (SERVICES) ---
export async function getServices() {
  return await prisma.service.findMany({ orderBy: { order: 'asc' } })
}

export async function upsertService(formData: FormData) {
  try {
    const id = formData.get('id') as string
    const file = formData.get('image') as File
    let imageUrl = formData.get('currentImageUrl') as string

    if (file && file.size > 0) {
      imageUrl = await saveImage(file)
    }

    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      imageUrl: imageUrl,
      iconName: formData.get('iconName') as string,
      order: parseInt(formData.get('order') as string) || 0
    }
    
    if (id) {
      await prisma.service.update({ where: { id }, data })
    } else {
      await prisma.service.create({ data })
    }
    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    console.error("Lỗi khi xử lý dịch vụ:", error)
    return { success: false, error: error.message || "Không thể lưu dịch vụ" }
  }
}

export async function deleteService(id: string) {
  await prisma.service.delete({ where: { id } })
  revalidatePath('/')
}

// --- 7. QUẢN LÝ QUY TRÌNH (PROCESS) ---
export async function getProcessSteps() {
  return await prisma.processStep.findMany({ orderBy: { order: 'asc' } })
}

export async function upsertProcessStep(formData: FormData) {
  const id = formData.get('id') as string
  const data = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    order: parseInt(formData.get('order') as string) || 0
  }
  
  if (id) {
    await prisma.processStep.update({ where: { id }, data })
  } else {
    await prisma.processStep.create({ data })
  }
  revalidatePath('/')
  revalidatePath('/admin')
}

export async function deleteProcessStep(id: string) {
  await prisma.processStep.delete({ where: { id } })
  revalidatePath('/')
}

// --- 8. QUẢN LÝ FEEDBACK (TESTIMONIALS) ---
export async function getTestimonials() {
  return await prisma.testimonial.findMany({ orderBy: { order: 'asc' } })
}

export async function upsertTestimonial(formData: FormData) {
  const id = formData.get('id') as string
  const data = {
    clientName: formData.get('clientName') as string,
    content: formData.get('content') as string,
    eventType: formData.get('eventType') as string,
    order: parseInt(formData.get('order') as string) || 0
  }
  
  if (id) {
    await prisma.testimonial.update({ where: { id }, data })
  } else {
    await prisma.testimonial.create({ data })
  }
  revalidatePath('/')
  revalidatePath('/admin')
}

export async function deleteTestimonial(id: string) {
  await prisma.testimonial.delete({ where: { id } })
  revalidatePath('/')
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id }
    })
    revalidatePath('/admin')
    revalidatePath('/')
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error)
    throw new Error("Không thể xóa sản phẩm.")
  }
}