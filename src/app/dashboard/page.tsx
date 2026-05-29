'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import QRCode from 'react-qr-code'

type Booking = {
  id: string
  ticket_type: string
  quantity: number
  total_amount: number
  payment_status: string
  created_at: string
  qr_code: string
  events: { title: string; venue: string; date: string; category: string } | null
}

const categoryEmoji: Record<string, string> = {
  Tech: '🖥️', Music: '🎵', Wedding: '💒', College: '🎓',
  Corporate: '💼', Workshop: '🛠️', Webinar: '💻', default: '🎪'
}

export default function UserDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [selectedTicket, setSelectedTicket] = useState<Booking | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/auth/login'; return }
      setUserName(user.user_metadata?.full_name || user.email || '')
      setUserEmail(user.email || '')
      const { data } = await supabase.from('bookings')
        .select(`*, events(title, venue, date, category)`)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (data) setBookings(data)
      setLoading(false)
    }
    fetchData()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* QR Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center">
            <h2 className="text-2xl font-extrabold text-blue-700 mb-2">🎫 Your E-Ticket</h2>
            <p className="text-gray-500 mb-6 text-sm">Show this QR code at the event entrance</p>
            <div className="bg-gradient-to-br from-blue-700 to-emerald-500 p-6 rounded-2xl mb-6">
              <div className="bg-white p-4 rounded-xl inline-block">
                <QRCode value={selectedTicket.qr_code || selectedTicket.id} size={180} fgColor="#1D4ED8" />
              </div>
            </div>
            <div className="text-left space-y-2 mb-6 bg-gray-50 rounded-xl p-4">
              <h3 className="font-extrabold text-gray-900 text-lg">{selectedTicket.events?.title}</h3>
              <p className="text-gray-600 text-sm">📍 {selectedTicket.events?.venue}</p>
              <p className="text-gray-600 text-sm">📅 {selectedTicket.events?.date ? new Date(selectedTicket.events.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full capitalize">{selectedTicket.ticket_type}</span>
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">Qty: {selectedTicket.quantity}</span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${selectedTicket.payment_status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}`}>{selectedTicket.payment_status}</span>
              </div>
              <p className="text-gray-400 text-xs mt-2">Ticket ID: {selectedTicket.id.slice(0, 8).toUpperCase()}</p>
              <p className="text-gray-400 text-xs">Booked by: {userEmail}</p>
              <p className="text-gray-400 text-xs">Amount: {selectedTicket.total_amount === 0 ? 'FREE' : `₹${selectedTicket.total_amount}`}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => window.print()} className="flex-1 bg-blue-700 text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition">🖨️ Print</button>
              <button onClick={() => setSelectedTicket(null)} className="flex-1 border-2 border-gray-300 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-50 transition">✕ Close</button>
            </div>
          </div>
        </div>
      )}

      <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-lg">
        <Link href="/" className="text-2xl font-bold">⚡ EventManager</Link>
        <div className="flex gap-4 items-center">
          <span className="text-blue-100 hidden md:block">👋 {userName}</span>
          <Link href="/events" className="bg-emerald-500 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition">Browse Events</Link>
          <button onClick={handleLogout} className="bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition">Logout</button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">My Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Total Bookings', value: bookings.length, icon: '🎫', color: 'from-blue-500 to-blue-700' },
            { label: 'Confirmed', value: bookings.filter(b => b.payment_status === 'confirmed').length, icon: '✅', color: 'from-emerald-500 to-emerald-700' },
            { label: 'Total Spent', value: `₹${bookings.reduce((sum, b) => sum + (b.total_amount || 0), 0)}`, icon: '💰', color: 'from-purple-500 to-purple-700' },
          ].map(stat => (
            <div key={stat.label} className={`bg-gradient-to-br ${stat.color} text-white rounded-2xl p-6 shadow-lg`}>
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-3xl font-extrabold mb-1">{stat.value}</div>
              <div className="text-white/80 font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">My Bookings</h3>
          {loading ? (
            <div className="text-center py-10 text-gray-400">Loading...</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-400 text-lg mb-4">No bookings yet!</p>
              <Link href="/events" className="bg-blue-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-800 transition">Browse Events →</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map(booking => (
                <div key={booking.id} className="border-2 border-gray-100 rounded-2xl p-6 hover:border-blue-200 transition-all duration-200">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex gap-4 items-start">
                      <div className="text-5xl">{categoryEmoji[booking.events?.category || ''] || categoryEmoji.default}</div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{booking.events?.title}</h4>
                        <p className="text-gray-500 text-sm mt-1">📍 {booking.events?.venue}</p>
                        <p className="text-gray-500 text-sm">📅 {booking.events?.date ? new Date(booking.events.date).toLocaleDateString('en-IN') : ''}</p>
                        <div className="flex gap-2 mt-3 flex-wrap">
                          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full capitalize">{booking.ticket_type}</span>
                          <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">Qty: {booking.quantity}</span>
                          <span className={`text-xs font-bold px-3 py-1 rounded-full ${booking.payment_status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}`}>{booking.payment_status}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3 min-w-fit">
                      <div className="text-2xl font-extrabold text-blue-700">{booking.total_amount === 0 ? 'FREE' : `₹${booking.total_amount}`}</div>
                      <button onClick={() => setSelectedTicket(booking)} className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-600 transition text-sm whitespace-nowrap shadow-md">
                        🎫 View Ticket
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
