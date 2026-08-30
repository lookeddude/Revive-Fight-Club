'use client'

interface WorkshopStatusBadgeProps {
  status: string
  ctaLabel: string
  pricingType: string
  price: number | null
}

export function WorkshopStatusBadge({ status, ctaLabel, pricingType, price }: WorkshopStatusBadgeProps) {
  const isFree = pricingType === 'free'
  const isClosed = status === 'closed'
  const isFull = status === 'full'
  
  if (isClosed || isFull) {
    return (
      <span
        className="font-[family-name:var(--font-body)] text-[11px] font-bold tracking-[0.16em] uppercase px-2.5 py-1 text-[#A0A0A8]"
        style={{ background: 'rgba(14,12,16,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        {isFull ? 'FULLY BOOKED' : 'CLOSED'}
      </span>
    )
  }

  if (isFree) {
    return (
      <span
        className="font-[family-name:var(--font-body)] text-[11px] font-bold tracking-[0.16em] uppercase px-2.5 py-1 text-[#FCFDFD]"
        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
      >
        FREE
      </span>
    )
  }

  return (
    <span
      className="font-[family-name:var(--font-body)] text-[11px] font-bold tracking-[0.16em] uppercase px-2.5 py-1 text-[#FCFDFD]"
      style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
    >
      ₹{price}
    </span>
  )
}
