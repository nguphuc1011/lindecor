import { getProducts, getFilters, getSettings } from '../admin/actions'
import DesignsClient from './DesignsClient'

export const dynamic = 'force-dynamic'

export default async function DesignsPage() {
  const [products, filters, settings] = await Promise.all([
    getProducts(),
    getFilters(),
    getSettings()
  ])

  const templateProducts = products.filter((p: any) => p.type === 'template')

  return (
    <DesignsClient 
      initialProducts={templateProducts} 
      initialFilters={filters} 
      settings={settings}
    />
  )
}