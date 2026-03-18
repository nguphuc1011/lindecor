import { getProducts, getSettings } from '../admin/actions'

export const dynamic = 'force-dynamic'

export default async function ShopPage() {
  const [products, settings] = await Promise.all([
    getProducts(),
    getSettings()
  ])

  const retailProducts = products.filter((p: any) => p.type === 'retail')

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-12">
        <div className="text-center space-y-4">
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-[0.3em] text-blue-100">
            ẤN PHẨM SHOP
          </span>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
            Bộ sưu tập Ấn phẩm hiện đại
          </h1>
          <p className="text-sm text-blue-100/80 max-w-2xl mx-auto font-medium">
            Tinh tế, hiện đại và sang trọng. Chọn ngay ấn phẩm phù hợp cho sự kiện của bạn.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {retailProducts.map((p: any) => (
            <div key={p.id} className="group relative rounded-3xl overflow-hidden border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_20px_80px_-40px_rgba(37,99,235,0.9)]">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img src={p.imageUrl || '/placeholder.png'} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/20 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${p.stock ? 'bg-emerald-500/80' : 'bg-red-500/80'}`}>
                    {p.stock ? 'Còn hàng' : 'Hết hàng'}
                  </span>
                </div>
                {p.category && (
                  <div className="absolute top-4 right-4 text-[9px] font-black uppercase bg-white/20 px-3 py-1 rounded-full">
                    {p.category}
                  </div>
                )}
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-black uppercase text-[11px] tracking-widest text-white/90 line-clamp-2">{p.name}</h3>
                </div>
                <p className="text-[11px] text-blue-100/70 line-clamp-3 leading-relaxed">{p.description || 'Thiết kế tinh tế, phù hợp nhiều phong cách sự kiện.'}</p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-lg font-black text-blue-200">{p.price?.toLocaleString()}đ</span>
                  <a
                    href={`https://zalo.me/${(settings.zalo || settings.phone || '').replace(/\D/g, '')}`}
                    target="_blank"
                    className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    Tư vấn
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {retailProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-sm text-blue-100/70 font-medium">Chưa có ấn phẩm nào được đăng.</p>
          </div>
        )}
      </div>
    </div>
  )
}
