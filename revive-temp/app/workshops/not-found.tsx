import Link from 'next/link'

export default function WorkshopNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20" style={{ background: '#0E0C10' }}>
      <div className="text-center px-5">
        <h1 className="font-[family-name:var(--font-outfit)] font-black text-[#FCFDFD] uppercase text-[clamp(60px,10vw,120px)] leading-none tracking-tighter mb-4 opacity-10">
          404
        </h1>
        <h2 className="font-[family-name:var(--font-outfit)] font-black text-[#FCFDFD] uppercase text-[clamp(24px,4vw,36px)] tracking-[-0.02em] mb-4">
          WORKSHOP NOT FOUND
        </h2>
        <p className="font-[family-name:var(--font-body)] text-[#A0A0A8] max-w-md mx-auto mb-8">
          The event you're looking for doesn't exist, has been cancelled, or the link is incorrect.
        </p>
        <Link
          href="/workshops"
          className="inline-flex items-center justify-center gap-2 font-[family-name:var(--font-body)] text-sm font-black tracking-[0.14em] uppercase px-8 py-4 bg-[#DC2626] text-white hover:bg-white hover:text-black transition-all duration-300"
        >
          VIEW ALL WORKSHOPS
        </Link>
      </div>
    </div>
  )
}
