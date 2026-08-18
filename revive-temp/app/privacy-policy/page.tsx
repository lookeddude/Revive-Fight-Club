import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy | Revive Fight Club',
  description: 'Privacy Policy for Revive Fight Club — how we collect, use and protect your personal data.',
  robots: { index: true, follow: true },
}

export default function PrivacyPolicyPage() {
  const lastUpdated = 'August 2025'

  const sections = [
    {
      title: '1. Information We Collect',
      content: [
        'Personal identification information (name, email address, phone number) when you book a trial class, fill a contact form, or create an account.',
        'Payment details processed securely through third-party payment processors. We do not store card information on our servers.',
        'Usage data including pages visited, time spent, and device information collected automatically through cookies and analytics tools.',
        'CCTV footage for safety and security within our gym premises.',
      ],
    },
    {
      title: '2. How We Use Your Information',
      content: [
        'To process and manage trial class bookings and membership enquiries.',
        'To communicate with you regarding your bookings, payments, and class schedules.',
        'To send promotional offers, newsletters, and updates — you may opt out at any time.',
        'To improve our website, services, and overall member experience.',
        'To comply with legal obligations and resolve disputes.',
      ],
    },
    {
      title: '3. Data Sharing',
      content: [
        'We do not sell, rent, or trade your personal data to third parties.',
        'We may share data with trusted service providers (e.g. payment processors, email services) who assist in our operations, bound by confidentiality agreements.',
        'We may disclose information if required by law, court order, or governmental authority.',
      ],
    },
    {
      title: '4. Cookies',
      content: [
        'Our website uses cookies to enhance your browsing experience and analyse site traffic.',
        'You may disable cookies in your browser settings, though some features may not function correctly.',
        'We use Google Analytics to understand user behaviour — data is anonymised and aggregated.',
      ],
    },
    {
      title: '5. Data Security',
      content: [
        'We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction.',
        'All data transmissions are encrypted using SSL/TLS.',
        'Despite our efforts, no method of transmission over the internet is 100% secure.',
      ],
    },
    {
      title: '6. Data Retention',
      content: [
        'We retain your personal data for as long as necessary to fulfil the purposes described in this policy or as required by law.',
        'You may request deletion of your account and associated data at any time by contacting us.',
      ],
    },
    {
      title: '7. Your Rights',
      content: [
        'Right to access — you may request a copy of the personal data we hold about you.',
        'Right to rectification — you may ask us to correct inaccurate or incomplete data.',
        'Right to erasure — you may request deletion of your personal data in certain circumstances.',
        'Right to withdraw consent — where processing is based on consent, you may withdraw it at any time.',
        'To exercise any of these rights, please contact us at info@revivefightclub.com.',
      ],
    },
    {
      title: '8. Third-Party Links',
      content: [
        'Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites.',
      ],
    },
    {
      title: '9. Changes to This Policy',
      content: [
        'We may update this Privacy Policy periodically. Changes will be posted on this page with a revised date.',
        'Continued use of our services after changes constitutes acceptance of the updated policy.',
      ],
    },
    {
      title: '10. Contact Us',
      content: [
        'For any privacy-related queries, contact us at:',
        'Revive Fight Club, Frazer Town, Bengaluru, Karnataka, India',
        'Email: info@revivefightclub.com',
      ],
    },
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-14 md:pt-20" style={{ background: '#0d0c0b' }}>

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
              Privacy Policy
            </h1>
            <p className="font-[family-name:var(--font-body)] text-sm text-[#4b5563]">
              Last updated: {lastUpdated}
            </p>
            <p className="font-[family-name:var(--font-body)] text-base text-[#c8c4bf] mt-4 max-w-xl leading-relaxed">
              At Revive Fight Club, we are committed to protecting your personal information and your right to privacy. This policy explains how we collect, use, and safeguard your data.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="max-w-[900px] mx-auto px-5 md:px-16 space-y-12">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase text-lg tracking-tight mb-5" style={{ borderLeft: '3px solid #ff571a', paddingLeft: '1rem' }}>
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
