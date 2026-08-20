import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Terms of Service | Revive Fight Club',
  description: 'Terms and conditions for using Revive Fight Club services, facilities and website.',
  alternates: {
    canonical: 'https://revivefightclub.com/terms-of-service',
  },
}

export default function TermsOfServicePage() {
  const lastUpdated = 'August 2025'

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: [
        'By accessing our website, booking a trial class, or using our facilities, you agree to be bound by these Terms of Service.',
        'If you do not agree to these terms, please do not use our services.',
        'We reserve the right to update these terms at any time. Continued use of our services constitutes acceptance of revised terms.',
      ],
    },
    {
      title: '2. Membership & Bookings',
      content: [
        'Trial class bookings are subject to availability and confirmation by our team.',
        'Memberships are personal and non-transferable.',
        'Members must adhere to class schedules. Late arrivals may be refused entry at the instructor\'s discretion.',
        'Revive Fight Club reserves the right to cancel or reschedule classes with reasonable notice.',
      ],
    },
    {
      title: '3. Payments & Refunds',
      content: [
        'All membership fees are payable in advance and are non-refundable unless otherwise agreed in writing.',
        'trial classes are offered at our discretion and are limited to one per person.',
        'In the event of a class cancellation by us, alternative sessions or credits will be offered.',
        'Chargebacks or payment disputes must be raised with us directly before contacting your bank.',
      ],
    },
    {
      title: '4. Health & Safety',
      content: [
        'All members and visitors must complete a health declaration before participating in classes.',
        'Participation in combat sports and martial arts involves inherent risks. You acknowledge and accept these risks.',
        'Members with existing medical conditions must obtain clearance from a qualified physician before training.',
        'Any injury sustained during training must be reported to staff immediately.',
        'Revive Fight Club is not liable for injuries resulting from failure to follow instructor guidance or safety rules.',
      ],
    },
    {
      title: '5. Code of Conduct',
      content: [
        'All members must treat fellow members, trainers, and staff with respect at all times.',
        'Aggressive behaviour, discrimination, harassment, or bullying will result in immediate termination of membership without refund.',
        'Appropriate gym attire must be worn at all times. Proper footwear is required in all areas except the mat.',
        'Mobile phone use during classes is prohibited out of respect for trainers and fellow members.',
        'Members are responsible for personal belongings. Revive Fight Club is not liable for loss or theft.',
      ],
    },
    {
      title: '6. Facility Rules',
      content: [
        'Members must sign in upon arrival for every session.',
        'Equipment must be sanitised and returned after each use.',
        'Food is not permitted on the gym floor. Water bottles are allowed.',
        'CCTV operates throughout the facility for safety purposes.',
        'Revive Fight Club reserves the right to refuse entry to any person at its sole discretion.',
      ],
    },
    {
      title: '7. Intellectual Property',
      content: [
        'All content on our website — including text, images, logos, and videos — is the property of Revive Fight Club.',
        'You may not reproduce, distribute, or use our content without prior written permission.',
      ],
    },
    {
      title: '8. Limitation of Liability',
      content: [
        'To the fullest extent permitted by law, Revive Fight Club shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services.',
        'Our total liability for any claim shall not exceed the amount paid by you in the preceding 30 days.',
      ],
    },
    {
      title: '9. Governing Law',
      content: [
        'These terms shall be governed by and construed in accordance with the laws of India.',
        'Any disputes shall be subject to the exclusive jurisdiction of the courts of Bengaluru, Karnataka.',
      ],
    },
    {
      title: '10. Contact',
      content: [
        'For any questions regarding these Terms of Service, please contact us at:',
        'Revive Fight Club, Frazer Town, Bengaluru, Karnataka, India',
        'Email: info@revivefightclub.com',
      ],
    },
  ]

  return (
    <>
      <Navbar />
      <main id="main" className="min-h-screen pt-14 md:pt-20" style={{ background: '#0d0c0b' }}>

        {/* Hero */}
        <section className="py-16 md:py-20 border-b border-white/[0.07]">
          <div className="max-w-[900px] mx-auto px-5 md:px-16">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-[#ff571a]" />
              <p className="font-[family-name:var(--font-body)] text-xs font-bold tracking-[0.18em] uppercase text-[#ff571a]">
                Legal
              </p>
            </div>
            <h1 className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase leading-tight tracking-[-0.02em] text-[clamp(32px,5vw,56px)] mb-4">
              Terms of Service
            </h1>
            <p className="font-[family-name:var(--font-body)] text-sm text-[#4b5563]">
              Last updated: {lastUpdated}
            </p>
            <p className="font-[family-name:var(--font-body)] text-base text-[#c8c4bf] mt-4 max-w-xl leading-relaxed">
              Please read these terms carefully before using our facilities or services. These terms apply to all members, visitors, and users of the Revive Fight Club website.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="max-w-[900px] mx-auto px-5 md:px-16 space-y-12">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase text-lg tracking-tight mb-5" style={{ paddingLeft: '1rem' }}>
                  {section.title}
                </h2>
                <ul className="space-y-3">
                  {section.content.map((item, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#ff571a]/60 mt-2 shrink-0" />
                      <p className="font-[family-name:var(--font-body)] text-[#c8c4bf] leading-relaxed text-sm md:text-base">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
