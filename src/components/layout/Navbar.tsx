'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Zap, ChevronRight, Menu } from 'lucide-react'

export default function Navbar({ settings }: { settings: any }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 px-8 py-6 transition-all duration-500 ${isScrolled ? 'bg-white/90 backdrop-blur-[20px] border-b border-slate-100' : 'bg-transparent'}`}>
      <div className="max-w-[1400px] mx-auto flex justify-between items-center gap-10">
        {/* LEFT: LOGO */}
        <div className="flex shrink-0">
          <Link href="/" className="flex items-center gap-4 group">
            {settings?.logo ? (
              <img src={settings.logo} alt="LinDecor Logo" className={`h-16 md:h-20 w-auto object-contain transition-all duration-500 group-hover:scale-105 ${!isScrolled ? 'brightness-0 invert' : ''}`} />
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
        <div className="flex items-center gap-8">
          {/* TABS */}
          <div className={`hidden md:flex items-center gap-8 text-[14px] font-bold uppercase tracking-[0.1em] transition-colors ${isScrolled ? 'text-slate-500' : 'text-white/90'}`}>
            <Link href="/" className="transition-all hover:text-indigo-600">Trang chủ</Link>
            <Link href="/designs" className="transition-all hover:text-indigo-600">Mẫu Decor</Link>
            <Link href="/shop" className="transition-all hover:text-indigo-600">Ấn phẩm Shop</Link>
            <Link href="/contact" className="transition-all hover:text-indigo-600">Liên hệ</Link>
          </div>

          <div className={`hidden md:block h-4 w-px ${isScrolled ? 'bg-slate-200' : 'bg-white/30'}`}></div>

          <Link href="/admin" className={`hidden md:flex text-[14px] font-bold uppercase tracking-[0.1em] transition-colors items-center gap-2 ${isScrolled ? 'text-slate-900 hover:text-indigo-600' : 'text-white hover:text-white/80'}`}>
            Quản trị <ChevronRight size={14} />
          </Link>
          
          <button className={`md:hidden transition-colors ${isScrolled ? 'text-slate-800' : 'text-white'}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-xl py-4 px-8 flex flex-col gap-4 text-sm font-bold uppercase tracking-widest text-slate-700">
          <Link href="/" onClick={() => setIsMenuOpen(false)} className="py-2 hover:text-indigo-600">Trang chủ</Link>
          <Link href="/designs" onClick={() => setIsMenuOpen(false)} className="py-2 hover:text-indigo-600">Mẫu Decor</Link>
          <Link href="/shop" onClick={() => setIsMenuOpen(false)} className="py-2 hover:text-indigo-600">Ấn phẩm Shop</Link>
          <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="py-2 hover:text-indigo-600">Liên hệ</Link>
          <div className="h-px bg-slate-100 my-2"></div>
          <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="py-2 text-indigo-600 flex items-center gap-2">
            Quản trị hệ thống <ChevronRight size={14} />
          </Link>
        </div>
      )}
    </nav>
  )
}