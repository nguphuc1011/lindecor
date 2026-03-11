
'use client'
import { useState, useMemo, useEffect } from 'react'
import {
  Sparkles, Palette, MapPin, Tag, Users, Info, 
  Search, Filter, X, LayoutGrid, ChevronRight, Menu, Zap,
  Maximize2, Share2, Image as ImageIcon, Heart, MessageSquare,
  Facebook, Instagram, Phone, Mail, Music2, MessageCircle, Layers
} from 'lucide-react'
import Link from 'next/link'

function getTagsFromProduct(item: any) {
  const tags: { label: string, color: string }[] = []
  
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
  if (item.price > 0) tags.push({ label: `${item.price.toLocaleString()}đ`, color: 'emerald', category: 'price' })

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

  if (theme) {
    story += `Đây là mẫu thiết kế mang chủ đề **${theme}** đầy ấn tượng. `
  } else {
    story += `Mẫu thiết kế độc đáo này được LinDecor chăm chút tỉ mỉ từng chi tiết. `
  }

  if (gender || age) {
    story += `Sản phẩm được sáng tạo dành riêng cho **${gender || ''}${gender && age ? ' ' : ''}${age || ''}**, `
  }

  if (location) {
    story += `cực kỳ phù hợp để bài trí tại **${location}**. `
  }

  if (color) {
    story += `Với tông màu **${color}** làm chủ đạo, không gian buổi tiệc sẽ trở nên lung linh và đầy cảm xúc. `
  }

  if (price) {
    story += `Mẫu thuộc phân khúc **${price}**, giúp bạn dễ dàng lựa chọn theo ngân sách cá nhân.`
  }

  return story || product.description || "Hãy để LinDecor giúp bạn hiện thực hóa những ý tưởng tuyệt vời nhất cho buổi tiệc của mình."
}

