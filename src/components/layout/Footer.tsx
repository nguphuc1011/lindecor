import Link from 'next/link'
import { Facebook, Instagram, Music2, MessageCircle, Phone, Mail, MapPin } from 'lucide-react'

export default function Footer({ settings }: { settings: any }) {
  return (
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
            <Link href={settings?.facebook || "#"} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-all"><Facebook size={18}/></Link>
            <Link href={settings?.instagram || "#"} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-all"><Instagram size={18}/></Link>
            <Link href={settings?.tiktok || "#"} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-all"><Music2 size={18}/></Link>
            {settings?.zalo && (
              <Link href={`https://zalo.me/${(settings.zalo || settings.phone || '').replace(/\D/g, '')}`} target="_blank" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-blue-500 transition-all">
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
              <span className="text-xs font-medium text-white/60">{settings?.phone || '09xx xxx xxx'}</span>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40 group-hover:bg-indigo-600 group-hover:text-white transition-all"><Mail size={16}/></div>
              <span className="text-xs font-medium text-white/60">{settings?.email || 'contact@lindecor.vn'}</span>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40 group-hover:bg-indigo-600 group-hover:text-white transition-all"><MapPin size={16}/></div>
              <span className="text-xs font-medium text-white/60">{settings?.address || 'Hồ Chí Minh, Việt Nam'}</span>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <h4 className="font-black uppercase tracking-widest text-[10px]">Danh mục</h4>
          <div className="flex flex-col gap-3">
            <Link href="/designs" className="text-xs font-medium text-white/40 hover:text-white text-left transition-all">Mẫu Trang Trí Tiệc</Link>
            <Link href="/shop" className="text-xs font-medium text-white/40 hover:text-white text-left transition-all">Sản Phẩm Ấn Phẩm</Link>
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
  )
}