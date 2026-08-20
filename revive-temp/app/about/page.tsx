import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { getBusinessSettings, getActivePrograms } from '@/lib/data/content'
import { getFirstProgramSlides } from '@/lib/data/programSlides'
import { WhatsAppCTA } from '@/components/ui/WhatsAppCTA'
import { DirectionsCTA } from '@/components/ui/DirectionsCTA'
import { PhoneCTA } from '@/components/ui/PhoneCTA'
import { GsapHeroReveal } from '@/components/gsap/GsapHeroReveal'
import { GsapFadeReveal } from '@/components/gsap/GsapFadeReveal'
import { GsapStagger } from '@/components/gsap/GsapStagger'
import { GsapCountUp } from '@/components/gsap/GsapCountUp'

export const metadata: Metadata = {
  title: 'About Revive Fight Club | MMA Gym in Bengaluru',
  description: "Revive Fight Club — Bengaluru's premier combat sports and fitness gym in Fraser Town. MMA, Boxing, Kickboxing, Jiu-Jitsu and Muay Thai. Rated 5.0 on Google.",
  alternates: {
    canonical: 'https://revivefightclub.com/about',
  },
  openGraph: {
    url: 'https://revivefightclub.com/about',
  },
}

export const revalidate = 3600

export default async function AboutPage() {
  const [settings, programs] = await Promise.all([
    getBusinessSettings(),
    getActivePrograms(),
  ])

  const slideImages = await getFirstProgramSlides(programs.map(p => p.id))

  return (
    <>
      <Navbar />
      <main id="main" className="min-h-screen pt-14 md:pt-20" style={{ background: '#0d0c0b' }}>

        {/* ── HERO ─────────────────────────────────────────────── */}
        <GsapHeroReveal>
        <section className="relative py-20 md:py-32 overflow-hidden" style={{ background: 'linear-gradient(160deg, #0d0c0b 0%, #111009 100%)' }}>
          {/* Background glow */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(255,87,26,0.07) 0%, transparent 60%)' }} aria-hidden="true" />
          {/* Large watermark */}
          <span className="absolute right-0 top-1/2 -translate-y-1/2 font-[family-name:var(--font-outfit)] font-black uppercase select-none pointer-events-none hidden lg:block" style={{ fontSize: '180px', lineHeight: 1, color: 'transparent', WebkitTextStroke: '1px rgba(255,87,26,0.06)', letterSpacing: '-0.04em' }} aria-hidden="true">RFC</span>

          <div className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-16">
            <div className="flex items-center gap-3 mb-6 gsap-label">
              <div className="w-8 h-px bg-[#ff571a]" aria-hidden="true" />
              <p className="font-[family-name:var(--font-body)] text-xs font-black tracking-[0.22em] uppercase text-[#ff571a]">Our Story</p>
            </div>

            <h1
              className="gsap-heading font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase leading-[0.9] tracking-[-0.04em] mb-8 max-w-4xl"
              style={{ fontSize: 'clamp(42px, 7vw, 96px)' }}
            >
              BUILT FOR THOSE<br />
              WHO <span className="text-[#ff571a]">FIGHT</span><br />
              FOR MORE
            </h1>

            <p className="gsap-text font-[family-name:var(--font-body)] text-lg md:text-xl text-[#c8c4bf] max-w-2xl leading-relaxed" style={{ paddingLeft: '1.5rem' }}>
              Revive Fight Club is Bengaluru&apos;s premier destination for combat sports and transformative fitness training — where beginners find their footing and champions are forged.
            </p>

            {/* Quick stat row */}
            <div className="flex flex-wrap gap-6 mt-12 gsap-extra">
              {[
                { value: 5.0, decimals: 1, label: 'Google Rating', accent: true },
                { value: 4, decimals: 0, label: 'Programs', accent: false },
                { label: '3rd', labelStatic: true, subLabel: 'Floor, MM Road', accent: false },
                { label: '2024', labelStatic: true, subLabel: 'Established', accent: false },
              ].map((stat, i) => (
                <div key={stat.label} className="flex flex-col" style={{ paddingLeft: '1rem' }}>
                  {stat.labelStatic ? (
                    <span className="font-[family-name:var(--font-outfit)] font-black leading-none" style={{ fontSize: '32px', color: stat.accent ? '#ff571a' : '#f0ede8' }}>{stat.label}</span>
                  ) : (
                    <GsapCountUp
                      target={stat.value!}
                      decimals={stat.decimals!}
                      duration={1.6}
                      className="font-[family-name:var(--font-outfit)] font-black leading-none"
                      style={{ fontSize: '32px', color: stat.accent ? '#ff571a' : '#f0ede8' }}
                    />
                  )}
                  <span className="font-[family-name:var(--font-body)] text-xs text-[#4a4540] uppercase tracking-[0.15em] mt-1">{stat.label === stat.label && stat.labelStatic ? stat.subLabel : stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        </GsapHeroReveal>

        {/* ── OUR STORY ─────────────────────────────────────────── */}
        <section className="py-16 md:py-24" style={{ background: '#0a0908', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="max-w-[1280px] mx-auto px-5 md:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <GsapFadeReveal direction="left">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-6 h-px bg-[#ff571a]" aria-hidden="true" />
                  <p className="font-[family-name:var(--font-body)] text-xs font-black tracking-[0.22em] uppercase text-[#ff571a]">Who We Are</p>
                </div>
                <h2 className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase leading-[0.92] tracking-[-0.03em] mb-6" style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
                  MORE THAN A GYM.<br />
                  <span className="text-[#ff571a]">A COMMUNITY.</span>
                </h2>
                <div className="flex flex-col gap-4 font-[family-name:var(--font-body)] text-[15px] text-[#c8c4bf] leading-[1.85]">
                  <p>
                    Revive Fight Club was founded with one clear purpose — to bring world-class combat sports training to Bengaluru. Located on the 3rd floor of 157, MM Road in Frazer Town, we are more than just a gym. We are a place where discipline is built, limits are broken, and real transformation happens.
                  </p>
                  <p>
                    From our first class to today, we have trained beginners who had never thrown a punch, office professionals looking for a powerful stress outlet, and serious competitors who have gone on to fight at amateur and professional levels. Every one of them started where you are right now — curious, nervous, and ready.
                  </p>
                  <p>
                    Our coaches bring years of real-world experience from MMA, Kickboxing, Bodybuilding, and Weight Management. They do not just teach technique — they invest in your journey, track your progress, and push you to levels you did not think were possible.
                  </p>
                </div>
              </div>
              </GsapFadeReveal>

              {/* Values grid */}
              <GsapStagger stagger={0.08} delay={100}>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: '⚡', title: 'Expert Coaching', desc: 'Coaches with real competitive backgrounds and years of teaching experience.' },
                  { icon: '🥊', title: 'All Levels Welcome', desc: 'Complete beginners to experienced fighters — we meet you where you are.' },
                  { icon: '🏆', title: 'Proven Results', desc: 'Rated 5.0 on Google. Real transformations, real testimonials.' },
                  { icon: '🤝', title: 'Tight Community', desc: 'Train alongside people who push each other and celebrate every win.' },
                ].map(v => (
                  <div key={v.title} className="gsap-item p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span className="text-2xl mb-3 block">{v.icon}</span>
                    <p className="font-[family-name:var(--font-body)] text-sm font-black uppercase  text-[#f0ede8] mb-2">{v.title}</p>
                    <p className="font-[family-name:var(--font-body)] text-[12px] text-[#9ca3af] leading-relaxed">{v.desc}</p>
                  </div>
                ))}
              </div>
              </GsapStagger>
            </div>
          </div>
        </section>

        {/* ── OUR PROGRAMS ──────────────────────────────────────── */}
        <section className="py-16 md:py-20" style={{ background: '#0d0c0b', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="max-w-[1280px] mx-auto px-5 md:px-16">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-px bg-[#ff571a]" aria-hidden="true" />
                  <p className="font-[family-name:var(--font-body)] text-xs font-black tracking-[0.22em] uppercase text-[#ff571a]">What We Offer</p>
                </div>
                <h2 className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase leading-[0.92] tracking-[-0.03em]" style={{ fontSize: 'clamp(26px, 4vw, 44px)' }}>
                  WORLD-CLASS <span className="text-[#ff571a]">PROGRAMS</span>
                </h2>
              </div>
              <Link href="/programs" className="inline-flex items-center gap-2 font-[family-name:var(--font-body)] text-xs font-black tracking-[0.15em] uppercase text-[#ff571a] hover:text-[#ff8a5a] transition-colors flex-shrink-0">
                View All Programs
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>

            {programs.length > 0 ? (
              <GsapStagger stagger={0.06} delay={0}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {programs.map((p, i) => {
                  const img = slideImages[p.id] ?? p.image_path ?? null
                  return (
                    <Link
                      key={p.id}
                      href={`/programs/${p.slug}`}
                      className="group relative overflow-hidden flex flex-col justify-end transition-all duration-300"
                      style={{ height: '260px', border: '1px solid rgba(255,255,255,0.06)' }}
                      aria-label={`View ${p.name} program`}
                    >
                      {/* Background image or branded fallback */}
                      {img ? (
                        <Image
                          src={img}
                          alt={p.name}
                          fill
                          className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1a1208 0%, #0d0c0b 100%)' }} />
                      )}
                      {/* Gradient overlay */}
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,12,11,0.97) 0%, rgba(13,12,11,0.4) 55%, transparent 100%)' }} />
                      {/* Orange hover tint */}
                      <div className="absolute inset-0 bg-[#ff571a]/0 group-hover:bg-[#ff571a]/5 transition-all duration-500" />

                      {/* Number */}
                      <span className="absolute top-4 right-4 font-[family-name:var(--font-outfit)] font-black text-3xl" style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.1)' }} aria-hidden="true">
                        {String(i + 1).padStart(2, '0')}
                      </span>

                      {/* Content */}
                      <div className="relative z-10 p-5">
                        <p className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] text-lg uppercase tracking-tight group-hover:text-[#ff571a] transition-colors leading-tight mb-1">{p.name}</p>
                        {p.short_description && (
                          <p className="font-[family-name:var(--font-body)] text-sm text-[#c8c4bf] leading-snug line-clamp-2 group-hover:text-[#aaa09a] transition-colors">{p.short_description}</p>
                        )}
                        <div className="w-0 h-0.5 bg-[#ff571a] group-hover:w-8 transition-all duration-300 mt-3" aria-hidden="true" />
                      </div>
                    </Link>
                  )
                })}
              </div>
              </GsapStagger>
            ) : (
              <div className="py-10 text-center">
                <Link href="/programs" className="inline-flex items-center gap-2 font-[family-name:var(--font-body)] text-sm text-[#ff571a] hover:text-[#ff8a5a] transition-colors">
                  View Our Programs
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ── MISSION + WHY US ──────────────────────────────────── */}
        <GsapFadeReveal>
        <section className="py-16 md:py-24" style={{ background: '#080706', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="max-w-[1280px] mx-auto px-5 md:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Mission */}
              <div className="lg:col-span-2 p-8 md:p-10" style={{ background: 'linear-gradient(135deg, rgba(255,87,26,0.06) 0%, rgba(12,10,8,1) 70%)', border: '1px solid rgba(255,87,26,0.15)' }}>
                <p className="font-[family-name:var(--font-body)] text-xs font-black tracking-[0.22em] uppercase text-[#ff571a] mb-4">Our Mission</p>
                <h2 className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase leading-[0.92] tracking-[-0.03em] mb-6" style={{ fontSize: 'clamp(24px, 3.5vw, 40px)' }}>
                  TRAIN HARD.<br />FIGHT SMART.<br /><span className="text-[#ff571a]">LIVE BETTER.</span>
                </h2>
                <p className="font-[family-name:var(--font-body)] text-[15px] text-[#c8c4bf] leading-[1.85] mb-4">
                  Our mission is simple — make elite-level combat sports and fitness training accessible to everyone. Whether you want to lose weight, build muscle, learn self-defence, or compete professionally, Revive Fight Club has a program designed for your goal.
                </p>
                <p className="font-[family-name:var(--font-body)] text-[15px] text-[#c8c4bf] leading-[1.85]">
                  We believe that the discipline you build on the mat translates directly into every area of your life — your career, your mindset, your confidence. That is why we do not just train bodies here. We build complete athletes and stronger people.
                </p>
              </div>

              {/* Why us bullets */}
              <div className="flex flex-col gap-3">
                <p className="font-[family-name:var(--font-body)] text-xs font-black tracking-[0.22em] uppercase text-[#ff571a] mb-2">Why Choose Us</p>
                {[
                  'Small batch training for personalised attention',
                  'Structured beginner-to-advanced curricula',
                  'Real coaches with competitive fight experience',
                  'Clean, premium-grade training facility',
                  'Flexible batch timings for working professionals',
                  'Proven track record — 5.0 Google rating',
                  'Community that genuinely supports your progress',
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-3 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff571a] flex-shrink-0 mt-1.5" aria-hidden="true" />
                    <p className="font-[family-name:var(--font-body)] text-[13px] text-[#9ca3af] leading-snug">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        </GsapFadeReveal>

        {/* ── GOOGLE REVIEWS ────────────────────────────────────── */}
        <GsapFadeReveal direction="up" duration={0.6}>
        <section className="py-14 md:py-20" style={{ background: '#0d0c0b', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="max-w-[1280px] mx-auto px-5 md:px-16">
            <div className="flex flex-col md:flex-row md:items-center gap-8 p-8 md:p-10" style={{ background: 'rgba(245,166,35,0.04)', border: '1px solid rgba(245,166,35,0.12)' }}>
              {/* Rating block */}
              <div className="flex-shrink-0 text-center px-6 py-4" style={{ borderRight: '1px solid rgba(245,166,35,0.12)' }}>
                <p className="font-[family-name:var(--font-outfit)] font-black text-[#f5a623] leading-none" style={{ fontSize: '72px', letterSpacing: '-0.05em' }}>5.0</p>
                <div className="flex justify-center gap-1 my-2">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} className="w-5 h-5 fill-[#f5a623]" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  ))}
                </div>
                <p className="font-[family-name:var(--font-body)] text-xs text-[#9ca3af] uppercase ">Google Rating</p>
              </div>

              {/* Review text */}
              <div className="flex-1">
                <p className="font-[family-name:var(--font-body)] text-xs font-black tracking-[0.22em] uppercase text-[#f5a623] mb-3">What Our Members Say</p>
                <h3 className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase leading-tight tracking-tight mb-4" style={{ fontSize: 'clamp(20px, 2.5vw, 30px)' }}>
                  RATED BENGALURU&apos;S BEST<br /><span className="text-[#f5a623]">COMBAT SPORTS GYM</span>
                </h3>
                <p className="font-[family-name:var(--font-body)] text-[14px] text-[#9ca3af] leading-relaxed mb-5">
                  Our members don&apos;t just train here — they transform here. Across every program, members consistently rate Revive Fight Club 5 stars for coaching quality, facility standards, and the results they achieve. Read their stories and see why Revive Fight Club is Bengaluru&apos;s top-rated gym.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/reviews"
                    className="inline-flex items-center gap-2 font-[family-name:var(--font-body)] text-xs font-black tracking-[0.14em] uppercase px-6 py-3 text-black transition-all duration-300"
                    style={{ background: 'linear-gradient(135deg, #f5a623, #e09010)' }}
                  >
                    Read All Reviews
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        </GsapFadeReveal>

        {/* ── FIND US ───────────────────────────────────────────── */}
        <section className="py-16 md:py-24" style={{ background: '#080706', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="max-w-[1280px] mx-auto px-5 md:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

              {/* Left: location info */}
              <GsapFadeReveal direction="left">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-6 h-px bg-[#ff571a]" aria-hidden="true" />
                  <p className="font-[family-name:var(--font-body)] text-xs font-black tracking-[0.22em] uppercase text-[#ff571a]">Find Us</p>
                </div>
                <h2 className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase leading-[0.92] tracking-[-0.03em] mb-8" style={{ fontSize: 'clamp(26px, 4vw, 44px)' }}>
                  COME TRAIN<br /><span className="text-[#ff571a]">WITH US</span>
                </h2>

                {/* Address */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-4 h-px bg-[#ff571a]" aria-hidden="true" />
                  <p className="font-[family-name:var(--font-body)] text-xs font-black tracking-[0.2em] uppercase text-[#ff571a]">Location</p>
                </div>
                <a
                  href={settings?.google_maps_url ?? 'https://maps.app.goo.gl/HDkr8hrYK1Tuop7G6?g_st=ac'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-start gap-3 mb-7"
                  aria-label="Open in Google Maps"
                >
                  <svg className="w-5 h-5 text-[#ff571a] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <address className="not-italic font-[family-name:var(--font-body)] text-[15px] text-[#c8c4bf] leading-relaxed group-hover:text-[#c8c6c5] transition-colors">
                    {settings?.address
                      ? <>{settings.address}<br />{settings.city}{settings.state ? `, ${settings.state}` : ''}{settings.postal_code ? ` – ${settings.postal_code}` : ''}</>
                      : <>3rd floor, 157, MM Road,<br />Frazer Town, Bengaluru,<br />Karnataka 560005</>
                    }
                  </address>
                </a>

                {/* Opening hours */}
                {settings?.opening_hours && Object.keys(settings.opening_hours as Record<string, string>).length > 0 && (
                  <div className="mb-7">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-4 h-px bg-[#ff571a]" aria-hidden="true" />
                      <p className="font-[family-name:var(--font-body)] text-xs font-black tracking-[0.2em] uppercase text-[#ff571a]">Opening Hours</p>
                    </div>
                    <dl className="flex flex-col gap-1.5">
                      {Object.entries(settings.opening_hours as Record<string, string>).map(([day, hours]) => (
                        <div key={day} className="flex justify-between max-w-xs py-1.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <dt className="font-[family-name:var(--font-body)] text-[13px] text-[#c8c4bf]">{day}</dt>
                          <dd className="font-[family-name:var(--font-body)] text-[13px] text-[#e2e3e1] font-semibold">{hours}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}

                {/* CTAs */}
                <div className="flex flex-col gap-3">
                  <DirectionsCTA googleMapsUrl={settings?.google_maps_url ?? null} variant="secondary" />
                  <PhoneCTA phone={settings?.phone ?? null} variant="secondary" />
                  <WhatsAppCTA whatsappNumber={settings?.whatsapp_number ?? null} context="general" variant="secondary" />
                  {settings?.instagram_url && (
                    <a
                      href={settings.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Revive Fight Club on Instagram"
                      className="group inline-flex items-center gap-3 font-[family-name:var(--font-body)] text-sm font-bold tracking-[0.1em] uppercase text-[#e2e3e1] transition-all duration-300 px-5 py-3 hover:border-white/20"
                      style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}
                    >
                      <svg className="w-4 h-4 text-[#E1306C] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      Follow on Instagram
                    </a>
                  )}
                </div>
              </div>
              </GsapFadeReveal>

              {/* Right: Mission card */}
              <GsapFadeReveal direction="right" delay={100}>
              <div className="flex flex-col gap-5">
                <div className="p-7 flex-1" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="font-[family-name:var(--font-body)] text-xs font-black tracking-[0.22em] uppercase text-[#ff571a] mb-4">Getting Here</p>
                  <p className="font-[family-name:var(--font-body)] text-[14px] text-[#9ca3af] leading-relaxed mb-5">
                    We are located on the 3rd floor of 157, MM Road, Frazer Town — one of Bengaluru&apos;s most well-connected neighbourhoods. Easily accessible by auto, cab, or personal vehicle. Street parking is available nearby.
                  </p>
                  <ul className="flex flex-col gap-3">
                    {[
                      'Near Frazer Town Bus Stop',
                      'Accessible via MG Road / CMH Road',
                      'Auto & cab friendly location',
                      'Street parking available',
                    ].map((tip, i) => (
                      <li key={i} className="flex items-center gap-3 font-[family-name:var(--font-body)] text-[13px] text-[#9ca3af]">
                        <div className="w-1 h-1 rounded-full bg-[#ff571a] flex-shrink-0" aria-hidden="true" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mini CTA */}
                <div className="p-6 text-center" style={{ background: 'linear-gradient(135deg, rgba(255,87,26,0.08) 0%, rgba(10,8,6,1) 100%)', border: '1px solid rgba(255,87,26,0.15)' }}>
                  <p className="font-[family-name:var(--font-body)] text-xs font-black tracking-[0.2em] uppercase text-[#ff571a] mb-2">First Class Free</p>
                  <p className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase text-xl mb-4">TRY BEFORE YOU JOIN</p>
                  <p className="font-[family-name:var(--font-body)] text-[13px] text-[#9ca3af] mb-5">No commitment. No pressure. Just come in, try a class, and see for yourself.</p>
                  <Link
                    href="/book-trial"
                    className="inline-flex items-center gap-2 font-[family-name:var(--font-body)] text-xs font-black tracking-[0.14em] uppercase px-7 py-3.5 text-black transition-all duration-300"
                    style={{ background: 'linear-gradient(135deg, #ff571a, #e03020)', boxShadow: '0 4px 20px rgba(255,87,26,0.3)' }}
                  >
                    BOOK TRIAL
                  </Link>
                </div>
              </div>
              </GsapFadeReveal>
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ─────────────────────────────────────────── */}
        <GsapFadeReveal direction="up" duration={0.7}>
        <section className="py-20 md:py-28 text-center relative overflow-hidden" style={{ background: '#0d0c0b', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(255,87,26,0.07) 0%, transparent 60%)' }} aria-hidden="true" />
          <div className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-16">
            <p className="font-[family-name:var(--font-body)] text-xs font-black tracking-[0.22em] uppercase text-[#ff571a] mb-4">Your Journey Starts Here</p>
            <h2 className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase leading-[0.9] tracking-[-0.04em] mb-6" style={{ fontSize: 'clamp(32px, 5vw, 64px)' }}>
              STOP WAITING.<br />START <span className="text-[#ff571a]">FIGHTING.</span>
            </h2>
            <p className="font-[family-name:var(--font-body)] text-[15px] text-[#9ca3af] max-w-lg mx-auto leading-relaxed mb-10">
              Join hundreds of members who chose Revive Fight Club and never looked back. Your first class is free — come see what all the 5-star reviews are about.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/book-trial"
                className="inline-flex items-center gap-2 font-[family-name:var(--font-body)] text-sm font-black tracking-[0.14em] uppercase px-8 py-4 text-black transition-all duration-300 hover:scale-[1.03]"
                style={{ background: 'linear-gradient(135deg, #ff571a, #e03020)', boxShadow: '0 4px 24px rgba(255,87,26,0.4)' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                BOOK TRIAL
              </Link>
              <Link
                href="/programs"
                className="inline-flex items-center gap-2 font-[family-name:var(--font-body)] text-sm font-bold tracking-[0.12em] uppercase px-8 py-4 text-[#e2e3e1] transition-all duration-300 hover:border-white/25"
                style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)' }}
              >
                EXPLORE PROGRAMS
              </Link>
            </div>
          </div>
        </section>
        </GsapFadeReveal>

      </main>
      <Footer />
    </>
  )
}
