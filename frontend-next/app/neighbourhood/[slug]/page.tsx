import { Metadata } from 'next'

const NEIGHBOURHOODS: Record<string, { name: string; address: string; description: string; emoji: string; tag: string }> = {
  'king-west': {
    name: 'King West', address: '401 King St W, Toronto', emoji: '🍸', tag: 'Nightlife',
    description: 'King West is one of Toronto\'s most vibrant entertainment districts, known for its trendy restaurants, nightlife, and creative offices.',
  },
  'distillery': {
    name: 'Distillery District', address: '1 Distillery Lane, Toronto', emoji: '🏛️', tag: 'Historic',
    description: 'The Distillery District is a pedestrian-only historic district featuring Victorian-era industrial architecture, galleries, restaurants, and shops.',
  },
  'queen-west': {
    name: 'Queen West', address: '500 Queen St W, Toronto', emoji: '🎨', tag: 'Arts',
    description: 'Queen West is Toronto\'s arts and fashion hub, consistently ranked among the coolest neighbourhoods in the world.',
  },
  'midtown': {
    name: 'Midtown', address: '2300 Yonge St, Toronto', emoji: '🌳', tag: 'Families',
    description: 'Midtown Toronto offers a perfect balance of urban amenities and residential calm, with excellent transit and top-rated schools.',
  },
  'bloor-yonge': {
    name: 'Bloor-Yonge', address: '1 Bloor St E, Toronto', emoji: '🚇', tag: 'Transit',
    description: 'Bloor-Yonge is Toronto\'s most central intersection, offering unmatched transit access and urban convenience.',
  },
  'leslieville': {
    name: 'Leslieville', address: '1000 Queen St E, Toronto', emoji: '☕', tag: 'Cafés',
    description: 'Leslieville is a hip east-end neighbourhood known for its indie cafes, brunch spots, and young professional community.',
  },
  'kensington': {
    name: 'Kensington Market', address: '1 Augusta Ave, Toronto', emoji: '🌍', tag: 'Culture',
    description: 'Kensington Market is Toronto\'s most eclectic neighbourhood, a designated National Historic Site known for its multicultural food scene.',
  },
  'annex': {
    name: 'The Annex', address: '280 Bloor St W, Toronto', emoji: '📚', tag: 'Students',
    description: 'The Annex is a vibrant neighbourhood near U of T, known for its Victorian homes, bookstores, and lively Bloor Street.',
  },
  'liberty-village': {
    name: 'Liberty Village', address: '150 East Liberty St, Toronto', emoji: '💻', tag: 'Tech',
    description: 'Liberty Village is Toronto\'s tech hub, a converted industrial district popular with young professionals and startups.',
  },
  'roncesvalles': {
    name: 'Roncesvalles', address: '1 Roncesvalles Ave, Toronto', emoji: '🏡', tag: 'Village',
    description: 'Roncesvalles is a charming west-end village known for its Polish heritage, family-friendly atmosphere, and independent shops.',
  },
  'yorkville': {
    name: 'Yorkville', address: '100 Yorkville Ave, Toronto', emoji: '💎', tag: 'Luxury',
    description: 'Yorkville is Toronto\'s most luxurious neighbourhood, home to high-end boutiques, fine dining, and upscale condos.',
  },
  'danforth': {
    name: 'Danforth', address: '500 Danforth Ave, Toronto', emoji: '🍋', tag: 'Greek Town',
    description: 'The Danforth is Toronto\'s vibrant Greek Town, known for its authentic restaurants, festivals, and community spirit.',
  },
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const n = NEIGHBOURHOODS[slug]
  if (!n) return { title: 'Neighbourhood Not Found' }
  return {
    title: `${n.name} Toronto — Vibe Score, Walk Score & Safety | VibeMap`,
    description: `Discover the vibe of ${n.name} in Toronto. Walk score, transit score, safety score, nearby restaurants, schools, and AI-powered neighbourhood summary.`,
    keywords: `${n.name} Toronto, ${n.name} neighbourhood, Toronto real estate, walk score ${n.name}, ${n.name} safety`,
  }
}

