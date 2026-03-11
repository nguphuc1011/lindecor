'use client'
import { useState, useEffect, useRef } from 'react'

export const dynamic = 'force-dynamic'

import { 
  addProduct, getFilters, addFilterOption, deleteFilterOption, 
  getProducts, deleteProduct, updateFilterOption, renameCategory,
  updateFilterOrder, updateProduct, deleteCategory,
  getSettings, uploadLogo, updateSetting, uploadBannerImage, updateSettings,
  getBanners, addBanner, updateBanner, deleteBanner,
  getServices, upsertService, deleteService,
  getProcessSteps, upsertProcessStep, deleteProcessStep,
  getTestimonials, upsertTestimonial, deleteTestimonial
} from './actions'
import { 
  Settings, Plus, X, Camera, ShoppingBag, 
  Layers, Filter, Trash2, PlusCircle, 
  ChevronRight, Sparkles, Layout, Palette, 
  MapPin, Users, Tag, Info, UploadCloud, CheckCircle2,
  LayoutGrid, Package, Sliders, Edit3, Check, GripVertical, Pencil,
  Globe, Image as ImageIcon, Heart, MessageSquare, ClipboardList,
  Mail, Phone, Facebook, Instagram, Music2, List, Grid, Search, MessageCircle
} from 'lucide-react'

type Tab = 'designs' | 'retail' | 'settings' | 'general' | 'banners' | 'content'

