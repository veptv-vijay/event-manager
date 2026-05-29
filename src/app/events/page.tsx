'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const categories = ['All', 'Tech', 'Music', 'Wedding', 'College', 'Corporate', 'Workshop', 'Webinar']

type Event = {
  id: string
  title: string
  category: string
  date: string
  venue: string
  price: number
  max_participants: number
  current_participants: number
}

const categoryEmoji: Record<string, string> = {
  Tech: '🖥️', Music: '🎵', Wedding: '💒', College: '🎓',
  Corporate: '💼', Workshop: '🛠️', Webinar: '💻', default: '🎪'
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase.from('events').select('*').order('date', { ascending: true })
      if (!error && data) setEvents(data)
      setLoading(false)
    }
    fetchEvents()
  }, [])

  const filtered = events.filter(event => {
    const matchCategory = activeCategory === 'All' || event.category === activeCategory
    const matchSearch = event.title.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-lg">
        <Link href="/" className="text-2xl font-bold">⚡ EventManager</Link>
        <div className="flex gap-4">
          <Link href="/auth/login" className="bg-emerald-500 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition">Login</Link>
          <Link href="/admin" className="bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition">Admin</Link>
        </div>
      </nav>

      <section className="bg-gradient-to-r from-blue-700 to-emerald-500 py-12 px-6 text-center">
        <h2 className="text-4xl font-extrabold text-white mb-6">Find Your Next Event</h2>
        <input type="text" placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-2xl px-6 py-4 rounded-2xl text-gray-900 text-lg focus:outline-none shadow-lg" />
      </section>

      <section className="px-6 py-6 max-w-6xl mx-auto">
        <div className="flex gap-3 flex-wrap">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 ${activeCategory === cat ? 'bg-blue-700 text-white shadow-lg' : 'bg-white text-blue-700 border-2 border-blue-200 hover:bg-blue-50'}`}>
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="px-6 pb-16 max-w-6xl mx-auto">
        {loading ? (
          <div className="text-center py-20 text-gray-400 text-xl">Loading events...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(event => (
              <div key={event.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="bg-gradient-to-br from-blue-600 to-emerald-500 h-40 flex items-center justify-center text-7xl">
                  {categoryEmoji[event.category] || categoryEmoji.default}
                </div>
                <div className="p-6">
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">{event.category}</span>
                  <h3 className="text-xl font-bold text-gray-900 mt-3 mb-2">{event.title}</h3>
                  <p className="text-gray-500 text-sm mb-1">📅 {new Date(event.date).toLocaleDateString('en-IN')}</p>
                  <p className="text-gray-500 text-sm mb-4">📍 {event.venue}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-extrabold text-blue-700">
                      {event.price === 0 ? 'FREE' : `₹${event.price}`}
                    </span>
                    <Link href={`/events/${event.id}`} className="bg-emerald-500 text-white px-5 py-2 rounded-xl font-semibold hover:bg-emerald-600 transition">
                      Book Now →
                    </Link>
                  </div>
                  <div className="mt-3 bg-gray-100 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${Math.min((event.current_participants / event.max_participants) * 100, 100)}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{event.current_participants}/{event.max_participants} slots filled</p>
                </div>
              </div>
            ))}
            {filtered.length === 0 && !loading && (
              <div className="col-span-3 text-center py-20 text-gray-400 text-xl">No events found 🔍</div>
            )}
          </div>
        )}
      </section>
    </main>
  )
}
