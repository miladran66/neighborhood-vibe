import { Metadata } from 'next'

const CITIES: Record<string, {
  name: string
  province: string
  description: string
  emoji: string
  tag: string
  neighbourhoods: Array<{ name: string; address: string; emoji: string }>
}> = {
  'ottawa': {
    name: 'Ottawa', province: 'Ontario', emoji: '🏛️', tag: 'Capital City',
    description: 'Ottawa is Canada\'s capital city, known for its world-class museums, stunning parliament buildings, and vibrant multicultural communities.',
    neighbourhoods: [
      { name: 'ByWard Market', address: '55 ByWard Market Square, Ottawa, ON', emoji: '🍺' },
      { name: 'Glebe', address: '858 Bank St, Ottawa, ON', emoji: '🌿' },
      { name: 'Westboro', address: '362 Richmond Rd, Ottawa, ON', emoji: '☕' },
      { name: 'Centretown', address: '340 Gilmour St, Ottawa, ON', emoji: '🏙️' },
    ],
  },
  'mississauga': {
    name: 'Mississauga', province: 'Ontario', emoji: '🏢', tag: 'Business Hub',
    description: 'Mississauga is one of Canada\'s largest cities, a major business hub with diverse communities, great transit, and proximity to Toronto.',
    neighbourhoods: [
      { name: 'Port Credit', address: '1 Port St E, Mississauga, ON', emoji: '⚓' },
      { name: 'Streetsville', address: '151 Queen St S, Mississauga, ON', emoji: '🏘️' },
      { name: 'City Centre', address: '100 City Centre Dr, Mississauga, ON', emoji: '🏗️' },
      { name: 'Clarkson', address: '1735 Lakeshore Rd W, Mississauga, ON', emoji: '🌊' },
    ],
  },
  'hamilton': {
    name: 'Hamilton', province: 'Ontario', emoji: '⚙️', tag: 'Steel City',
    description: 'Hamilton is a vibrant city known for its arts scene, waterfalls, craft breweries, and rapidly growing tech sector.',
    neighbourhoods: [
      { name: 'James Street North', address: '287 James St N, Hamilton, ON', emoji: '🎨' },
      { name: 'Locke Street', address: '264 Locke St S, Hamilton, ON', emoji: '🍷' },
      { name: 'Dundas', address: '60 King St W, Dundas, ON', emoji: '🌳' },
      { name: 'Westdale', address: '1020 King St W, Hamilton, ON', emoji: '📚' },
    ],
  },
  'london': {
    name: 'London', province: 'Ontario', emoji: '🎓', tag: 'Forest City',
    description: 'London Ontario is a vibrant university city known for its extensive park system, thriving arts community, and strong healthcare sector.',
    neighbourhoods: [
      { name: 'Old East Village', address: '721 Dundas St, London, ON', emoji: '🏺' },
      { name: 'Old South', address: '305 Wortley Rd, London, ON', emoji: '🌲' },
      { name: 'Downtown', address: '213 Dundas St, London, ON', emoji: '🏙️' },
      { name: 'Wortley Village', address: '175 Wortley Rd, London, ON', emoji: '☕' },
    ],
  },
  'brampton': {
    name: 'Brampton', province: 'Ontario', emoji: '🌸', tag: 'Flower City',
    description: 'Brampton is one of Canada\'s fastest-growing cities, known for its diverse communities, parks, and proximity to Toronto.',
    neighbourhoods: [
      { name: 'Downtown Brampton', address: '9 George St N, Brampton, ON', emoji: '🏛️' },
      { name: 'Bramalea', address: '1 Bramalea Rd, Brampton, ON', emoji: '🏘️' },
      { name: 'Heart Lake', address: '10520 Hurontario St, Brampton, ON', emoji: '💙' },
      { name: 'Springdale', address: '8600 Chinguacousy Rd, Brampton, ON', emoji: '🌱' },
    ],
  },
  'kitchener': {
    name: 'Kitchener', province: 'Ontario', emoji: '🚀', tag: 'Tech Triangle',
    description: 'Kitchener is at the heart of the Waterloo Region tech corridor, home to Google, Shopify, and hundreds of innovative startups.',
    neighbourhoods: [
      { name: 'Downtown Kitchener', address: '1 King St W, Kitchener, ON', emoji: '💡' },
      { name: 'Victoria Park', address: '100 Queen St N, Kitchener, ON', emoji: '🌳' },
      { name: 'Uptown Waterloo', address: '144 Park St, Waterloo, ON', emoji: '🏢' },
      { name: 'Belmont Village', address: '462 Belmont Ave W, Kitchener, ON', emoji: '🍺' },
    ],
  },
  'windsor': {
    name: 'Windsor', province: 'Ontario', emoji: '🎷', tag: 'Jazz City',
    description: 'Windsor is Canada\'s southernmost city, known for its jazz heritage, automotive industry, and stunning views of Detroit skyline.',
    neighbourhoods: [
      { name: 'Downtown Windsor', address: '350 City Hall Square W, Windsor, ON', emoji: '🎵' },
      { name: 'Walkerville', address: '1623 Wyandotte St E, Windsor, ON', emoji: '🏺' },
      { name: 'Riverside', address: '10503 Riverside Dr E, Windsor, ON', emoji: '🌊' },
      { name: 'Sandwich', address: '3202 Sandwich St, Windsor, ON', emoji: '🏘️' },
    ],
  },
  'barrie': {
    name: 'Barrie', province: 'Ontario', emoji: '⛷️', tag: 'Gateway to Cottage Country',
    description: 'Barrie is a vibrant lakeside city on Lake Simcoe, the gateway to Ontario\'s cottage country and ski resorts.',
    neighbourhoods: [
      { name: 'Downtown Barrie', address: '37 Mulcaster St, Barrie, ON', emoji: '🏙️' },
      { name: 'Allandale', address: '20 Poyntz St, Barrie, ON', emoji: '🌿' },
      { name: 'Painswick', address: '20 Mapleview Dr E, Barrie, ON', emoji: '🍁' },
      { name: 'Sunnidale', address: '500 Sunnidale Rd, Barrie, ON', emoji: '☀️' },
    ],
  },
  'kingston': {
    name: 'Kingston', province: 'Ontario', emoji: '🏰', tag: 'Limestone City',
    description: 'Kingston is a historic city at the junction of Lake Ontario and the St. Lawrence River, home to Queen\'s University and stunning limestone architecture.',
    neighbourhoods: [
      { name: 'Downtown Kingston', address: '216 Ontario St, Kingston, ON', emoji: '🏛️' },
      { name: 'Portsmouth', address: '2499 Princess St, Kingston, ON', emoji: '⚓' },
      { name: 'Williamsville', address: '700 Princess St, Kingston, ON', emoji: '🎓' },
      { name: 'Sydenham', address: '125 Sydenham St, Kingston, ON', emoji: '🏘️' },
    ],
  },
  'guelph': {
    name: 'Guelph', province: 'Ontario', emoji: '🌱', tag: 'Royal City',
    description: 'Guelph is a progressive university city known for its strong environmental values, thriving arts scene, and high quality of life.',
    neighbourhoods: [
      { name: 'Downtown Guelph', address: '1 Carden St, Guelph, ON', emoji: '🏙️' },
      { name: 'Two Rivers', address: '200 Kortright Rd W, Guelph, ON', emoji: '🌊' },
      { name: 'The Ward', address: '15 Woolwich St, Guelph, ON', emoji: '🎨' },
      { name: 'Kortright Hills', address: '600 Kortright Rd W, Guelph, ON', emoji: '🌿' },
    ],
  },
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const city = CITIES[slug]
  if (!city) return { title: 'City Not Found' }
  return {
    title: `${city.name} Ontario Neighbourhoods — Vibe Scores & Living Guide | VibeMap`,
    description: `Explore ${city.name} Ontario neighbourhoods with AI-powered vibe scores, walk scores, transit scores, and safety data. Find the best neighbourhood in ${city.name} for your lifestyle.`,
    keywords: `${city.name} Ontario neighbourhoods, best neighbourhoods in ${city.name}, ${city.name} real estate, ${city.name} walk score, living in ${city.name}`,
  }
}

