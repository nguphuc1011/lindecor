'use client'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { MapPin, Phone, Mail, Clock, Send, Facebook, Instagram, Music2, MessageCircle } from 'lucide-react'

export default function ContactClient({ settings }: { settings: any }) {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      <Navbar settings={settings} />

      {/* HEADER SECTION */}
      <section className="pt-40 pb-20 px-6 bg-slate-900 text-white text-center space-y-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
        <div className="max-w-3xl mx-auto relative z-10 space-y-6">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Liên Hệ</h1>
          <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed">
            Hãy để LinDecor đồng hành cùng bạn tạo nên những khoảnh khắc đáng nhớ. Liên hệ với chúng tôi để được tư vấn chi tiết về dịch vụ trang trí và ấn phẩm sự kiện.
          </p>
        </div>
      </section>

      {/* CONTACT INFO & FORM */}
      <section className="max-w-7xl mx-auto px-6 py-20 -mt-10 relative z-20">
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col lg:flex-row">
          
          {/* INFO SIDE */}
          <div className="lg:w-2/5 bg-indigo-600 p-12 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-[80px]"></div>
            
            <div className="relative z-10 space-y-12">
              <div className="space-y-4">
                <h3 className="text-3xl font-light italic">Thông tin liên hệ</h3>
                <p className="text-indigo-200 font-medium">Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7</p>
              </div>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-1">Điện thoại</h4>
                    <p className="font-medium">{settings?.phone || '09xx xxx xxx'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-1">Email</h4>
                    <p className="font-medium">{settings?.email || 'contact@lindecor.vn'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-1">Địa chỉ</h4>
                    <p className="font-medium leading-relaxed">{settings?.address || 'Hồ Chí Minh, Việt Nam'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-1">Giờ làm việc</h4>
                    <p className="font-medium">Thứ 2 - Chủ Nhật: 08:00 - 20:00</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-12 mt-12 border-t border-white/20 flex gap-4">
              <a href={settings?.facebook || "#"} target="_blank" className="w-12 h-12 bg-white/10 hover:bg-white hover:text-indigo-600 rounded-full flex items-center justify-center transition-all"><Facebook size={20}/></a>
              <a href={settings?.instagram || "#"} target="_blank" className="w-12 h-12 bg-white/10 hover:bg-white hover:text-indigo-600 rounded-full flex items-center justify-center transition-all"><Instagram size={20}/></a>
              <a href={settings?.tiktok || "#"} target="_blank" className="w-12 h-12 bg-white/10 hover:bg-white hover:text-indigo-600 rounded-full flex items-center justify-center transition-all"><Music2 size={20}/></a>
              {settings?.zalo && (
                <a href={`https://zalo.me/${(settings.zalo || settings.phone || '').replace(/\D/g, '')}`} target="_blank" className="w-12 h-12 bg-white/10 hover:bg-white hover:text-indigo-600 rounded-full flex items-center justify-center transition-all">
                  <MessageCircle size={20}/>
                </a>
              )}
            </div>
          </div>

          {/* FORM SIDE */}
          <div className="lg:w-3/5 p-12 md:p-16">
            <div className="max-w-lg">
              <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-800 mb-2">Gửi tin nhắn</h3>
              <p className="text-slate-500 mb-10 font-medium">Để lại thông tin, chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất.</p>
              
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất!'); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Họ và tên</label>
                    <input type="text" required className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all" placeholder="Nguyễn Văn A" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Số điện thoại</label>
                    <input type="tel" required className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all" placeholder="09xx xxx xxx" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loại dịch vụ quan tâm</label>
                  <select className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer">
                    <option value="">Chọn dịch vụ</option>
                    <option value="template">Trang trí tiệc (Mẫu Decor)</option>
                    <option value="retail">Mua Ấn phẩm / Phụ kiện</option>
                    <option value="other">Tư vấn khác</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nội dung tin nhắn</label>
                  <textarea rows={4} required className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none" placeholder="Nhập nội dung cần tư vấn..."></textarea>
                </div>

                <button type="submit" className="bg-slate-900 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 w-full hover:bg-indigo-600 transition-all shadow-xl active:scale-95">
                  <Send size={18} /> Gửi yêu cầu
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>

      <Footer settings={settings} />
    </div>
  )
}