export function generateStaticParams() {
  return Object.keys(NEIGHBOURHOODS).map((slug) => ({ slug }))
}

export default async function NeighbourhoodPage({ params }: Props) {
  const { slug } = await params
  const n = NEIGHBOURHOODS[slug]

  if (!n) {
    return (
      <main className="min-h-screen bg-[#060612] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Neighbourhood not found</h1>
          <a href="/" className="text-[#c8f542]">Back to VibeMap</a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#060612] text-[#f0f0ff] relative">
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div className="relative z-10 max-w-4xl mx-auto px-5 py-12">

        {/* Back */}
        <a href="/" className="inline-flex items-center gap-2 text-[rgba(255,255,255,0.4)] text-sm hover:text-[#c8f542] transition-colors mb-10">
          &#8592; VibeMap
        </a>

        {/* Header */}
        <div className="mb-10 animate-fadeUp">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-[rgba(255,255,255,0.4)] mb-6 tracking-widest uppercase" style={{ fontFamily: 'var(--font-display)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#c8f542]" />
            Toronto &middot; {n.tag}
          </div>
          <h1 className="font-black text-5xl md:text-7xl tracking-tight mb-4 leading-none" style={{ fontFamily: 'var(--font-display)' }}>
            {n.emoji} {n.name}
          </h1>
          <p className="text-[rgba(255,255,255,0.5)] text-lg leading-relaxed max-w-2xl" style={{ fontFamily: 'var(--font-body)' }}>
            {n.description}
          </p>
        </div>

        {/* CTA */}
        <div className="glass rounded-2xl p-8 mb-12 text-center animate-fadeUp" style={{ animationDelay: '0.2s' }}>
          <p className="text-[rgba(255,255,255,0.4)] mb-2 text-sm" style={{ fontFamily: 'var(--font-body)' }}>Get the full neighbourhood analysis</p>
          <p className="text-[rgba(255,255,255,0.6)] mb-6 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
            Walk score &middot; Transit &middot; Safety &middot; AI summary &middot; Interactive map
          </p>
          <a
            href={`/?address=${encodeURIComponent(n.address)}`}
            className="inline-block bg-[#c8f542] text-[#060612] font-black px-8 py-4 rounded-xl hover:brightness-110 active:scale-95 transition-all text-sm tracking-wider"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            CHECK {n.name.toUpperCase()} VIBE
          </a>
        </div>

        {/* SEO Content */}
        <div className="glass rounded-2xl p-8 space-y-8 animate-fadeUp" style={{ animationDelay: '0.3s' }}>
          <div>
            <h2 className="font-black text-xl text-[#c8f542] mb-3" style={{ fontFamily: 'var(--font-display)' }}>About {n.name}</h2>
            <p className="text-[rgba(255,255,255,0.5)] leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>{n.description}</p>
          </div>

          <div className="h-px bg-white/5" />

          <div>
            <h2 className="font-black text-xl text-[#c8f542] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              Living in {n.name}, Toronto
            </h2>
            <p className="text-[rgba(255,255,255,0.5)] leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
              {n.name} is one of Toronto&apos;s most sought-after neighbourhoods for renters and buyers alike.
              Understanding walkability, transit access, safety, and local amenities is essential before
              making a move. VibeMap provides an instant AI-powered analysis so you can make informed decisions.
            </p>
          </div>

          <div className="h-px bg-white/5" />

          <div>
            <h2 className="font-black text-xl text-[#c8f542] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              Walk Score &amp; Transit in {n.name}
            </h2>
            <p className="text-[rgba(255,255,255,0.5)] leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
              VibeMap calculates real-time walk scores, transit scores, and bike scores for {n.name} based on
              nearby amenities, TTC stops, restaurants, schools, and more. Safety data is sourced directly
              from Toronto Police Open Data.
            </p>
          </div>
        </div>

        <footer className="mt-16 text-center text-[rgba(255,255,255,0.2)] text-xs" style={{ fontFamily: 'var(--font-body)' }}>
          VibeMap &copy; 2025 &middot; Powered by Google Maps + Claude AI
        </footer>
      </div>
    </main>
  )
}