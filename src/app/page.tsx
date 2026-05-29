'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [user, setUser] = useState<{ email: string } | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUser(user as { email: string })
    })
  }, [])

  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold tracking-tight">⚡ EventManager</h1>
        <div className="flex gap-4">
          {user ? (
            <>
              <Link href="/dashboard" className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition">My Dashboard</Link>
              <Link href="/admin" className="bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition">Admin</Link>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition">Login</Link>
              <Link href="/auth/register" className="border-2 border-white text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800 transition">Register</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-emerald-500 text-white py-24 px-6 text-center">
        <h2 className="text-5xl font-extrabold mb-6 leading-tight">Discover & Book <br /> Amazing Events</h2>
        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">From tech conferences to music festivals — find, book, and manage events all in one place.</p>
        <Link href="/events" className="bg-white text-blue-700 px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-50 transition shadow-lg">Explore Events →</Link>
      </section>

      {/* Categories */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Browse by Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: 'Tech', emoji: '🖥️' }, { name: 'Music', emoji: '🎵' },
            { name: 'Wedding', emoji: '💒' }, { name: 'College', emoji: '🎓' },
            { name: 'Corporate', emoji: '💼' }, { name: 'Workshop', emoji: '🛠️' },
            { name: 'Webinar', emoji: '💻' }, { name: 'More', emoji: '🎉' }
          ].map((cat) => (
            <Link href={`/events?category=${cat.name}`} key={cat.name}
              className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-6 text-center font-semibold text-blue-700 hover:bg-gradient-to-br hover:from-blue-600 hover:to-emerald-500 hover:text-white cursor-pointer transition-all duration-200 text-lg">
              <div className="text-4xl mb-2">{cat.emoji}</div>
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-r from-blue-700 to-emerald-500 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          <div><p className="text-5xl font-extrabold">500+</p><p className="text-blue-100 mt-2 text-lg">Events Listed</p></div>
          <div><p className="text-5xl font-extrabold">10K+</p><p className="text-blue-100 mt-2 text-lg">Happy Attendees</p></div>
          <div><p className="text-5xl font-extrabold">50+</p><p className="text-blue-100 mt-2 text-lg">Cities Covered</p></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-8">
        <p className="text-gray-400">© 2025 EventManager. Built with ❤️ for amazing experiences.</p>
      </footer>
    </main>
  )
}
