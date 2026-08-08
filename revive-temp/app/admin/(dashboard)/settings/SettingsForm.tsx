'use client'

import { useState } from 'react'
import { updateBusinessSettings } from '@/lib/actions/admin/settingsActions'
import { Toast } from '@/components/admin/Toast'
import type { BusinessSettings } from '@/types/database'

export function SettingsForm({ settings }: { settings: BusinessSettings | null }) {
  const s = settings
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const [businessName, setBusinessName] = useState(s?.business_name ?? '')
  const [tagline, setTagline] = useState(s?.tagline ?? '')
  const [phone, setPhone] = useState(s?.phone ?? '')
  const [whatsapp, setWhatsapp] = useState(s?.whatsapp_number ?? '')
  const [email, setEmail] = useState(s?.email ?? '')
  const [address, setAddress] = useState(s?.address ?? '')
  const [city, setCity] = useState(s?.city ?? '')
  const [state, setState] = useState(s?.state ?? '')
  const [postalCode, setPostalCode] = useState(s?.postal_code ?? '')
  const [googleMaps, setGoogleMaps] = useState(s?.google_maps_url ?? '')
  const [instagram, setInstagram] = useState(s?.instagram_url ?? '')
  const [facebook, setFacebook] = useState(s?.facebook_url ?? '')
  const [youtube, setYoutube] = useState(s?.youtube_url ?? '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const result = await updateBusinessSettings({
      business_name: businessName,
      tagline: tagline || null,
      phone: phone || null,
      whatsapp_number: whatsapp || null,
      email: email || null,
      address: address || null,
      city: city || null,
      state: state || null,
      postal_code: postalCode || null,
      google_maps_url: googleMaps || null,
      instagram_url: instagram || null,
      facebook_url: facebook || null,
      youtube_url: youtube || null,
    })
    setSaving(false)
    setToast({ message: result.success ? result.message : result.error, type: result.success ? 'success' : 'error' })
  }

  const inputClass = 'bg-[#0d0f0e] border border-white/[0.08] px-3 py-2 text-sm text-[#e2e3e1] focus:outline-none focus:border-[#ff571a]/50 w-full font-[family-name:var(--font-inter)] placeholder:text-[#4b5563]'
  const labelClass = 'block font-[family-name:var(--font-inter)] text-xs font-medium text-[#9ca3af] uppercase tracking-wider mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="bg-[#111312] border border-white/[0.08] p-5 space-y-4">
        <h3 className="font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider text-[#9ca3af]">Identity</h3>
        <div>
          <label className={labelClass}>Business Name</label>
          <input value={businessName} onChange={e => setBusinessName(e.target.value)} className={inputClass} placeholder="Revive Fight Club" />
        </div>
        <div>
          <label className={labelClass}>Tagline</label>
          <input value={tagline} onChange={e => setTagline(e.target.value)} className={inputClass} placeholder="Elite training in Bengaluru" />
        </div>
      </div>

      <div className="bg-[#111312] border border-white/[0.08] p-5 space-y-4">
        <h3 className="font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider text-[#9ca3af]">Contact
          <span className="ml-2 font-normal text-[#ef4444] text-[10px] normal-case">Changes update all WhatsApp + Call CTAs on the public site</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Phone</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} className={inputClass} placeholder="+91 98765 43210" />
          </div>
          <div>
            <label className={labelClass}>WhatsApp Number
              <span className="ml-1 text-[#ef4444]">(digits only, e.g. 919876543210)</span>
            </label>
            <input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} className={inputClass} placeholder="919876543210" />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} placeholder="info@revivefightclub.com" />
          </div>
        </div>
      </div>

      <div className="bg-[#111312] border border-white/[0.08] p-5 space-y-4">
        <h3 className="font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider text-[#9ca3af]">Address</h3>
        <div>
          <label className={labelClass}>Street Address</label>
          <input value={address} onChange={e => setAddress(e.target.value)} className={inputClass} placeholder="123 Frazer Town Road" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>City</label>
            <input value={city} onChange={e => setCity(e.target.value)} className={inputClass} placeholder="Bengaluru" />
          </div>
          <div>
            <label className={labelClass}>State</label>
            <input value={state} onChange={e => setState(e.target.value)} className={inputClass} placeholder="Karnataka" />
          </div>
          <div>
            <label className={labelClass}>Postal Code</label>
            <input value={postalCode} onChange={e => setPostalCode(e.target.value)} className={inputClass} placeholder="560005" />
          </div>
        </div>
        <div>
          <label className={labelClass}>Google Maps URL</label>
          <input value={googleMaps} onChange={e => setGoogleMaps(e.target.value)} className={inputClass} placeholder="https://maps.google.com/..." />
        </div>
      </div>

      <div className="bg-[#111312] border border-white/[0.08] p-5 space-y-4">
        <h3 className="font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider text-[#9ca3af]">Social Media</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Instagram URL</label>
            <input value={instagram} onChange={e => setInstagram(e.target.value)} className={inputClass} placeholder="https://instagram.com/revivefightclub" />
          </div>
          <div>
            <label className={labelClass}>Facebook URL</label>
            <input value={facebook} onChange={e => setFacebook(e.target.value)} className={inputClass} placeholder="https://facebook.com/..." />
          </div>
          <div>
            <label className={labelClass}>YouTube URL</label>
            <input value={youtube} onChange={e => setYoutube(e.target.value)} className={inputClass} placeholder="https://youtube.com/..." />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={saving} className="bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider px-6 py-2.5 hover:bg-white transition-colors disabled:opacity-50">
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </div>
    </form>
  )
}
