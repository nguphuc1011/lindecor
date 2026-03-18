import { getSettings } from '../admin/actions'
import ContactClient from './ContactClient'

export const dynamic = 'force-dynamic'

export default async function ContactPage() {
  const settings = await getSettings()
  return <ContactClient settings={settings} />
}