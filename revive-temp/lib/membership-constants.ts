// Shared membership constants — no 'use client', no server imports
// Safe to import from both Server and Client components

export const BATCH_META: Record<string, { title: string; subtitle: string; tag: string; accent: boolean; features: string[] }> = {
  beginners: {
    title: 'BEGINNERS',
    subtitle: 'Start your combat sports journey the right way.',
    tag: 'Most Popular',
    accent: false,
    features: ['MMA, Boxing, Muay Thai, BJJ', 'No experience needed', 'Structured curriculum', 'Morning & evening slots'],
  },
  fighters: {
    title: 'FIGHTERS',
    subtitle: 'Train like a professional. Compete at the highest level.',
    tag: '★ Elite Track',
    accent: true,
    features: ['Advanced sparring & drilling', 'Competition prep & cuts', 'Pro coaching by active fighters', 'Priority mat time'],
  },
  kids_weekday: {
    title: 'KIDS — WEEKDAY',
    subtitle: 'Mon–Fri. Discipline, fitness, and confidence.',
    tag: 'Ages 6–14',
    accent: false,
    features: ['Fun, structured classes', 'Self-defence fundamentals', 'Anti-bullying conditioning', 'Character development'],
  },
  kids_weekend: {
    title: 'KIDS — WEEKEND',
    subtitle: 'Sat & Sun. Active weekends for young warriors.',
    tag: 'Ages 6–14',
    accent: false,
    features: ['Weekend-only schedule', 'All levels welcome', 'Qualified youth coaches', 'Safe padded environment'],
  },
}

export const BATCH_ORDER = ['beginners', 'fighters', 'kids_weekday', 'kids_weekend']
