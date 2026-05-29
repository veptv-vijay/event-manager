'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function AdminReportsPage() {
  const [stats, setStats] = useState({ totalEvents: 0, totalBookings: 0, totalRevenue: 0, confirmedBookings: 0, pendingBookings: 0, freeBookings: 0 })
  const [loading, setLoading] = useState(true)
  const [categoryStats, setCategoryStats] = useState<{ category: string, count: number }[]>([])

  useEffect(() => {
    const adminSession = localStorage.getItem('admin_session')
    if (!adminSession) { window.location.href = '/admin'; return }
    const fetchStats = async () => {
      const { data: events } = await supabase.from('events').select('*')
      const { data: bookings } = await supabase.from('bookings').select('*')
      if (events && bookings) {
        const totalRevenue = bookings.reduce((sum, b) => sum + (b.total_amount || 0), 0)
        const confirmed = bookings.filter(b => b.payment_status === 'confirmed').length
        const pending = bookings.filter(b => b.payment_status === 'pending').length
        const free = bookings.filter(b => b.total_amount === 0).length
        const catCount: Record<string, number> = {}
        events.forEach(e => { catCount[e.category] = (catCount[e.category] || 0) + 1 })
        const catStats = Object.entries(catCount).map(([category, count]) => ({ category, count }))
        setStats({ totalEvents: events.length, totalBookings: bookings.length, totalRevenue, confirmedBookings: confirmed, pendingBookings: pending, freeBookings: free })
        setCategoryStats(catStats)
      }
      setLoading(false)
    }
    fetchStats()
  }, [])

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold">⚡ EventManager — Admin</h1>
        <Link href="/admin" className="bg-emerald-500 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition">← Dashboard</Link>
      </nav>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Reports & Analytics</h2>
        {loading ? (
          <div className="text-center py-20 text-gray-400 text-xl">Loading reports...</div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
              {[
                { label: 'Total Events', value: stats.totalEvents, icon: '🎪', color: 'from-blue-500 to-blue-700' },
                { label: 'Total Bookings', value: stats.totalBookings, icon: '🎫', color: 'from-emerald-500 to-emerald-700' },
                { label: 'Total Revenue', value: `₹${stats.totalRevenue}`, icon: '💰', color: 'from-purple-500 to-purple-700' },
                { label: 'Confirmed', value: stats.confirmedBookings, icon: '✅', color: 'from-green-500 to-green-700' },
                { label: 'Pending', value: stats.pendingBookings, icon: '⏳', color: 'from-yellow-500 to-yellow-700' },
                { label: 'Free Bookings', value: stats.freeBookings, icon: '🆓', color: 'from-gray-500 to-gray-700' },
              ].map(stat => (
                <div key={stat.label} className={`bg-gradient-to-br ${stat.color} text-white rounded-2xl p-6 shadow-lg`}>
                  <div className="text-4xl mb-3">{stat.icon}</div>
                  <div className="text-3xl font-extrabold mb-1">{stat.value}</div>
                  <div className="text-white/80 font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>
            {categoryStats.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Events by Category</h3>
                <div className="space-y-4">
                  {categoryStats.map(cat => (
                    <div key={cat.category}>
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold text-gray-700">{cat.category}</span>
                        <span className="font-bold text-blue-700">{cat.count} events</span>
                      </div>
                      <div className="bg-gray-100 rounded-full h-3">
                        <div className="bg-gradient-to-r from-blue-500 to-emerald-500 h-3 rounded-full" style={{ width: `${(cat.count / stats.totalEvents) * 100}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