export default function AdminPage() {
  const [activeMenu, setActiveTab] = useState<Tab>('designs')
  const [filters, setFilters] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [banners, setBanners] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [processSteps, setProcessSteps] = useState<any[]>([])
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [settings, setSettings] = useState<Record<string, string>>({})
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false)
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false)
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false)
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false)

  const [editingBanner, setEditingBanner] = useState<any>(null)
  const [editingService, setEditingService] = useState<any>(null)
  const [editingProcess, setEditingProcess] = useState<any>(null)
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null)
  const [editingProduct, setEditingProduct] = useState<any>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedBannerFile, setSelectedBannerFile] = useState<File | null>(null)
  const [selectedServiceFile, setSelectedServiceFile] = useState<File | null>(null)
  const [settingsTab, setSettingsTab] = useState<'template' | 'retail'>('template')
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const refreshData = async () => {
    try {
      const [filterData, productData, settingsData, bannerData, serviceData, processData, testimonialData] = await Promise.all([
        getFilters(), 
        getProducts(),
        getSettings(),
        getBanners(),
        getServices(),
        getProcessSteps(),
        getTestimonials()
      ])
      setFilters(filterData)
      setProducts(productData)
      setSettings(settingsData)
      setBanners(bannerData)
      setServices(serviceData)
      setProcessSteps(processData)
      setTestimonials(testimonialData)

      // Xác định type hiện tại dựa trên menu đang đứng
      const currentType = activeMenu === 'settings' 
        ? settingsTab 
        : (activeMenu === 'designs' ? 'template' : 'retail')

      // Xử lý danh sách category từ filterData theo type đang chọn
      const currentTypeFilters = filterData.filter((f: any) => f.type === currentType)
      const uniqueCats = Array.from(new Set(currentTypeFilters.map((f: any) => f.category)))
      const cats = uniqueCats.map(catId => {
        const config = categoryIcons[catId] || { 
          label: catId, 
          icon: <Layers size={18}/>, 
          color: 'text-slate-600', 
          bg: 'bg-slate-100' 
        }
        return { id: catId, ...config }
      })
      
      setCategories(cats)
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err)
    }
  }

  const categoryIcons: any = {
    theme: { label: 'Chủ đề tiệc', icon: <Sparkles size={18}/>, color: 'text-purple-600', bg: 'bg-purple-50' },
    color: { label: 'Tông màu', icon: <Palette size={18}/>, color: 'text-pink-600', bg: 'bg-pink-50' },
    location: { label: 'Địa điểm', icon: <MapPin size={18}/>, color: 'text-blue-600', bg: 'bg-blue-50' },
    priceRange: { label: 'Phân khúc giá', icon: <Tag size={18}/>, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ageRange: { label: 'Độ tuổi', icon: <Users size={18}/>, color: 'text-amber-600', bg: 'bg-amber-50' },
    gender: { label: 'Đối tượng', icon: <Info size={18}/>, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  }

  useEffect(() => {
    refreshData()
  }, [settingsTab, activeMenu])

  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const bannerFileInputRef = useRef<HTMLInputElement>(null)

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const formData = new FormData(e.currentTarget)
      formData.append('type', activeMenu === 'designs' ? 'template' : 'retail')
      if (selectedFile) formData.set('file', selectedFile)
      
      if (editingProduct) {
        formData.append('id', editingProduct.id)
        formData.append('currentImageUrl', editingProduct.imageUrl)
        await updateProduct(formData)
      } else {
        await addProduct(formData)
      }
      
      setIsModalOpen(false)
      setEditingProduct(null)
      setSelectedFile(null)
      await refreshData()
    } catch (err) {
      alert('Lỗi đăng tải')
    } finally {
      setIsSubmitting(false)
    }
  }

  const normalizeId = (name: string) => {
    return name.toLowerCase()
      .trim()
      .replace(/\s+/g, '_')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Bỏ dấu tiếng Việt
  }

  const handleAddCategory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const name = new FormData(e.currentTarget).get('catName') as string
    if(!name) return
    
    // Ánh xạ ngược từ label sang ID nếu là category mặc định (không phân biệt hoa thường)
    const reverseMapping: Record<string, string> = {
      'chu de tiec': 'theme',
      'tong mau': 'color',
      'tone mau': 'color',
      'mau sac': 'color',
      'dia diem': 'location',
      'phan khuc gia': 'priceRange',
      'do tuoi': 'ageRange',
      'doi tuong': 'gender'
    }
    
    const searchKey = normalizeId(name).replace(/_/g, ' ')
    const id = reverseMapping[searchKey] || normalizeId(name)
    
    if(!categories.find(c => c.id === id)) {
      setCategories(prev => [...prev, { 
        id, 
        label: name, 
        icon: <Layers size={18}/>, 
        color: 'text-slate-600', 
        bg: 'bg-slate-100' 
      }])
    } else {
      alert('Loại bộ lọc này đã tồn tại!')
    }
    setIsAddingCategory(false)
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return
    
    const newCats = [...categories]
    const item = newCats.splice(draggedIndex, 1)[0]
    newCats.splice(index, 0, item)
    
    setCategories(newCats)
    setDraggedIndex(index)
  }

  const handleDragEnd = async () => {
    if (draggedIndex === null) return
    setDraggedIndex(null)
    const order = categories.map(c => c.id)
    await updateFilterOrder(order, settingsTab)
    // refreshData sẽ được gọi tự động nếu cần, nhưng ở đây chúng ta đã có state local đúng rồi
  }

  const filteredProducts = products
    .filter(p => p.type === (activeMenu === 'designs' ? 'template' : 'retail'))
    .filter(p => {
      // Lọc theo từ khóa search
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
      
      // Lọc theo các bộ lọc động
      return Object.entries(filterValues).every(([catId, val]) => {
        if (!val) return true
        
        let productVal = ""
        if (p.filterData) {
          try {
            const data = JSON.parse(p.filterData)
            productVal = data[catId] || ""
          } catch (e) {}
        }
        
        // Fallback cho dữ liệu cũ ở cột cứng (nếu có)
        if (!productVal) {
          productVal = p[catId] as string || ""
        }
        
        return productVal.includes(val)
      })
    })

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <h1 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3 text-indigo-600">
            <LayoutGrid size={28} /> LinDecor
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Admin Dashboard</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <MenuItem 
            icon={<Camera size={20}/>} 
            label="Mẫu thiết kế" 
            active={activeMenu === 'designs'} 
            onClick={() => setActiveTab('designs')} 
          />
          <MenuItem 
            icon={<Package size={20}/>} 
            label="Ấn phẩm Shop" 
            active={activeMenu === 'retail'} 
            onClick={() => setActiveTab('retail')} 
          />
          <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
            <MenuItem 
              icon={<Sliders size={20}/>} 
              label="Cấu trúc bộ lọc" 
              active={activeMenu === 'settings'} 
              onClick={() => setActiveTab('settings')} 
            />
            <MenuItem 
              icon={<ImageIcon size={20}/>} 
              label="Slide Banner" 
              active={activeMenu === 'banners'} 
              onClick={() => setActiveTab('banners')} 
            />
            <MenuItem 
              icon={<ClipboardList size={20}/>} 
              label="Nội dung trang" 
              active={activeMenu === 'content'} 
              onClick={() => setActiveTab('content')} 
            />
            <MenuItem 
              icon={<Globe size={20}/>} 
              label="Cài đặt chung" 
              active={activeMenu === 'general'} 
              onClick={() => setActiveTab('general')} 
            />
          </div>
        </nav>

        <div className="p-6">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Local System Online</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10 max-w-6xl mx-auto">
        
        {/* TOP HEADER */}
        <div className="flex justify-between items-end mb-10">
          <div className="space-y-1">
            <h2 className="text-4xl font-black uppercase tracking-tight text-slate-900 leading-none">
              {activeMenu === 'designs' && "Mẫu thiết kế"}
              {activeMenu === 'retail' && "Ấn phẩm Shop"}
              {activeMenu === 'settings' && "Cấu trúc bộ lọc"}
              {activeMenu === 'banners' && "Slide Banner"}
              {activeMenu === 'content' && "Nội dung trang"}
              {activeMenu === 'general' && "Cài đặt chung"}
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-1">
              {activeMenu === 'designs' && "Quản lý kho mẫu decor tiệc"}
              {activeMenu === 'retail' && "Quản lý sản phẩm bán lẻ"}
              {activeMenu === 'settings' && "Tùy chỉnh các tiêu chí phân loại"}
              {activeMenu === 'banners' && "Ảnh bìa trình chiếu trang chủ"}
              {activeMenu === 'content' && "Dịch vụ, Quy trình & Phản hồi"}
              {activeMenu === 'general' && "Thông tin liên hệ & Thương hiệu"}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Nút thêm mới cho Mẫu thiết kế & Ấn phẩm */}
            {(activeMenu === 'designs' || activeMenu === 'retail') && (
              <button 
                onClick={() => { setEditingProduct(null); setSelectedFile(null); setIsModalOpen(true); }}
                className="bg-indigo-600 hover:bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest flex items-center gap-3 shadow-2xl shadow-indigo-100 transition-all active:scale-95 group"
              >
                <PlusCircle size={20} className="group-hover:rotate-90 transition-transform duration-500" /> Đăng mẫu mới
              </button>
            )}

            {/* Nút thêm mới cho Banner */}
            {activeMenu === 'banners' && (
              <button 
                onClick={() => { setEditingBanner(null); setSelectedBannerFile(null); setIsBannerModalOpen(true); }}
                className="bg-slate-900 hover:bg-indigo-600 text-white px-8 py-4 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] flex items-center gap-3 shadow-2xl shadow-slate-200 transition-all active:scale-95"
              >
                <Plus size={18} /> Thêm Banner mới
              </button>
            )}
          </div>
        </div>

        {/* CONTENT AREA */}
        {activeMenu === 'designs' || activeMenu === 'retail' ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* SEARCH & DYNAMIC FILTERS & VIEW CONTROLS */}
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1 relative w-full">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input 
                    type="text" 
                    placeholder="Tìm kiếm mẫu theo tên hoặc mã..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-16 pr-6 py-5 bg-slate-50 border-none rounded-[1.5rem] outline-none focus:bg-white focus:ring-4 ring-indigo-500/5 transition-all font-bold text-sm"
                  />
                </div>
                
                <div className="flex items-center gap-4 shrink-0">
                  <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1">
                    <button 
                      onClick={() => setViewMode('grid')}
                      className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      <Grid size={20} />
                    </button>
                    <button 
                      onClick={() => setViewMode('list')}
                      className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      <List size={20} />
                    </button>
                  </div>

                  {/* CLEAR FILTERS */}
                  {(searchQuery || Object.values(filterValues).some(v => v)) && (
                    <button 
                      onClick={() => { setSearchQuery(''); setFilterValues({}); }}
                      className="bg-red-50 text-red-500 p-4 rounded-2xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center shadow-lg shadow-red-100"
                      title="Xóa tất cả bộ lọc"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              </div>

              {/* DYNAMIC CATEGORY FILTERS GRID */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pt-4 border-t border-slate-50">
                {categories.filter(c => filters.some(f => f.category === c.id && f.type === (activeMenu === 'designs' ? 'template' : 'retail'))).map(cat => {
                  const iconConfig = categoryIcons[cat.id] || { icon: <Layers size={14}/>, color: 'text-slate-400' }
                  return (
                    <div key={cat.id} className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">{cat.label}</label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                          <span className={`${iconConfig.color}`}>
                            {iconConfig.icon}
                          </span>
                        </div>
                        <select 
                          className="w-full pl-10 pr-4 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-wider outline-none focus:ring-4 ring-indigo-500/5 cursor-pointer hover:border-indigo-200 transition-all appearance-none"
                          value={filterValues[cat.id] || ''}
                          onChange={(e) => setFilterValues(prev => ({ ...prev, [cat.id]: e.target.value }))}
                        >
                          <option value="">Tất cả</option>
                          {filters.filter(f => f.category === cat.id && f.type === (activeMenu === 'designs' ? 'template' : 'retail')).map(f => (
                            <option key={f.id} value={f.value}>{f.value}</option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">
                          <ChevronRight size={14} className="rotate-90" />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* PRODUCT GRID/LIST VIEW */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map(item => (
                  <ProductCard 
                    key={item.id} 
                    item={item} 
                    activeMenu={activeMenu} 
                    onDelete={async (id: string) => { if(confirm('Xóa?')){ await deleteProduct(id); refreshData(); }}} 
                    onEdit={(product: any) => { setEditingProduct(product); setIsModalOpen(true); }}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Mẫu</th>
                      <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Thông tin</th>
                      <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Bộ lọc</th>
                      <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredProducts.map(p => {
                      const tags = getTagsFromProduct(p)
                      return (
                        <tr key={p.id} className="hover:bg-slate-50/30 transition-colors group">
                          <td className="px-8 py-4">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
                              <img src={p.imageUrl || '/placeholder.png'} className="w-full h-full object-cover" alt={p.name} />
                            </div>
                          </td>
                          <td className="px-8 py-4">
                            <div className="space-y-1">
                              <div className="text-indigo-600 font-black text-xs tracking-tighter">#{p.code || 'N/A'}</div>
                              <div className="font-bold text-slate-700 text-sm line-clamp-1">{p.name}</div>
                            </div>
                          </td>
                          <td className="px-8 py-4">
                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                              {tags.slice(0, 2).map((tag, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-slate-100 text-[8px] font-black uppercase rounded text-slate-400">{tag.label}</span>
                              ))}
                              {tags.length > 2 && <span className="text-[8px] font-black text-slate-300">+{tags.length - 2}</span>}
                            </div>
                          </td>
                          <td className="px-8 py-4 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                              <button onClick={() => { setEditingProduct(p); setIsModalOpen(true); }} className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"><Edit3 size={14} /></button>
                              <button onClick={async () => { if(confirm('Xóa?')) { await deleteProduct(p.id); refreshData(); }}} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {filteredProducts.length === 0 && (
              <div className="py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300 gap-4">
                <Package size={48} className="opacity-20" />
                <p className="font-bold uppercase text-xs tracking-widest opacity-40">Không tìm thấy kết quả phù hợp</p>
              </div>
            )}
          </div>
        ) : activeMenu === 'settings' ? (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
            {/* Tabs cho Settings */}
            <div className="flex gap-4 p-1 bg-slate-100 rounded-2xl w-fit">
              <button 
                onClick={() => setSettingsTab('template')}
                className={`px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${settingsTab === 'template' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Bộ lọc Mẫu thiết kế
              </button>
              <button 
                onClick={() => setSettingsTab('retail')}
                className={`px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${settingsTab === 'retail' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Bộ lọc Ấn phẩm
              </button>
            </div>

             <div className="flex justify-between items-center">
                <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Danh sách các loại bộ lọc động</p>
                <button 
                  onClick={() => setIsAddingCategory(true)}
                  className="text-indigo-600 font-black uppercase text-[10px] tracking-widest flex items-center gap-1 hover:underline"
                >
                  <Plus size={14} /> Thêm loại mới
                </button>
             </div>

             {isAddingCategory && (
                <div className="bg-white border border-indigo-100 p-6 rounded-[2rem] shadow-sm animate-in fade-in slide-in-from-top-4">
                  <form onSubmit={handleAddCategory} className="flex gap-3">
                    <input name="catName" placeholder="Tên loại bộ lọc mới..." autoFocus className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 ring-indigo-500/20" />
                    <button type="submit" className="bg-indigo-600 text-white px-6 rounded-xl font-black uppercase text-[10px] tracking-widest">Lưu</button>
                    <button type="button" onClick={() => setIsAddingCategory(false)} className="bg-slate-100 text-slate-400 px-4 rounded-xl"><X size={18}/></button>
                  </form>
                </div>
             )}

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat, index) => (
                  <div 
                    key={cat.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`transition-all ${draggedIndex === index ? 'opacity-40 scale-95' : 'opacity-100'}`}
                  >
                    <FilterBox 
                      cat={cat} 
                      items={filters.filter(f => f.category === cat.id && f.type === settingsTab)} 
                      onAdd={async (formData: FormData) => { 
                        formData.append('type', settingsTab);
                        await addFilterOption(formData); 
                        refreshData(); 
                      }}
                      onDelete={async (id: string) => { if(confirm('Xóa?')){ await deleteFilterOption(id); refreshData(); }}}
                      onDeleteCategory={async (id: string) => { if(confirm(`Xóa toàn bộ loại bộ lọc "${cat.label}"?`)){ await deleteCategory(id, settingsTab); refreshData(); }}}
                      onUpdateItem={async (id: string, val: string) => { await updateFilterOption(id, val); refreshData(); }}
                      onRenameCategory={async (oldId: string, newLabel: string) => { await renameCategory(oldId, newLabel, settingsTab); refreshData(); }}
                    />
                  </div>
                ))}
             </div>
          </div>
        ) : activeMenu === 'content' ? (
          <div className="space-y-12 animate-in fade-in duration-500 pb-20">
            {/* SERVICES SECTION */}
            <section className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                    <Heart size={20} />
                  </div>
                  <h3 className="font-black uppercase tracking-widest text-xs text-slate-700">Dịch vụ cung cấp</h3>
                </div>
                <button onClick={() => { setEditingService(null); setSelectedServiceFile(null); setIsServiceModalOpen(true); }} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center gap-2 hover:bg-indigo-600 transition-all shadow-lg">
                  <Plus size={14} /> Thêm Dịch vụ
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {services.map(s => (
                  <div key={s.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm group overflow-hidden flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      {s.imageUrl ? (
                        <div className="w-12 h-12 rounded-2xl overflow-hidden border border-slate-100">
                          <img src={s.imageUrl} className="w-full h-full object-cover" alt={s.title} />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                          <Heart size={24} />
                        </div>
                      )}
                      <div className="flex gap-1">
                        <button onClick={() => { setEditingService(s); setSelectedServiceFile(null); setIsServiceModalOpen(true); }} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Pencil size={14}/></button>
                        <button onClick={async () => { if(confirm('Xóa?')){ await deleteService(s.id); refreshData(); }}} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                      </div>
                    </div>
                    <h4 className="font-black uppercase tracking-widest text-[11px] text-slate-800 mb-2">{s.title}</h4>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed line-clamp-2">{s.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="h-px bg-slate-100 w-full"></div>

            {/* PROCESS SECTION */}
            <section className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                    <ClipboardList size={20} />
                  </div>
                  <h3 className="font-black uppercase tracking-widest text-xs text-slate-700">Quy trình làm việc</h3>
                </div>
                <button onClick={() => { setEditingProcess(null); setIsProcessModalOpen(true); }} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center gap-2 hover:bg-indigo-600 transition-all shadow-lg">
                  <Plus size={14} /> Thêm Bước
                </button>
              </div>
              <div className="space-y-4">
                {processSteps.map((step, idx) => (
                  <div key={step.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6 group">
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-lg italic shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black uppercase tracking-widest text-[11px] text-slate-800">{step.title}</h4>
                      <p className="text-xs text-slate-400 font-medium mt-1">{step.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingProcess(step); setIsProcessModalOpen(true); }} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Pencil size={16}/></button>
                      <button onClick={async () => { if(confirm('Xóa?')){ await deleteProcessStep(step.id); refreshData(); }}} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="h-px bg-slate-100 w-full"></div>

            {/* TESTIMONIALS SECTION */}
            <section className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600">
                    <MessageSquare size={20} />
                  </div>
                  <h3 className="font-black uppercase tracking-widest text-xs text-slate-700">Ý kiến khách hàng (Feedback)</h3>
                </div>
                <button onClick={() => { setEditingTestimonial(null); setIsTestimonialModalOpen(true); }} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center gap-2 hover:bg-indigo-600 transition-all shadow-lg">
                  <Plus size={14} /> Thêm Feedback
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.map(t => (
                  <div key={t.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative group">
                    <div className="absolute top-6 right-6 flex gap-1">
                      <button onClick={() => { setEditingTestimonial(t); setIsTestimonialModalOpen(true); }} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Pencil size={14}/></button>
                      <button onClick={async () => { if(confirm('Xóa?')){ await deleteTestimonial(t.id); refreshData(); }}} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-black text-xl italic uppercase">
                        {t.clientName[0]}
                      </div>
                      <div>
                        <h4 className="font-black uppercase tracking-widest text-[11px] text-slate-800">{t.clientName}</h4>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-500">{t.eventType}</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 italic font-medium leading-relaxed">"{t.content}"</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : activeMenu === 'banners' ? (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {banners.map((banner) => (
                <div key={banner.id} className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                  <div className="aspect-video relative overflow-hidden bg-slate-50">
                    <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button onClick={() => { setEditingBanner(banner); setIsBannerModalOpen(true); }} className="bg-white/90 p-2 rounded-xl text-slate-600 hover:bg-indigo-600 hover:text-white transition-all shadow-lg"><Edit3 size={16} /></button>
                      <button onClick={async () => { if(confirm('Xóa banner này?')){ await deleteBanner(banner.id); refreshData(); }}} className="bg-white/90 p-2 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <div className="p-6 space-y-2 flex-1">
                    <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{banner.title || 'Không có tiêu đề'}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{banner.description || 'Không có mô tả'}</p>
                  </div>
                </div>
              ))}
              {banners.length === 0 && (
                <div className="col-span-full py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300 gap-4">
                  <ImageIcon size={48} className="opacity-20" />
                  <p className="font-bold uppercase text-xs tracking-widest opacity-40">Chưa có banner nào</p>
                </div>
              )}
            </div>
          </div>
        ) : activeMenu === 'general' ? (
          <div className="max-w-4xl space-y-10 animate-in fade-in duration-500">
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-10 space-y-12">
              {/* LOGO UPLOAD SECTION */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                    <Camera size={20} />
                  </div>
                  <h3 className="font-black uppercase tracking-widest text-xs text-slate-700">Logo thương hiệu</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                  <div className="space-y-4">
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                      Logo hiển thị trên thanh điều hướng.
                    </p>
                    <form onSubmit={async (e) => {
                      e.preventDefault()
                      const file = (e.currentTarget.elements.namedItem('logo') as HTMLInputElement).files?.[0]
                      if (!file) return
                      
                      const formData = new FormData()
                      formData.append('logo', file)
                      
                      setIsSubmitting(true)
                      try {
                        await uploadLogo(formData)
                        alert('Đã cập nhật Logo!')
                        refreshData()
                      } catch (err) {
                        console.error("Lỗi upload logo:", err)
                        alert('Lỗi khi tải Logo lên!')
                      } finally {
                        setIsSubmitting(false)
                      }
                    }} className="flex flex-col gap-4">
                      <input type="file" name="logo" accept="image/*" className="hidden" id="logo-upload" onChange={(e) => {
                        if(e.target.files?.[0]) e.currentTarget.form?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
                      }} />
                      <button 
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => document.getElementById('logo-upload')?.click()}
                        className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 w-fit disabled:opacity-50"
                      >
                        {isSubmitting ? 'Đang xử lý...' : 'Tải Logo mới'}
                      </button>
                    </form>
                  </div>

                  <div className="aspect-square bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden p-10 group relative max-w-[200px]">
                    {settings.logo ? (
                      <img src={settings.logo} alt="Logo" className="max-w-full max-h-full object-contain" />
                    ) : (
                      <div className="text-center">
                        <UploadCloud size={30} className="mx-auto text-slate-300" />
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <div className="h-px bg-slate-100 w-full"></div>

              {/* FOOTER & CONTACT SECTION */}
              <section className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600">
                    <Phone size={20} />
                  </div>
                  <h3 className="font-black uppercase tracking-widest text-xs text-slate-700">Thông tin liên hệ & Footer</h3>
                </div>

                <form onSubmit={async (e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  setIsSubmitting(true)
                  try {
                    const updateData: Record<string, string> = {}
                    const fields = ['phone', 'email', 'address', 'facebook', 'instagram', 'tiktok', 'zalo']
                    for (const field of fields) {
                      const value = formData.get(field) as string
                      if (value !== null) updateData[field] = value
                    }
                    await updateSettings(updateData)
                    alert('Đã cập nhật thông tin liên hệ!')
                    refreshData()
                  } catch (err) {
                    alert('Lỗi')
                  } finally {
                    setIsSubmitting(false)
                  }
                }} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputField label="Số điện thoại" name="phone" defaultValue={settings.phone} icon={<Phone size={14}/>} />
                    <InputField label="Email" name="email" defaultValue={settings.email} icon={<Mail size={14}/>} />
                    <InputField label="Địa chỉ" name="address" defaultValue={settings.address} icon={<MapPin size={14}/>} />
                    <InputField label="Facebook Link" name="facebook" defaultValue={settings.facebook} icon={<Facebook size={14}/>} />
                    <InputField label="Instagram Link" name="instagram" defaultValue={settings.instagram} icon={<Instagram size={14}/>} />
                    <InputField label="TikTok Link" name="tiktok" defaultValue={settings.tiktok} icon={<Music2 size={14}/>} />
                    <InputField label="Zalo (Số điện thoại)" name="zalo" defaultValue={settings.zalo} icon={<MessageCircle size={14}/>} />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-600 transition-all shadow-xl disabled:opacity-50">
                    Lưu thông tin liên hệ
                  </button>
                </form>
              </section>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {/* Mục này đã được thay thế bằng khối layout phía trên */}
          </div>
        )}
      </main>

      {/* BANNER MODAL FORM */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => { setIsBannerModalOpen(false); setEditingBanner(null); }}></div>
          <form 
            key={editingBanner?.id || 'new-banner'}
            onSubmit={async (e) => {
              e.preventDefault()
              setIsSubmitting(true)
              try {
                const formData = new FormData(e.currentTarget)
                if (selectedBannerFile) formData.set('image', selectedBannerFile)
                if (editingBanner) {
                  formData.append('id', editingBanner.id)
                  formData.append('currentImageUrl', editingBanner.imageUrl)
                  await updateBanner(formData)
                } else {
                  await addBanner(formData)
                }
                setIsBannerModalOpen(false)
                setEditingBanner(null)
                setSelectedBannerFile(null)
                await refreshData()
              } catch (err: any) {
                alert(err.message || 'Lỗi xử lý banner')
              } finally {
                setIsSubmitting(false)
              }
            }}
            className="relative bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
          >
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-black uppercase tracking-tighter text-slate-800">
                {editingBanner ? "Chỉnh sửa" : "Thêm"} Slide Banner mới
              </h3>
              <button type="button" onClick={() => { setIsBannerModalOpen(false); setEditingBanner(null); }} className="p-3 hover:bg-white rounded-full transition-colors text-slate-400 shadow-sm"><X size={20}/></button>
            </div>

            <div className="p-10 overflow-y-auto custom-scrollbar space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <InputField label="Tiêu đề Slide" name="title" defaultValue={editingBanner?.title} placeholder="VD: Trang trí tiệc cưới nghệ thuật" />
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Mô tả Slide</label>
                    <textarea name="description" defaultValue={editingBanner?.description} rows={3} className="w-full p-5 bg-slate-50 border-none rounded-[2rem] outline-none focus:bg-white focus:ring-4 ring-indigo-500/5 transition-all font-bold text-sm resize-none" placeholder="Mô tả ngắn gọn..."></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Nút (Text)" name="buttonText" defaultValue={editingBanner?.buttonText || "Xem chi tiết"} />
                    <InputField label="Nút (Link)" name="buttonLink" defaultValue={editingBanner?.buttonLink || "/"} />
                  </div>
                  <InputField label="Thứ tự hiển thị" name="order" type="number" defaultValue={editingBanner?.order || 0} />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1 text-center block">Hình ảnh Banner</label>
                  <div 
                    onClick={() => bannerFileInputRef.current?.click()}
                    className="aspect-video bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all overflow-hidden group relative"
                  >
                    {selectedBannerFile || editingBanner?.imageUrl ? (
                      <img 
                        src={selectedBannerFile ? URL.createObjectURL(selectedBannerFile) : editingBanner?.imageUrl} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" 
                      />
                    ) : (
                      <div className="text-center space-y-3">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm text-slate-400 group-hover:text-indigo-600 transition-colors">
                          <UploadCloud size={24} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Chọn ảnh 16:9</p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      ref={bannerFileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={(e) => setSelectedBannerFile(e.target.files?.[0] || null)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-slate-900 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
              >
                {isSubmitting ? "Đang xử lý..." : "Xác nhận lưu Banner"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SERVICE MODAL */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsServiceModalOpen(false)}></div>
          <form 
            onSubmit={async (e) => {
              e.preventDefault()
              setIsSubmitting(true)
              const formData = new FormData(e.currentTarget)
              if (editingService) {
                formData.append('id', editingService.id)
                formData.append('currentImageUrl', editingService.imageUrl || '')
              }
              if (selectedServiceFile) formData.set('image', selectedServiceFile)
              await upsertService(formData)
              setIsServiceModalOpen(false)
              setSelectedServiceFile(null)
              refreshData()
              setIsSubmitting(false)
            }}
            className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200"
          >
            <h3 className="text-lg font-black uppercase tracking-tighter text-slate-800">{editingService ? 'Sửa' : 'Thêm'} Dịch vụ</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <InputField label="Tên dịch vụ" name="title" defaultValue={editingService?.title} />
                <InputField label="Thứ tự" name="order" type="number" defaultValue={editingService?.order || 0} />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Ảnh đại diện</label>
                <div 
                  onClick={() => document.getElementById('service-image-input')?.click()}
                  className="aspect-square bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all overflow-hidden group relative"
                >
                  {selectedServiceFile || editingService?.imageUrl ? (
                    <img 
                      src={selectedServiceFile ? URL.createObjectURL(selectedServiceFile) : editingService?.imageUrl} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="text-center space-y-2">
                      <UploadCloud size={20} className="mx-auto text-slate-300" />
                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Chọn ảnh</p>
                    </div>
                  )}
                  <input 
                    id="service-image-input"
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={(e) => setSelectedServiceFile(e.target.files?.[0] || null)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Mô tả</label>
              <textarea name="description" defaultValue={editingService?.description} rows={3} className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:bg-white focus:ring-4 ring-indigo-500/5 transition-all font-bold text-sm resize-none"></textarea>
            </div>
            
            <button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-600 transition-all shadow-xl disabled:opacity-50">
              {isSubmitting ? 'Đang lưu...' : 'Lưu dịch vụ'}
            </button>
          </form>
        </div>
      )}

      {/* PROCESS MODAL */}
      {isProcessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsProcessModalOpen(false)}></div>
          <form 
            onSubmit={async (e) => {
              e.preventDefault()
              setIsSubmitting(true)
              const formData = new FormData(e.currentTarget)
              if (editingProcess) formData.append('id', editingProcess.id)
              await upsertProcessStep(formData)
              setIsProcessModalOpen(false)
              refreshData()
              setIsSubmitting(false)
            }}
            className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200"
          >
            <h3 className="text-lg font-black uppercase tracking-tighter text-slate-800">{editingProcess ? 'Sửa' : 'Thêm'} Bước quy trình</h3>
            <InputField label="Tiêu đề bước" name="title" defaultValue={editingProcess?.title} />
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Mô tả ngắn</label>
              <textarea name="description" defaultValue={editingProcess?.description} rows={2} className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:bg-white focus:ring-4 ring-indigo-500/5 transition-all font-bold text-sm resize-none"></textarea>
            </div>
            <InputField label="Thứ tự (1, 2, 3...)" name="order" type="number" defaultValue={editingProcess?.order || 0} />
            <button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-600 transition-all shadow-xl disabled:opacity-50">
              Lưu bước quy trình
            </button>
          </form>
        </div>
      )}

      {/* TESTIMONIAL MODAL */}
      {isTestimonialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsTestimonialModalOpen(false)}></div>
          <form 
            onSubmit={async (e) => {
              e.preventDefault()
              setIsSubmitting(true)
              const formData = new FormData(e.currentTarget)
              if (editingTestimonial) formData.append('id', editingTestimonial.id)
              await upsertTestimonial(formData)
              setIsTestimonialModalOpen(false)
              refreshData()
              setIsSubmitting(false)
            }}
            className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200"
          >
            <h3 className="text-lg font-black uppercase tracking-tighter text-slate-800">{editingTestimonial ? 'Sửa' : 'Thêm'} Feedback</h3>
            <InputField label="Tên khách hàng" name="clientName" defaultValue={editingTestimonial?.clientName} />
            <InputField label="Loại sự kiện" name="eventType" defaultValue={editingTestimonial?.eventType} placeholder="VD: Tiệc cưới nhà hàng" />
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Nội dung Feedback</label>
              <textarea name="content" defaultValue={editingTestimonial?.content} rows={4} className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:bg-white focus:ring-4 ring-indigo-500/5 transition-all font-bold text-sm resize-none"></textarea>
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-600 transition-all shadow-xl disabled:opacity-50">
              Lưu Feedback
            </button>
          </form>
        </div>
      )}

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => { setIsModalOpen(false); setEditingProduct(null); }}></div>
          
          <form 
            key={editingProduct?.id || 'new'} 
            onSubmit={handleAddProduct} 
            className="relative bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
          >
            {/* MODAL HEADER (FIXED) */}
            <div className="flex justify-between items-center p-8 border-b border-slate-50 shrink-0 bg-white z-10">
              <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 text-slate-800">
                {activeMenu === 'designs' ? <Camera className="text-indigo-600"/> : <Package className="text-indigo-600"/>}
                {editingProduct ? "Chỉnh sửa" : "Đăng"} {activeMenu === 'designs' ? "Mẫu thiết kế" : "Ấn phẩm"} mới
              </h3>
              <button type="button" onClick={() => { setIsModalOpen(false); setEditingProduct(null); }} className="p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X size={24}/></button>
            </div>

            {/* MODAL BODY (SCROLLABLE) */}
            <div className="p-10 flex-1 overflow-y-auto custom-scrollbar space-y-10">
              
              {/* TOP SECTION: NAME & IMAGE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  {editingProduct?.code && (
                    <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 w-fit px-4 py-2 rounded-xl border border-indigo-100 mb-2">
                      <Tag size={14} />
                      <span className="font-black text-sm tracking-tighter">#{editingProduct.code}</span>
                    </div>
                  )}
                  <input type="hidden" name="code" defaultValue={editingProduct?.code} />
                  <InputField label="Tên hiển thị" name="name" defaultValue={editingProduct?.name} placeholder="VD: Backdrop Sinh Nhật Bé Trai" required />
                  {activeMenu === 'retail' && (
                    <InputField label="Giá bán (VNĐ)" name="price" type="number" defaultValue={editingProduct?.price} placeholder="500000" required />
                  )}
                  {activeMenu === 'retail' && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Mô tả sản phẩm</label>
                      <textarea name="description" defaultValue={editingProduct?.description} rows={5} className="w-full p-5 bg-slate-50 border-none rounded-[2rem] outline-none focus:bg-white focus:ring-4 ring-indigo-500/5 transition-all font-bold text-sm resize-none" placeholder="Chất liệu, kích thước, quy cách đóng gói..."></textarea>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Hình ảnh mẫu (Tỷ lệ 16:9)</label>
                  <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])} required={!editingProduct} />
                    <div className={`w-full aspect-video border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center gap-3 transition-all ${selectedFile || editingProduct?.imageUrl ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-slate-50 hover:border-indigo-400'}`}>
                      {selectedFile ? (
                        <>
                          <CheckCircle2 className="text-emerald-500" size={40} />
                          <span className="text-xs font-bold text-emerald-600 text-center truncate px-4 w-full">{selectedFile.name}</span>
                        </>
                      ) : editingProduct?.imageUrl ? (
                        <>
                          <img src={editingProduct.imageUrl} className="w-full h-full object-cover rounded-[1.8rem]" alt="Current" />
                          <div className="absolute inset-0 bg-black/40 rounded-[1.8rem] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="text-white font-black uppercase text-[10px] tracking-widest">Thay đổi ảnh</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="text-slate-300" size={40} />
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Nhấn để chọn ảnh</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* FILTER SECTION (2 COLUMNS) */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-slate-100"></div>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Phân loại bộ lọc</span>
                  <div className="h-px flex-1 bg-slate-100"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {categories.map(cat => {
                    let defaultValue = ""
                    if (editingProduct?.filterData) {
                      try {
                        const data = JSON.parse(editingProduct.filterData)
                        defaultValue = data[cat.id] || ""
                      } catch (e) {}
                    }
                    if (!defaultValue) {
                      defaultValue = editingProduct?.[cat.id] || ""
                    }

                    return (
                      <MultiSelectField 
                        key={cat.id}
                        label={cat.label} 
                        name={cat.id} 
                        defaultValue={defaultValue} 
                        options={filters.filter(f => f.category === cat.id && f.type === (activeMenu === 'designs' ? 'template' : 'retail')).map(f => f.value)} 
                      />
                    )
                  })}
                </div>
              </div>
            </div>

            {/* MODAL FOOTER (FIXED) */}
            <div className="p-8 border-t border-slate-50 bg-slate-50/50 shrink-0">
              <button 
                disabled={isSubmitting} 
                className="w-full bg-slate-900 text-white p-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-[0.98] disabled:opacity-50"
              >
                {isSubmitting ? 'Đang xử lý...' : <><PlusCircle size={20} /> {editingProduct ? 'Cập nhật thay đổi' : 'Xác nhận đăng tải'}</>}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

function MenuItem({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all ${active ? 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
    >
      {icon} {label}
    </button>
  )
}

function InputField({ label, ...props }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">{label}</label>
      <input className="w-full p-5 bg-slate-50 border-none rounded-2xl outline-none focus:bg-white focus:ring-4 ring-indigo-500/5 transition-all font-bold text-sm" {...props} />
    </div>
  )
}

function MultiSelectField({ label, name, options, defaultValue = "" }: { label: string, name: string, options: string[], defaultValue?: string }) {
  const selectedValues = defaultValue ? defaultValue.split(', ') : []
  
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">{label}</label>
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50 flex flex-wrap gap-2 max-h-[150px] overflow-y-auto custom-scrollbar">
        {options.map(opt => (
          <label key={opt} className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-100 cursor-pointer hover:border-indigo-300 transition-all group">
            <input 
              type="checkbox" 
              name={name} 
              value={opt} 
              defaultChecked={selectedValues.includes(opt)}
              className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" 
            />
            <span className="text-xs font-bold text-slate-600 group-hover:text-indigo-600">{opt}</span>
          </label>
        ))}
        {options.length === 0 && <span className="text-[10px] font-bold text-slate-300 italic">Chưa có dữ liệu bộ lọc...</span>}
      </div>
    </div>
  )
}

function FilterBox({ cat, items, onAdd, onDelete, onDeleteCategory, onUpdateItem, onRenameCategory }: any) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [isEditingCat, setIsEditingCat] = useState(false)
  const [editCatLabel, setEditCatLabel] = useState(cat.label)

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-xl group/box">
      <div className={`p-6 ${cat.bg} flex items-center justify-between border-b border-slate-50 cursor-move`}>
        <div className="flex items-center gap-3 flex-1">
          <GripVertical size={16} className="text-slate-300" />
          <span className={cat.color}>{cat.icon}</span>
          {isEditingCat ? (
            <input 
              autoFocus
              className="bg-white border-none rounded-lg px-2 py-1 text-[11px] font-black uppercase tracking-wider text-slate-700 w-full outline-none ring-2 ring-indigo-500/20"
              value={editCatLabel}
              onChange={(e) => setEditCatLabel(e.target.value)}
              onBlur={() => {
                onRenameCategory(cat.id, editCatLabel)
                setIsEditingCat(false)
              }}
              onKeyDown={(e) => {
                if(e.key === 'Enter') {
                  onRenameCategory(cat.id, editCatLabel)
                  setIsEditingCat(false)
                }
              }}
            />
          ) : (
            <span className="font-black uppercase text-[11px] tracking-wider text-slate-700">{cat.label}</span>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover/box:opacity-100 transition-all">
          <button 
            onClick={() => setIsEditingCat(!isEditingCat)}
            className="text-slate-400 hover:text-indigo-600 p-1"
          >
            <Edit3 size={14} />
          </button>
          <button 
            onClick={() => onDeleteCategory(cat.id)}
            className="text-slate-400 hover:text-red-500 p-1"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      
      <div className="p-6 flex-1 min-h-[150px] max-h-[250px] overflow-y-auto space-y-2 custom-scrollbar">
        {items.map((item: any) => (
          <div key={item.id} className="flex items-center justify-between bg-slate-50 group p-3 rounded-xl hover:bg-slate-100 transition-all">
            {editingId === item.id ? (
              <input 
                autoFocus
                className="flex-1 bg-white border-none rounded-lg px-2 py-1 text-xs font-bold outline-none ring-2 ring-indigo-500/20"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => {
                  onUpdateItem(item.id, editValue)
                  setEditingId(null)
                }}
                onKeyDown={(e) => {
                  if(e.key === 'Enter') {
                    onUpdateItem(item.id, editValue)
                    setEditingId(null)
                  }
                }}
              />
            ) : (
              <span className="text-xs font-bold text-slate-600">{item.value}</span>
            )}
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
              <button 
                onClick={() => { setEditingId(item.id); setEditValue(item.value); }} 
                className="text-slate-300 hover:text-indigo-500 p-1"
              >
                <Edit3 size={14} />
              </button>
              <button 
                onClick={() => onDelete(item.id)} 
                className="text-slate-300 hover:text-red-500 p-1"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-5 bg-slate-50/50">
        <form onSubmit={(e) => { e.preventDefault(); onAdd(new FormData(e.currentTarget)); e.currentTarget.reset(); }} className="flex gap-2">
          <input type="hidden" name="category" value={cat.id} />
          <input name="value" placeholder="Thêm nhanh..." className="flex-1 bg-white border-none rounded-xl px-4 py-2 text-xs outline-none focus:ring-2 ring-indigo-500/20 font-bold" required />
          <button type="submit" className="bg-white p-2 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"><Plus size={16} /></button>
        </form>
      </div>
    </div>
  )
}

function getTagsFromProduct(item: any) {
  const tags: { label: string, color: string }[] = []
  
  if (item.filterData) {
    try {
      const data = JSON.parse(item.filterData)
      Object.entries(data).forEach(([key, val]: [string, any]) => {
        if (val) tags.push({ label: val, color: 'slate' })
      })
    } catch (e) {}
  }
  
  const hardcoded = ['theme', 'color', 'location', 'gender', 'ageRange']
  hardcoded.forEach(key => {
    const val = item[key] as string
    if (val && !tags.find(t => t.label === val)) {
      tags.push({ label: val, color: 'slate' })
    }
  })

  if (item.priceRange) {
    if (!tags.find(t => t.label === item.priceRange)) {
      tags.push({ label: item.priceRange, color: 'indigo' })
    }
  }
  if (item.price > 0) tags.push({ label: `${item.price.toLocaleString()}đ`, color: 'emerald' })

  return tags
}

function ProductCard({ item, activeMenu, onDelete, onEdit }: any) {
  const tags = getTagsFromProduct(item)

  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 group hover:shadow-2xl transition-all">
      <div className="aspect-video relative overflow-hidden bg-slate-100">
        <img src={item.imageUrl || '/placeholder.png'} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
          <button onClick={() => onEdit(item)} className="bg-white/90 hover:bg-indigo-600 hover:text-white p-3 rounded-2xl text-slate-400 transition-all shadow-xl backdrop-blur-sm">
            <Pencil size={20} />
          </button>
          <button onClick={() => onDelete(item.id)} className="bg-white/90 hover:bg-red-500 hover:text-white p-3 rounded-2xl text-slate-400 transition-all shadow-xl backdrop-blur-sm">
            <Trash2 size={20} />
          </button>
        </div>
      </div>
      <div className="p-5 space-y-1">
        {item.code && (
          <div className="text-indigo-600 font-black text-lg tracking-tighter">
            #{item.code}
          </div>
        )}
        <h3 className="font-bold text-xs tracking-tight line-clamp-2 leading-relaxed text-slate-700">{item.name}</h3>
        <div className="flex flex-wrap gap-1 pt-2">
          {tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="px-2 py-1 bg-slate-50 text-[9px] font-black uppercase rounded-lg text-slate-400">{tag.label}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function TagItem({ label, color = "slate" }: any) {
  const colors: any = {
    slate: "bg-slate-50 text-slate-500 border-slate-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100"
  }
  return <span className={`${colors[color]} text-[10px] font-black uppercase px-3 py-1 rounded-lg border`}>{label}</span>
}
