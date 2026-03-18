import { getProducts, getSettings, getShopCategories } from '../admin/actions'
import ShopClient from './ShopClient'

export const dynamic = 'force-dynamic'

export default async function ShopPage() {
  const [products, settings, categories] = await Promise.all([
    getProducts(),
    getSettings(),
    getShopCategories()
  ])

  const retailProducts = products.filter((p: any) => p.type === 'retail')

  return <ShopClient initialProducts={retailProducts} settings={settings} categories={categories} />
}
