'use client'
import { useState } from 'react'
import Link from 'next/link'

const NEIGHBOURHOODS = [
  { name: 'King West', slug: 'king-west', emoji: '🍸', tag: 'Nightlife' },
  { name: 'Distillery', slug: 'distillery', emoji: '🏛️', tag: 'Historic' },
  { name: 'Queen West', slug: 'queen-west', emoji: '🎨', tag: 'Arts' },
  { name: 'Midtown', slug: 'midtown', emoji: '🌳', tag: 'Families' },
  { name: 'Bloor-Yonge', slug: 'bloor-yonge', emoji: '🚇', tag: 'Transit' },
  { name: 'Leslieville', slug: 'leslieville', emoji: '☕', tag: 'Cafés' },
  { name: 'Kensington', slug: 'kensington', emoji: '🌍', tag: 'Culture' },
  { name: 'The Annex', slug: 'annex', emoji: '📚', tag: 'Students' },
  { name: 'Liberty Village', slug: 'liberty-village', emoji: '💻', tag: 'Tech' },
  { name: 'Roncesvalles', slug: 'roncesvalles', emoji: '🏡', tag: 'Village' },
  { name: 'Yorkville', slug: 'yorkville', emoji: '💎', tag: 'Luxury' },
  { name: 'Danforth', slug: 'danforth', emoji: '🍋', tag: 'Greek Town' },
]

export default function Home() {
  const [address, setAddress] = useState('')

  const handleSearch = () => {
    if (!address.trim()) return
    window.location.href = `/?address=${encodeURIComponent(address)}`
  }

  return (
    <main className="min-h-screen relative">
      {/* Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Noise texture overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-16 pb-24" style={{ marginLeft: 'auto', marginRight: 'auto' }}>

        {/* Header */}
        <header className="text-center mb-16 animate-fadeUp">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-xs text-[var(--muted)] mb-8 font-display tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
            Toronto Neighbourhood Intelligence
          </div>
          <h1 className="font-display font-black text-6xl md:text-8xl tracking-tight mb-4 leading-none">
            Vibe<span className="text-[var(--accent)]">Map</span>
          </h1>
          <p className="text-[var(--muted)] text-lg md:text-xl max-w-lg mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
            AI-powered neighbourhood intelligence for Toronto
          </p>
        </header>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-20 animate-fadeUp" style={{ animationDelay: '0.2s' }}>
          <div className="glass rounded-2xl p-1.5 flex gap-2">
            <div className="flex items-center pl-4 text-xl">📍</div>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Enter any Toronto address..."
              className="flex-1 bg-transparent outline-none text-[var(--text)] py-4 px-2 placeholder-[var(--muted)] text-base"
              style={{ fontFamily: 'var(--font-body)' }}
            />
            <button
              onClick={handleSearch}
              className="bg-[var(--accent)] text-[#060612] font-display font-bold px-6 py-3 rounded-xl text-sm tracking-wider hover:brightness-110 active:scale-95 transition-all whitespace-nowrap"
            >
              CHECK VIBE
            </button>
          </div>

          {/* Quick tags */}
          <div className="flex gap-2 mt-4 flex-wrap justify-center">
            {['King West', 'Distillery', 'Queen West', 'Midtown'].map((n) => (
              <button
                key={n}
                onClick={() => setAddress(n + ', Toronto')}
                className="glass rounded-full px-4 py-1.5 text-xs text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Neighbourhoods Grid */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-display text-xs tracking-widest text-[var(--muted)] uppercase">
              Explore Neighbourhoods
            </h2>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 stagger">
            {NEIGHBOURHOODS.map((n) => (
              <Link
                key={n.slug}
                href={`/neighbourhood/${n.slug}`}
                className="glass rounded-2xl p-5 hover:border-[var(--accent)]/40 hover:bg-white/10 transition-all group hover:-translate-y-1"
              >
                <div className="text-3xl mb-3">{n.emoji}</div>
                <div className="font-display font-bold text-sm text-[var(--text)] group-hover:text-[var(--accent)] transition-colors leading-tight">
                  {n.name}
                </div>
                <div className="mt-1.5">
                  <span className="text-[10px] text-[var(--muted)] bg-white/5 rounded-full px-2 py-0.5" style={{ fontFamily: 'var(--font-body)' }}>
                    {n.tag}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Stats bar */}
        <div className="mt-20 glass rounded-2xl p-6 grid grid-cols-3 gap-6 text-center stagger">
          {[
            { val: '140+', label: 'Neighbourhoods' },
            { val: 'AI', label: 'Powered Insights' },
            { val: 'Live', label: 'Crime & Safety Data' },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-display font-black text-2xl text-[var(--accent)]">{s.val}</div>
              <div className="text-[var(--muted)] text-xs mt-1" style={{ fontFamily: 'var(--font-body)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-[var(--muted)] text-xs" style={{ fontFamily: 'var(--font-body)' }}>
          <p>Powered by Google Maps + Claude AI · <a href="https://vibemap.ca" className="hover:text-[var(--accent)] transition-colors">vibemap.ca</a></p>
        </footer>
      </div>
    </main>
  )
}