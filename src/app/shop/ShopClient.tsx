'use client'
import { useState, useEffect } from 'react'
import { Search, ShoppingBag, ArrowRight, Home, Zap, Phone, Package } from 'lucide-react'
import Link from 'next/link'

export default function ShopClient({ initialProducts, settings, categories }: any) {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)

  // Xử lý hiệu ứng cuộn cho Header
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const filteredProducts = initialProducts.filter((p: any) => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 selection:bg-indigo-100">
      
      {/* HEADER */}
      <nav className={`fixed top-0 left-0 right-0 z-50 px-8 py-4 transition-all duration-500 ${isScrolled ? 'bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            {settings.logo ? (
              <img src={settings.logo} alt="LinDecor" className={`h-12 w-auto object-contain transition-all ${!isScrolled ? 'brightness-0 invert' : ''}`} />
            ) : (
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isScrolled ? 'bg-slate-900 text-white' : 'bg-white/20 text-white backdrop-blur-md'}`}>
                <Zap size={20} />
              </div>
            )}
            <span className={`font-black uppercase tracking-tighter text-lg hidden md:block ${isScrolled ? 'text-slate-900' : 'text-white'}`}>LinDecor</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/" className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${isScrolled ? 'text-slate-500 hover:text-indigo-600' : 'text-white/80 hover:text-white'}`}>
              <Home size={14} /> Về trang chủ
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200 backdrop-blur-md">
            <ShoppingBag size={14} /> Ấn phẩm & Phụ kiện
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-none">
            Cửa hàng <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">LinDecor</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base font-medium leading-relaxed">
            Khám phá bộ sưu tập phụ kiện, thiệp mời và quà tặng độc đáo. Giúp sự kiện của bạn trở nên hoàn hảo đến từng chi tiết nhỏ nhất.
          </p>

          {/* SEARCH BAR */}
          <div className="max-w-xl mx-auto pt-8">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Tìm kiếm sản phẩm..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-6 py-5 bg-white/10 border border-white/20 rounded-[2rem] text-white placeholder:text-slate-400 outline-none focus:bg-white/20 focus:border-indigo-400/50 backdrop-blur-md transition-all font-medium"
              />
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="max-w-[1400px] mx-auto px-6 py-12 flex flex-col md:flex-row gap-10">
        
        {/* SIDEBAR CATEGORIES */}
        <aside className="w-full md:w-64 shrink-0 space-y-8">
          <div className="sticky top-32 space-y-6">
            <h3 className="font-black uppercase tracking-widest text-xs text-slate-400 ml-4">Danh mục sản phẩm</h3>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setActiveCategory('all')}
                className={`flex items-center justify-between px-6 py-4 rounded-2xl font-bold text-[11px] uppercase tracking-wider transition-all ${activeCategory === 'all' ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
              >
                <span>Tất cả sản phẩm</span>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] ${activeCategory === 'all' ? 'bg-white/20' : 'bg-slate-100'}`}>
                  {initialProducts.length}
                </span>
              </button>
              
              {categories.map((cat: any) => {
                const count = initialProducts.filter((p: any) => p.category === cat.name).length
                const isActive = activeCategory === cat.name
                return (
                  <button 
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`flex items-center justify-between px-6 py-4 rounded-2xl font-bold text-[11px] uppercase tracking-wider transition-all ${isActive ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                  >
                    <span>{cat.name}</span>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] ${isActive ? 'bg-white/20' : 'bg-slate-100'}`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-[2rem] border border-indigo-100/50 space-y-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                <Phone size={18} />
              </div>
              <h4 className="font-black text-slate-800 uppercase tracking-tight text-sm">Cần tư vấn riêng?</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">Chúng tôi luôn sẵn sàng hỗ trợ bạn tìm kiếm sản phẩm phù hợp nhất.</p>
              <a 
                href={`https://zalo.me/${(settings.zalo || settings.phone || '').replace(/\D/g, '')}`} 
                target="_blank"
                className="inline-flex items-center justify-center w-full bg-indigo-600 text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-indigo-200 gap-2"
              >
                Chat Zalo ngay
              </a>
            </div>
          </div>
        </aside>

        {/* PRODUCT GRID */}
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p: any) => (
                <div key={p.id} className="group bg-white rounded-[2rem] p-4 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col">
                  {/* Image */}
                  <div className="relative aspect-[4/5] rounded-[1.5rem] overflow-hidden bg-slate-50 mb-4">
                    <img src={p.imageUrl || '/placeholder.png'} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest backdrop-blur-md border ${p.stock ? 'bg-emerald-500/90 text-white border-emerald-400' : 'bg-red-500/90 text-white border-red-400'}`}>
                        {p.stock ? 'Còn hàng' : 'Hết hàng'}
                      </span>
                    </div>
                    {p.category && (
                      <div className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md text-slate-900 text-[9px] font-black uppercase tracking-widest shadow-sm">
                        {p.category}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col px-2">
                    <h3 className="font-black uppercase tracking-tight text-sm text-slate-800 line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">{p.name}</h3>
                    <p className="text-xs text-slate-400 font-medium line-clamp-2 mb-4 flex-1 leading-relaxed">
                      {p.description || 'Sản phẩm trang trí chất lượng cao từ LinDecor.'}
                    </p>
                    
                    <div className="flex items-end justify-between mt-auto pt-4 border-t border-slate-50">
                      <div className="space-y-1">
                        <span className="block text-[9px] font-black uppercase tracking-widest text-slate-400">Giá bán</span>
                        <span className="block text-lg font-black text-indigo-600">{p.price > 0 ? `${p.price.toLocaleString()}đ` : 'Liên hệ'}</span>
                      </div>
                      <a
                        href={`https://zalo.me/${(settings.zalo || settings.phone || '').replace(/\D/g, '')}`}
                        target="_blank"
                        className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-indigo-600 transition-all shadow-md hover:shadow-xl hover:-rotate-12"
                        title="Tư vấn mua hàng"
                      >
                        <ArrowRight size={18} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-32 bg-white rounded-[3rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center px-6">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                <Package size={32} />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight text-slate-700 mb-2">Không tìm thấy sản phẩm</h3>
              <p className="text-sm text-slate-400 font-medium max-w-md">Chúng tôi không tìm thấy ấn phẩm nào phù hợp với tìm kiếm của bạn. Vui lòng thử lại với từ khóa khác.</p>
              <button 
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-600 transition-all shadow-lg"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>
      </section>

    </div>
  )
}