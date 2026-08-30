'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface WorkshopRegistrationFormProps {
  workshopId: string
  slug: string
  title: string
  pricingType: string
  price: number | null
}

export function WorkshopRegistrationForm({ workshopId, slug, title, pricingType, price }: WorkshopRegistrationFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    // Simulate submission delay
    await new Promise(res => setTimeout(res, 1000))
    
    // Fake success redirect
    const fakeRegId = `REG-${Math.floor(Math.random() * 10000)}`
    router.push(`/workshops/${slug}/success?reg=${fakeRegId}`)
    
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-500 font-[family-name:var(--font-body)] text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="fullName" className="font-[family-name:var(--font-body)] text-[12px] font-bold tracking-[0.1em] uppercase text-[#707078]">
          Full Name
        </label>
        <input 
          type="text" 
          id="fullName" 
          required 
          className="bg-transparent border border-white/20 p-4 text-[#FCFDFD] font-[family-name:var(--font-body)] focus:border-[#DC2626] focus:outline-none transition-colors"
          placeholder="Enter your full name"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="font-[family-name:var(--font-body)] text-[12px] font-bold tracking-[0.1em] uppercase text-[#707078]">
          Email Address
        </label>
        <input 
          type="email" 
          id="email" 
          required 
          className="bg-transparent border border-white/20 p-4 text-[#FCFDFD] font-[family-name:var(--font-body)] focus:border-[#DC2626] focus:outline-none transition-colors"
          placeholder="you@example.com"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="phone" className="font-[family-name:var(--font-body)] text-[12px] font-bold tracking-[0.1em] uppercase text-[#707078]">
          Phone Number
        </label>
        <input 
          type="tel" 
          id="phone" 
          required 
          className="bg-transparent border border-white/20 p-4 text-[#FCFDFD] font-[family-name:var(--font-body)] focus:border-[#DC2626] focus:outline-none transition-colors"
          placeholder="+91"
        />
      </div>

      <div className="pt-4 border-t border-white/10">
        <div className="flex justify-between items-center mb-6">
          <span className="font-[family-name:var(--font-body)] text-sm text-[#A0A0A8]">Total Amount</span>
          <span className="font-[family-name:var(--font-outfit)] text-xl font-bold text-[#FCFDFD]">
            {pricingType === 'free' ? 'FREE' : `₹${price}`}
          </span>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 font-[family-name:var(--font-body)] text-sm font-black tracking-[0.14em] uppercase px-8 py-4 transition-all duration-300 ${
            loading ? 'bg-white/20 text-white/50 cursor-not-allowed' : 'bg-[#DC2626] text-white hover:bg-white hover:text-black'
          }`}
        >
          {loading ? 'PROCESSING...' : (pricingType === 'free' ? 'REGISTER NOW' : 'PROCEED TO PAYMENT')}
        </button>
      </div>
    </form>
  )
}