export default function ClientHome({ initialProducts, initialFilters, settings, banners, services, processSteps, testimonials }: any) {
  const [activeTab, setActiveTab] = useState<'template' | 'retail'>('template')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  // Tự động chuyển slide banner
  useEffect(() => {
    if (banners && banners.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length)
      }, 6000)
      return () => clearInterval(timer)
    }
  }, [banners])

  // Xử lý hiệu ứng cuộn cho Header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Tách riêng Theme để làm Navigation chính
  const themes = useMemo(() => {
    return initialFilters.filter((f: any) => f.category === 'theme' && f.type === activeTab)
  }, [activeTab, initialFilters])

  const categoryIcons: any = {
    theme: { label: 'Chủ đề tiệc', icon: <Sparkles size={16}/>, color: 'text-purple-600' },
    color: { label: 'Tông màu', icon: <Palette size={16}/>, color: 'text-pink-600' },
    location: { label: 'Địa điểm', icon: <MapPin size={16}/>, color: 'text-blue-600' },
    priceRange: { label: 'Phân khúc giá', icon: <Tag size={16}/>, color: 'text-emerald-600' },
    ageRange: { label: 'Độ tuổi', icon: <Users size={16}/>, color: 'text-amber-600' },
    gender: { label: 'Đối tượng', icon: <Info size={16}/>, color: 'text-indigo-600' },
  }

  // Các bộ lọc phụ khác (Tự động lấy từ dữ liệu thực tế)
  const secondaryCategories = useMemo(() => {
    // Lấy tất cả các category có trong initialFilters cho activeTab (ngoại trừ theme vì đã làm menu chính)
    const currentFilters = initialFilters.filter((f: any) => f.type === activeTab && f.category !== 'theme')
    const uniqueCats = Array.from(new Set(currentFilters.map((f: any) => f.category)))
    
    return uniqueCats.map((catId: any) => {
      const config = categoryIcons[catId] || { 
        label: catId, 
        icon: <Layers size={16}/>, 
        color: 'text-slate-600' 
      }
      return {
        id: catId,
        ...config,
        options: initialFilters.filter((f: any) => f.category === catId && f.type === activeTab)
      }
    })
  }, [activeTab, initialFilters])

  // Lọc sản phẩm
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((p: any) => p.type === activeTab)
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
      .sort((a: any, b: any) => {
        // Ưu tiên hiển thị sản phẩm mới nhất
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
  }, [activeTab, searchQuery, filterValues, initialProducts])

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100 scroll-smooth">
      
      {/* MINIMAL NAVIGATION */}
      <nav className={`fixed top-0 left-0 right-0 z-50 px-8 py-6 transition-all duration-500 ${isScrolled ? 'bg-white/90 backdrop-blur-[20px] border-b border-slate-100' : 'bg-transparent'}`}>
        <div className="max-w-[1400px] mx-auto flex justify-between items-center gap-10">
          {/* LEFT: LOGO */}
          <div className="flex shrink-0">
            <Link href="/" className="flex items-center gap-4 group">
              {settings.logo ? (
                <img src={settings.logo} alt="LinDecor Logo" className={`h-20 w-auto object-contain transition-all duration-500 group-hover:scale-105 ${!isScrolled ? 'brightness-0 invert' : ''}`} />
              ) : (
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-500 group-hover:rotate-12 ${isScrolled ? 'bg-slate-900' : 'bg-white/20 backdrop-blur-md border border-white/30'}`}>
                    <Zap size={20} fill="white" />
                  </div>
                  <div className="flex flex-col">
                    <h1 className={`text-lg font-black uppercase tracking-tighter leading-none transition-colors ${isScrolled ? 'text-slate-900' : 'text-white'}`}>LinDecor.</h1>
                    <span className={`text-[7px] font-bold uppercase tracking-[0.4em] mt-1 transition-colors ${isScrolled ? 'text-slate-400' : 'text-white/50'}`}>Specialists</span>
                  </div>
                </div>
              )}
            </Link>
          </div>

          {/* RIGHT: MENU & ADMIN */}
          <div className="flex items-center gap-10">
            {/* TABS */}
            <div className={`hidden md:flex items-center gap-8 text-[14px] font-bold uppercase tracking-[0.1em] transition-colors ${isScrolled ? 'text-slate-500' : 'text-white/90'}`}>
              <button onClick={() => { setActiveTab('template'); setFilterValues({}); }} className={`transition-all hover:text-indigo-600 ${activeTab === 'template' ? (isScrolled ? 'text-indigo-600' : 'text-white') : ''}`}>Mẫu Decor</button>
              <button onClick={() => { setActiveTab('retail'); setFilterValues({}); }} className={`transition-all hover:text-indigo-600 ${activeTab === 'retail' ? (isScrolled ? 'text-indigo-600' : 'text-white') : ''}`}>Ấn phẩm Shop</button>
            </div>

            <div className={`hidden md:block h-4 w-px ${isScrolled ? 'bg-slate-200' : 'bg-white/30'}`}></div>

            <Link href="/admin" className={`hidden md:flex text-[14px] font-bold uppercase tracking-[0.1em] transition-colors items-center gap-2 ${isScrolled ? 'text-slate-900 hover:text-indigo-600' : 'text-white hover:text-white/80'}`}>
              Quản trị <ChevronRight size={14} />
            </Link>
            
            <button className={`md:hidden transition-colors ${isScrolled ? 'text-slate-800' : 'text-white'}`} onClick={() => setIsAdvancedFilterOpen(!isAdvancedFilterOpen)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* HERO BANNER SLIDER */}
      <section className="relative h-[60vh] min-h-[450px] w-full overflow-hidden bg-black">
        {banners && banners.length > 0 ? (
          banners.map((banner: any, index: number) => (
            <div 
              key={banner.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out flex items-center ${index === currentSlide ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
            >
              {/* Background with Vignette */}
              <div className="absolute inset-0 z-0">
                <img src={banner.imageUrl} className="w-full h-full object-cover opacity-80" alt={banner.title} />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 hidden lg:block"></div>
                <div className="absolute inset-0 bg-black/60"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
                <div className={`max-w-2xl space-y-6 text-white transition-all duration-700 delay-300 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                  {banner.title && (
                    <h2 className="text-4xl md:text-5xl font-light leading-tight italic tracking-tight">
                      {banner.title}
                    </h2>
                  )}
                  {banner.description && (
                    <p className="text-sm md:text-base font-medium text-white/70 leading-relaxed italic">
                      {banner.description}
                    </p>
                  )}
                  <div className="pt-4">
                    <Link 
                      href={banner.buttonLink || "/"} 
                      className="inline-block bg-white text-slate-900 px-10 py-4 rounded-none font-black uppercase tracking-[0.2em] text-[10px] hover:bg-indigo-600 hover:text-white transition-all shadow-2xl"
                    >
                      {banner.buttonText || "Xem chi tiết"}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          /* Placeholder if no banners */
          <div className="absolute inset-0 flex items-center justify-center text-white/20">
            <div className="text-center space-y-4">
              <ImageIcon size={64} className="mx-auto opacity-20" />
              <p className="text-xs font-black uppercase tracking-widest">Chưa có Slide Banner</p>
            </div>
          </div>
        )}

        {/* Slider Navigation Dots */}
        {banners && banners.length > 1 && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
            {banners.map((_: any, idx: number) => (
              <button 
                key={idx} 
                onClick={() => setCurrentSlide(idx)}
                className={`h-1 transition-all duration-500 ${idx === currentSlide ? 'w-12 bg-white' : 'w-4 bg-white/30 hover:bg-white/50'}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* ARTISTIC HEADER */}
      <header className="pt-24 pb-12 px-6 text-center max-w-5xl mx-auto space-y-4">
        <div className="inline-block bg-[#D97706] text-white px-4 py-1 text-[10px] font-black uppercase tracking-widest mb-2">
          BỘ SƯU TẬP
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-medium uppercase tracking-[0.2em] text-[#4A5D4E] leading-tight">
            {activeTab === 'template' ? 'Các mẫu trang trí tiệc nhà hàng' : 'Các sản phẩm trang trí nghệ thuật'}
          </h2>
          <div className="w-12 h-0.5 bg-[#D97706] mx-auto opacity-50"></div>
        </div>
        <p className="max-w-2xl mx-auto text-slate-500 font-medium text-xs md:text-sm leading-relaxed italic">
          Hàng trăm mẫu thiết kế đa dạng và nhiều chủ đề, màu sắc. <br className="hidden md:block"/> Được phân loại theo các phong cách nghệ thuật khác nhau.
        </p>
      </header>

      {/* PRIMARY THEME NAVIGATION */}
      <section className="bg-white py-4 border-y border-slate-50">
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
                    {initialFilters.filter((f: any) => f.category === cat.id && f.type === activeTab).map((f: any) => (
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

      {/* GALLERY GRID (OVERLAY STYLE) */}
      <main className="max-w-[1400px] mx-auto px-6 py-20" id="collection">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p: any, idx: number) => (
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
                  <button onClick={(e) => { e.stopPropagation(); /* Logic share */ }} className="p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white hover:text-slate-900 transition-all">
                    <Share2 size={18} />
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

      {/* SERVICES SECTION */}
      {services && services.length > 0 && (
        <section className="py-32 px-8 bg-white">
          <div className="max-w-7xl mx-auto space-y-20">
            <div className="text-center space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Our Expertise</span>
              <h2 className="text-4xl font-light italic text-slate-800">Dịch vụ của chúng tôi</h2>
              <div className="w-12 h-0.5 bg-indigo-600 mx-auto opacity-30"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {services.map((s: any) => (
                <div key={s.id} className="group flex flex-col items-center text-center space-y-8">
                  <div className="w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-lg relative">
                    {s.imageUrl ? (
                      <img src={s.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={s.title} />
                    ) : (
                      <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-200">
                        <Heart size={64} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-indigo-600/10 group-hover:bg-transparent transition-colors duration-500"></div>
                  </div>
                  <div className="space-y-4 px-4">
                    <h3 className="font-black uppercase tracking-[0.2em] text-sm text-slate-800">{s.title}</h3>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed italic">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PROCESS SECTION */}
      {processSteps && processSteps.length > 0 && (
        <section className="py-32 px-8 bg-[#0f172a] text-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-pink-600/10 rounded-full blur-[100px]"></div>
          
          <div className="max-w-7xl mx-auto relative z-10 space-y-20">
            <div className="text-center space-y-6">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Execution Flow</span>
              <h2 className="text-4xl md:text-5xl font-light italic leading-tight">Quy trình làm việc chuyên nghiệp</h2>
              <div className="w-20 h-px bg-indigo-500 mx-auto opacity-30"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-y-16">
              {processSteps.map((step: any, idx: number) => (
                <div key={step.id} className="relative p-10 rounded-[3rem] bg-white/5 border border-white/10 group hover:bg-white/10 hover:border-white/20 transition-all duration-500">
                  <span className="absolute -top-6 -left-4 text-7xl font-black italic text-indigo-500/20 group-hover:text-indigo-500/40 transition-all duration-700 select-none">0{idx + 1}</span>
                  <div className="relative z-10 space-y-4">
                    <h3 className="font-black uppercase tracking-[0.2em] text-[12px] text-white pt-4">{step.title}</h3>
                    <p className="text-xs text-white/40 font-medium leading-relaxed italic">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS SECTION */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-32 px-8 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-4 mb-20">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Testimonials</span>
              <h2 className="text-4xl font-light italic text-slate-800">Cảm nhận từ khách hàng</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {testimonials.map((t: any) => (
                <div key={t.id} className="p-10 rounded-[3rem] bg-slate-50 border border-slate-100 space-y-8 relative group hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                  <div className="absolute top-10 right-10 text-indigo-100 group-hover:text-indigo-500 transition-colors">
                    <MessageSquare size={40} />
                  </div>
                  <p className="text-slate-500 font-medium italic leading-relaxed relative z-10">
                    "{t.content}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-black italic uppercase">
                      {t.clientName[0]}
                    </div>
                    <div>
                      <h4 className="font-black uppercase tracking-widest text-[10px] text-slate-800">{t.clientName}</h4>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-500">{t.eventType}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FOOTER SECTION */}
      <footer className="bg-slate-900 pt-24 pb-12 px-8 text-white border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="space-y-8">
            <Link href="/" className="flex flex-col gap-2">
              <h2 className="text-2xl font-black uppercase tracking-tighter italic">LinDecor.</h2>
              <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-white/40">Specialists</span>
            </Link>
            <p className="text-white/40 text-xs font-medium leading-relaxed italic">
              Nơi biến những giấc mơ về buổi tiệc hoàn mỹ thành hiện thực với sự tận tâm và gu thẩm mỹ khác biệt.
            </p>
            <div className="flex gap-4">
              <Link href={settings.facebook || "#"} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-all"><Facebook size={18}/></Link>
              <Link href={settings.instagram || "#"} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-all"><Instagram size={18}/></Link>
              <Link href={settings.tiktok || "#"} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-all"><Music2 size={18}/></Link>
              {settings.zalo && (
                <Link href={`https://zalo.me/${settings.zalo}`} target="_blank" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-blue-500 transition-all">
                  <MessageCircle size={18}/>
                </Link>
              )}
            </div>
          </div>
          
          <div className="space-y-8">
            <h4 className="font-black uppercase tracking-widest text-[10px]">Liên hệ</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40 group-hover:bg-indigo-600 group-hover:text-white transition-all"><Phone size={16}/></div>
                <span className="text-xs font-medium text-white/60">{settings.phone || '09xx xxx xxx'}</span>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40 group-hover:bg-indigo-600 group-hover:text-white transition-all"><Mail size={16}/></div>
                <span className="text-xs font-medium text-white/60">{settings.email || 'contact@lindecor.vn'}</span>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40 group-hover:bg-indigo-600 group-hover:text-white transition-all"><MapPin size={16}/></div>
                <span className="text-xs font-medium text-white/60">{settings.address || 'Hồ Chí Minh, Việt Nam'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="font-black uppercase tracking-widest text-[10px]">Danh mục</h4>
            <div className="flex flex-col gap-3">
              <button onClick={() => setActiveTab('template')} className="text-xs font-medium text-white/40 hover:text-white text-left transition-all">Mẫu Trang Trí Tiệc</button>
              <button onClick={() => setActiveTab('retail')} className="text-xs font-medium text-white/40 hover:text-white text-left transition-all">Sản Phẩm Ấn Phẩm</button>
              <Link href="/admin" className="text-xs font-medium text-white/40 hover:text-white transition-all">Hệ thống Quản trị</Link>
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="font-black uppercase tracking-widest text-[10px]">Đăng ký tư vấn</h4>
            <p className="text-white/40 text-[10px] font-medium uppercase tracking-widest">Nhận thông tin ưu đãi mới nhất</p>
            <div className="relative">
              <input type="email" placeholder="Email của bạn" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-xs outline-none focus:border-indigo-600 transition-all" />
              <button className="absolute right-2 top-2 bottom-2 bg-white text-slate-900 px-4 rounded-lg font-black uppercase text-[9px] hover:bg-indigo-600 hover:text-white transition-all">Gửi</button>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">© 2024 LINDECOR. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <Link href="#" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-all">Privacy Policy</Link>
            <Link href="#" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-all">Terms of Service</Link>
          </div>
        </div>
      </footer>

      {/* PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" onClick={() => setSelectedProduct(null)}></div>
          
          <div className="relative bg-white w-full max-w-6xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col md:flex-row max-h-[90vh]">
            {/* Image Section */}
            <div className="md:w-2/3 bg-slate-50 relative group overflow-hidden">
              <img src={selectedProduct.imageUrl || '/placeholder.png'} className="w-full h-full object-cover" alt={selectedProduct.name} />
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 left-6 md:hidden w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-slate-900 shadow-xl"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Section */}
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
                {selectedProduct.price > 0 && (
                  <div className="text-2xl font-black text-indigo-600 tracking-tighter">
                    {selectedProduct.price.toLocaleString()}đ
                  </div>
                )}
              </div>

              <div className="h-px bg-slate-100 w-full"></div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Giới thiệu về mẫu</h4>
                  <div 
                    className="text-sm text-slate-600 font-medium leading-relaxed italic prose prose-slate"
                    dangerouslySetInnerHTML={{ 
                      __html: generateProductStory(selectedProduct)
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-indigo-600 font-black">$1</strong>') 
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
                  href={`https://zalo.me/${settings.zalo || settings.phone || ''}`}
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
