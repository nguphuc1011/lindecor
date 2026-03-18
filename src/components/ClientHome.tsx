'use client'
import { useState, useEffect } from 'react'
import {
  Maximize2, Share2, Image as ImageIcon, Heart, MessageSquare, ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

function generateProductStory(product: any) {
  let story = "Mẫu thiết kế độc đáo này được LinDecor chăm chút tỉ mỉ từng chi tiết. "
  return product.description || story
}

export default function ClientHome({ initialProducts, initialFilters, settings, banners, services, processSteps, testimonials }: any) {
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

  // Lấy top sản phẩm mới nhất cho trang chủ
  const topTemplates = initialProducts
    .filter((p: any) => p.type === 'template')
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6)

  const topRetail = initialProducts
    .filter((p: any) => p.type === 'retail')
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8)

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100 scroll-smooth">
      <Navbar settings={settings} />

      {/* HERO BANNER SLIDER */}
      <section className="relative h-[80vh] min-h-[500px] w-full overflow-hidden bg-black">
        {banners && banners.length > 0 ? (
          banners.map((banner: any, index: number) => (
            <div 
              key={banner.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out flex items-center ${index === currentSlide ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
            >
              <div className="absolute inset-0 z-0">
                <img src={banner.imageUrl} className="w-full h-full object-cover opacity-80" alt={banner.title} />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 hidden lg:block"></div>
                <div className="absolute inset-0 bg-black/60"></div>
              </div>

              <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
                <div className={`max-w-2xl space-y-6 text-white transition-all duration-700 delay-300 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                  {banner.title && (
                    <h2 className="text-4xl md:text-6xl font-light leading-tight italic tracking-tight">
                      {banner.title}
                    </h2>
                  )}
                  {banner.description && (
                    <p className="text-sm md:text-lg font-medium text-white/70 leading-relaxed italic">
                      {banner.description}
                    </p>
                  )}
                  <div className="pt-6">
                    <Link 
                      href={banner.buttonLink || "/designs"} 
                      className="inline-block bg-white text-slate-900 px-10 py-4 rounded-none font-black uppercase tracking-[0.2em] text-[10px] md:text-xs hover:bg-indigo-600 hover:text-white transition-all shadow-2xl"
                    >
                      {banner.buttonText || "Khám phá ngay"}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/20">
            <div className="text-center space-y-4">
              <ImageIcon size={64} className="mx-auto opacity-20" />
              <p className="text-xs font-black uppercase tracking-widest">Chưa có Slide Banner</p>
            </div>
          </div>
        )}

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

      {/* DESIGNS SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-block bg-[#D97706] text-white px-4 py-1 text-[10px] font-black uppercase tracking-widest mb-2">
              BỘ SƯU TẬP
            </div>
            <h2 className="text-3xl md:text-4xl font-medium uppercase tracking-[0.2em] text-[#4A5D4E] leading-tight">
              Mẫu Trang Trí Tiệc
            </h2>
            <div className="w-12 h-0.5 bg-[#D97706] mx-auto opacity-50"></div>
            <p className="text-slate-500 font-medium text-sm leading-relaxed italic max-w-2xl mx-auto">
              Những ý tưởng thiết kế độc bản, biến không gian sự kiện của bạn thành một tác phẩm nghệ thuật.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topTemplates.map((p: any) => (
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
                    <button className="p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white hover:text-slate-900 transition-all">
                      <Maximize2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/designs" className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-200">
              Xem tất cả mẫu <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* SHOP SECTION */}
      <section className="py-24 bg-[#f8fafc] border-y border-slate-100">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">
                Cửa hàng
              </span>
              <h2 className="text-3xl md:text-4xl font-medium uppercase tracking-[0.2em] text-slate-800 leading-tight">
                Ấn Phẩm & Phụ Kiện
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed italic max-w-xl">
                Những chi tiết nhỏ tạo nên sự khác biệt lớn. Chọn ngay phụ kiện hoàn hảo cho sự kiện của bạn.
              </p>
            </div>
            <Link href="/shop" className="shrink-0 flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-[10px] hover:text-indigo-800 transition-colors">
              Đến cửa hàng <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {topRetail.map((p: any) => (
              <Link href="/shop" key={p.id} className="group bg-white rounded-[2rem] p-4 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col">
                <div className="relative aspect-[4/5] rounded-[1.5rem] overflow-hidden bg-slate-50 mb-4">
                  <img src={p.imageUrl || '/placeholder.png'} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest backdrop-blur-md border ${p.stock ? 'bg-emerald-500/90 text-white border-emerald-400' : 'bg-red-500/90 text-white border-red-400'}`}>
                      {p.stock ? 'Còn hàng' : 'Hết hàng'}
                    </span>
                  </div>
                </div>
                <div className="flex-1 flex flex-col px-2">
                  <h3 className="font-black uppercase tracking-tight text-sm text-slate-800 line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">{p.name}</h3>
                  <div className="mt-auto pt-4 border-t border-slate-50">
                    <span className="block text-lg font-black text-indigo-600">{p.price > 0 ? `${p.price.toLocaleString()}đ` : 'Liên hệ'}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
                {/* Close Icon (X) can be added here or imported */}
                <span className="font-bold">X</span>
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
                    className="hidden md:flex w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-full items-center justify-center text-slate-400 transition-all font-bold"
                  >
                    X
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
                    }}
                  />
                </div>
              </div>

              <div className="pt-8 mt-auto">
                <Link 
                  href={`https://zalo.me/${(settings.zalo || settings.phone || '').replace(/\D/g, '')}`}
                  target="_blank"
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-xl active:scale-95"
                >
                  <MessageSquare size={18} /> Nhận tư vấn mẫu này
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}