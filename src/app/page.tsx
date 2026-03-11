import { getProducts, getFilters, getSettings, getBanners, getServices, getProcessSteps, getTestimonials } from './admin/actions'
import ClientHome from '@/components/ClientHome'

export default async function HomePage() {
  const [products, filters, settings, banners, services, processSteps, testimonials] = await Promise.all([
    getProducts(),
    getFilters(),
    getSettings(),
    getBanners(),
    getServices(),
    getProcessSteps(),
    getTestimonials()
  ])

  return (
    <ClientHome 
      initialProducts={JSON.parse(JSON.stringify(products))} 
      initialFilters={JSON.parse(JSON.stringify(filters))} 
      settings={settings}
      banners={JSON.parse(JSON.stringify(banners))}
      services={JSON.parse(JSON.stringify(services))}
      processSteps={JSON.parse(JSON.stringify(processSteps))}
      testimonials={JSON.parse(JSON.stringify(testimonials))}
    />
  )
}