export function generateStaticParams() {
  return Object.keys(CITIES).map((slug) => ({ slug }))
}

export default async function CityPage({ params }: Props) {
  const { slug } = await params
  const city = CITIES[slug]

  if (!city) {
    return (
      <main className="min-h-screen bg-[#060612] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">City not found</h1>
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
            {city.province} &middot; {city.tag}
          </div>
          <h1 className="font-black text-5xl md:text-7xl tracking-tight mb-4 leading-none" style={{ fontFamily: 'var(--font-display)' }}>
            {city.emoji} {city.name}
          </h1>
          <p className="text-[rgba(255,255,255,0.5)] text-lg leading-relaxed max-w-2xl" style={{ fontFamily: 'var(--font-body)' }}>
            {city.description}
          </p>
        </div>

        {/* Search CTA */}
        <div className="glass rounded-2xl p-6 mb-10 animate-fadeUp" style={{ animationDelay: '0.15s' }}>
          <p className="text-[rgba(255,255,255,0.4)] text-sm mb-4" style={{ fontFamily: 'var(--font-body)' }}>
            Check any address in {city.name}
          </p>
          <a
            href={`/?address=${encodeURIComponent(city.name + ', Ontario')}`}
            className="inline-block bg-[#c8f542] text-[#060612] font-black px-6 py-3 rounded-xl hover:brightness-110 transition-all text-sm tracking-wider"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            EXPLORE {city.name.toUpperCase()}
          </a>
        </div>

        {/* Neighbourhoods */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] tracking-widest text-[rgba(255,255,255,0.3)] uppercase" style={{ fontFamily: 'var(--font-display)' }}>
              Popular Neighbourhoods
            </span>
            <div className="flex-1 h-px bg-white/5" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
            {city.neighbourhoods.map((n) => (
              <a
                key={n.name}
                href={`/?address=${encodeURIComponent(n.address)}`}
                className="glass rounded-2xl p-5 hover:border-[rgba(200,245,66,0.4)] hover:bg-white/10 transition-all group hover:-translate-y-1 block"
              >
                <div className="text-2xl mb-3">{n.emoji}</div>
                <div className="font-bold text-sm text-[#f0f0ff] group-hover:text-[#c8f542] transition-colors" style={{ fontFamily: 'var(--font-display)' }}>
                  {n.name}
                </div>
                <div className="text-[11px] text-[rgba(255,255,255,0.3)] mt-1" style={{ fontFamily: 'var(--font-body)' }}>
                  {city.name}, ON
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* SEO Content */}
        <div className="glass rounded-2xl p-8 space-y-8 animate-fadeUp" style={{ animationDelay: '0.3s' }}>
          <div>
            <h2 className="font-black text-xl text-[#c8f542] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              Living in {city.name}, Ontario
            </h2>
            <p className="text-[rgba(255,255,255,0.5)] leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
              {city.description} Use VibeMap to discover walk scores, transit scores,
              safety data, and AI-powered neighbourhood summaries for any address in {city.name}.
            </p>
          </div>

          <div className="h-px bg-white/5" />

          <div>
            <h2 className="font-black text-xl text-[#c8f542] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              Best Neighbourhoods in {city.name}
            </h2>
            <p className="text-[rgba(255,255,255,0.5)] leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
              Finding the right neighbourhood in {city.name} depends on your lifestyle, commute, and priorities.
              VibeMap analyses walkability, transit access, nearby amenities, and safety to give you an
              instant AI-powered vibe score for any address in {city.name}, Ontario.
            </p>
          </div>

          <div className="h-px bg-white/5" />

          <div>
            <h2 className="font-black text-xl text-[#c8f542] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              Walk Score &amp; Transit in {city.name}
            </h2>
            <p className="text-[rgba(255,255,255,0.5)] leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
              VibeMap calculates real-time walk scores and transit scores for {city.name} neighbourhoods
              based on nearby restaurants, schools, transit stops, parks, and essential services.
              Enter any {city.name} address above to get your neighbourhood&apos;s vibe score instantly.
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