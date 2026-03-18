'use client'
import { useState, useMemo } from 'react'
import { Search, Filter, X, Sparkles, Palette, MapPin, Tag, Users, Info, Layers, Maximize2, Share2, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

function getTagsFromProduct(item: any) {
  const tags: { label: string, color: string, category: string }[] = []
  if (item.filterData) {
    try {
      const data = JSON.parse(item.filterData)
      Object.entries(data).forEach(([key, val]: [string, any]) => {
        if (val) tags.push({ label: val, color: 'slate', category: key })
      })
    } catch (e) {}
  }
  const hardcoded = ['theme', 'color', 'location', 'gender', 'ageRange']
  hardcoded.forEach(key => {
    const val = item[key] as string
    if (val && !tags.find(t => t.label === val)) {
      tags.push({ label: val, color: 'slate', category: key })
    }
  })
  if (item.priceRange) {
    if (!tags.find(t => t.label === item.priceRange)) {
      tags.push({ label: item.priceRange, color: 'indigo', category: 'priceRange' })
    }
  }
  return tags
}

function generateProductStory(product: any) {
  const tags = getTagsFromProduct(product)
  const getVal = (cat: string) => tags.find(t => t.category === cat)?.label || ''

  const theme = getVal('theme')
  const location = getVal('location')
  const color = getVal('color')
  const gender = getVal('gender')
  const age = getVal('ageRange')
  const price = getVal('priceRange')

  let story = ""
  if (theme) story += `Đây là mẫu thiết kế mang chủ đề **${theme}** đầy ấn tượng. `
  else story += `Mẫu thiết kế độc đáo này được LinDecor chăm chút tỉ mỉ từng chi tiết. `

  if (gender || age) story += `Sản phẩm được sáng tạo dành riêng cho **${gender || ''}${gender && age ? ' ' : ''}${age || ''}**, `
  if (location) story += `cực kỳ phù hợp để bài trí tại **${location}**. `
  if (color) story += `Với tông màu **${color}** làm chủ đạo, không gian buổi tiệc sẽ trở nên lung linh và đầy cảm xúc. `
  if (price) story += `Mẫu thuộc phân khúc **${price}**, giúp bạn dễ dàng lựa chọn theo ngân sách cá nhân.`

  return story || product.description || "Hãy để LinDecor giúp bạn hiện thực hóa những ý tưởng tuyệt vời nhất cho buổi tiệc của mình."
}

const categoryIcons: any = {
  theme: { label: 'Chủ đề tiệc', icon: <Sparkles size={16}/>, color: 'text-purple-600' },
  color: { label: 'Tông màu', icon: <Palette size={16}/>, color: 'text-pink-600' },
  location: { label: 'Địa điểm', icon: <MapPin size={16}/>, color: 'text-blue-600' },
  priceRange: { label: 'Phân khúc giá', icon: <Tag size={16}/>, color: 'text-emerald-600' },
  ageRange: { label: 'Độ tuổi', icon: <Users size={16}/>, color: 'text-amber-600' },
  gender: { label: 'Đối tượng', icon: <Info size={16}/>, color: 'text-indigo-600' },
}

export default function DesignsClient({ initialProducts, initialFilters, settings }: any) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  const themes = useMemo(() => {
    return initialFilters.filter((f: any) => f.category === 'theme' && f.type === 'template')
  }, [initialFilters])

  const secondaryCategories = useMemo(() => {
    const currentFilters = initialFilters.filter((f: any) => f.type === 'template' && f.category !== 'theme')
    const uniqueCats = Array.from(new Set(currentFilters.map((f: any) => f.category)))
    return uniqueCats.map((catId: any) => {
      const config = categoryIcons[catId] || { label: catId, icon: <Layers size={16}/>, color: 'text-slate-600' }
      return {
        id: catId,
        ...config,
        options: initialFilters.filter((f: any) => f.category === catId && f.type === 'template')
      }
    })
  }, [initialFilters])

  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((p: any) => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             p.code?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilters = Object.entries(filterValues).every(([key, value]) => {
          if (!value) return true
          const pFilterData = JSON.parse(p.filterData || '{}')
          return pFilterData[key] === value
        })
        return matchesSearch && matchesFilters
      })
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [searchQuery, filterValues, initialProducts])

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 selection:bg-indigo-100">
      <Navbar settings={settings} />

      {/* HEADER PAGE */}
      <section className="pt-32 pb-12 px-6 bg-slate-900 text-white text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Mẫu Thiết Kế</h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base font-medium">Khám phá hàng trăm mẫu trang trí tiệc độc đáo, phù hợp cho mọi sự kiện từ sinh nhật, thôi nôi đến tiệc cưới.</p>
      </section>

      {/* PRIMARY THEME NAVIGATION */}
      <section className="bg-white py-4 border-b border-slate-100 sticky top-0 md:top-[88px] z-40">
        <div className="max-w-7xl mx-auto px-6 overflow-x-auto no-scrollbar flex flex-wrap justify-center items-center gap-x-6 gap-y-3">
          <button 
            onClick={() => setFilterValues(prev => ({ ...prev, theme: '' }))}
            className={`text-[12px] font-medium uppercase tracking-[0.2em] transition-all ${!filterValues.theme ? 'text-slate-900 border-b border-slate-900 pb-1' : 'text-slate-400 hover:text-slate-900'}`}
          >
            ALL
          </button>
          {themes.map((t: any) => (
            <button 
              key={t.id}
              onClick={() => setFilterValues(prev => ({ ...prev, theme: t.value }))}
              className={`text-[12px] font-medium tracking-[0.2em] uppercase whitespace-nowrap transition-all ${filterValues.theme === t.value ? 'text-slate-900 border-b border-slate-900 pb-1' : 'text-slate-400 hover:text-slate-900'}`}
            >
              {t.value}
            </button>
          ))}
          
          <div className="hidden lg:block h-3 w-px bg-slate-200 mx-1"></div>
          
          <button 
            onClick={() => setIsAdvancedFilterOpen(!isAdvancedFilterOpen)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-none border text-[9px] font-black uppercase tracking-widest transition-all ${isAdvancedFilterOpen ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
          >
            {isAdvancedFilterOpen ? <X size={12}/> : <Filter size={12}/>}
            {isAdvancedFilterOpen ? 'Đóng' : 'Lọc'}
          </button>
        </div>

        {/* ADVANCED FILTER DRAWER */}
        {isAdvancedFilterOpen && (
          <div className="max-w-4xl mx-auto px-6 pt-10 pb-6 animate-in slide-in-from-top-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {secondaryCategories.map(cat => (
                <div key={cat.id} className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <span className={cat.color}>{cat.icon}</span>
                    <span className="text-[12px] font-black uppercase tracking-widest text-slate-800">{cat.label}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => setFilterValues(prev => ({ ...prev, [cat.id]: '' }))}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${!filterValues[cat.id] ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                    >
                      Tất cả
                    </button>
                    {initialFilters.filter((f: any) => f.category === cat.id && f.type === 'template').map((f: any) => (
                      <button 
                        key={f.id}
                        onClick={() => setFilterValues(prev => ({ ...prev, [cat.id]: f.value }))}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${filterValues[cat.id] === f.value ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                      >
                        {f.value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-10 flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
              <Search size={16} className="text-slate-300" />
              <input 
                type="text" 
                placeholder="Tìm tên hoặc mã mẫu thiết kế..." 
                className="bg-transparent border-none outline-none text-xs font-bold w-full placeholder:text-slate-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-red-500">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      {/* GALLERY GRID */}
      <main className="max-w-[1400px] mx-auto px-6 py-20" id="collection">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p: any) => (
            <div 
              key={p.id} 
              onClick={() => setSelectedProduct(p)}
              className="group relative overflow-hidden bg-slate-100 transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] aspect-video rounded-3xl cursor-pointer"
            >
              <img 
                src={p.imageUrl || '/placeholder.png'} 
                alt={p.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 text-white">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  {p.code || 'LinDecor'}
                </span>
                <h3 className="text-xl font-light italic mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                  {p.name}
                </h3>
                <div className="flex gap-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-150">
                  <button onClick={(e) => { e.stopPropagation(); setSelectedProduct(p); }} className="p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white hover:text-slate-900 transition-all">
                    <Maximize2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <div className="py-40 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-slate-200">
              <Search size={32} />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-300 italic">Hiện chưa có mẫu nào phù hợp...</p>
          </div>
        )}
      </main>

      <Footer settings={settings} />

      {/* PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" onClick={() => setSelectedProduct(null)}></div>
          
          <div className="relative bg-white w-full max-w-6xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col md:flex-row max-h-[90vh]">
            <div className="md:w-2/3 bg-slate-50 relative group overflow-hidden">
              <img src={selectedProduct.imageUrl || '/placeholder.png'} className="w-full h-full object-cover" alt={selectedProduct.name} />
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 left-6 md:hidden w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-slate-900 shadow-xl"
              >
                <X size={20} />
              </button>
            </div>
            <div className="md:w-1/3 p-10 md:p-14 flex flex-col h-full overflow-y-auto custom-scrollbar space-y-8 bg-white">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">
                    #{selectedProduct.code || 'LinDecor'}
                  </span>
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="hidden md:flex w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-full items-center justify-center text-slate-400 transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>
                <h2 className="text-3xl font-light italic text-slate-800 leading-tight">
                  {selectedProduct.name}
                </h2>
              </div>
              <div className="h-px bg-slate-100 w-full"></div>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Giới thiệu về mẫu</h4>
                  <div 
                    className="text-sm text-slate-600 font-medium leading-relaxed italic prose prose-slate"
                    dangerouslySetInnerHTML={{ 
                      __html: generateProductStory(selectedProduct).replace(/\*\*(.*?)\*\*/g, '<strong class="text-indigo-600 font-black">$1</strong>') 
                    }}
                  />
                </div>
                {selectedProduct.description && (
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mô tả chi tiết</h4>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed italic">
                      {selectedProduct.description}
                    </p>
                  </div>
                )}
              </div>
              <div className="pt-8 mt-auto">
                <Link 
                  href={`https://zalo.me/${(settings.zalo || settings.phone || '').replace(/\D/g, '')}`}
                  target="_blank"
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-xl active:scale-95"
                >
                  <MessageCircle size={18} /> Nhận tư vấn mẫu này
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}