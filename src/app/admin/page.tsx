'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const ADMIN_EMAIL = 'admin@eventmanager.com'
const ADMIN_PASSWORD = 'Admin@123'

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const adminSession = localStorage.getItem('admin_session')
    if (adminSession === 'true') setIsLoggedIn(true)
  }, [])

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem('admin_session', 'true')
      setIsLoggedIn(true)
    } else {
      setError('Invalid admin credentials!')
    }
    setLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_session')
    setIsLoggedIn(false)
  }

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-800 to-gray-900 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🔐</div>
            <h1 className="text-3xl font-extrabold text-blue-700">Admin Portal</h1>
            <p className="text-gray-500 mt-2">EventManager Administration</p>
          </div>
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-center font-semibold">⚠️ {error}</div>
          )}
          <form onSubmit={handleAdminLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@eventmanager.com" required className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition disabled:opacity-50">
              {loading ? 'Logging in...' : '🔐 Login as Admin'}
            </button>
          </form>
          <div className="mt-6 bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-blue-700 text-sm font-semibold">Demo Credentials</p>
            <p className="text-gray-600 text-sm mt-1">Email: admin@eventmanager.com</p>
            <p className="text-gray-600 text-sm">Password: Admin@123</p>
          </div>
          <div className="text-center mt-4">
            <Link href="/" className="text-gray-400 text-sm hover:text-blue-700 transition">← Back to Home</Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold">⚡ EventManager — Admin</h1>
        <div className="flex gap-4">
          <Link href="/events" className="bg-emerald-500 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition">View Site</Link>
          <Link href="/admin/events/create" className="bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition">+ Create Event</Link>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition">Logout</button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Dashboard Overview</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Events', value: '—', icon: '🎪', color: 'from-blue-500 to-blue-700' },
            { label: 'Total Users', value: '—', icon: '👥', color: 'from-emerald-500 to-emerald-700' },
            { label: 'Total Revenue', value: '—', icon: '💰', color: 'from-purple-500 to-purple-700' },
            { label: 'Tickets Sold', value: '—', icon: '🎫', color: 'from-orange-500 to-orange-700' },
          ].map((stat) => (
            <div key={stat.label} className={`bg-gradient-to-br ${stat.color} text-white rounded-2xl p-6 shadow-lg`}>
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-3xl font-extrabold mb-1">{stat.value}</div>
              <div className="text-white/80 font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Manage Events', icon: '🎪', href: '/admin/events' },
            { label: 'View Bookings', icon: '🎫', href: '/admin/bookings' },
            { label: 'Manage Users', icon: '👥', href: '/admin/users' },
            { label: 'View Reports', icon: '📊', href: '/admin/reports' },
          ].map(action => (
            <Link key={action.label} href={action.href} className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition-all duration-200 group">
              <div className="text-4xl mb-3">{action.icon}</div>
              <div className="font-bold text-gray-700 group-hover:text-blue-700 transition">{action.label}</div>
            </Link>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/admin/events" className="border-2 border-blue-100 rounded-2xl p-6 hover:border-blue-400 transition">
              <p className="text-blue-700 font-bold text-lg">Manage Events →</p>
              <p className="text-gray-500 text-sm mt-1">Create, edit, delete events</p>
            </Link>
            <Link href="/admin/bookings" className="border-2 border-emerald-100 rounded-2xl p-6 hover:border-emerald-400 transition">
              <p className="text-emerald-700 font-bold text-lg">View Bookings →</p>
              <p className="text-gray-500 text-sm mt-1">Track all ticket bookings</p>
            </Link>
            <Link href="/admin/events/create" className="border-2 border-purple-100 rounded-2xl p-6 hover:border-purple-400 transition">
              <p className="text-purple-700 font-bold text-lg">Create Event →</p>
              <p className="text-gray-500 text-sm mt-1">Add a new event now</p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
