'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type Booking = {
  id: string
  ticket_type: string
  quantity: number
  total_amount: number
  payment_status: string
  created_at: string
  events: { title: string; venue: string; category: string } | null
  profiles: { full_name: string; email: string } | null
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const adminSession = localStorage.getItem('admin_session')
    if (!adminSession) { window.location.href = '/admin'; return }
    const fetchBookings = async () => {
      const { data, error } = await supabase.from('bookings')
        .select(`*, events(title, venue, category), profiles(full_name, email)`)
        .order('created_at', { ascending: false })
      if (!error && data) setBookings(data)
      setLoading(false)
    }
    fetchBookings()
  }, [])

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold">⚡ EventManager — Admin</h1>
        <Link href="/admin" className="bg-emerald-500 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition">← Dashboard</Link>
      </nav>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">All Bookings</h2>
        {loading ? (
          <div className="text-center py-20 text-gray-400 text-xl">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-xl">No bookings yet.</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-blue-50">
                <tr>
                  <th className="text-left py-4 px-6 text-blue-700 font-bold">User</th>
                  <th className="text-left py-4 px-6 text-blue-700 font-bold">Event</th>
                  <th className="text-left py-4 px-6 text-blue-700 font-bold">Ticket</th>
                  <th className="text-left py-4 px-6 text-blue-700 font-bold">Qty</th>
                  <th className="text-left py-4 px-6 text-blue-700 font-bold">Amount</th>
                  <th className="text-left py-4 px-6 text-blue-700 font-bold">Status</th>
                  <th className="text-left py-4 px-6 text-blue-700 font-bold">Date</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-4 px-6">
                      <div className="font-bold text-gray-900">{booking.profiles?.full_name || 'N/A'}</div>
                      <div className="text-gray-500 text-sm">{booking.profiles?.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-gray-800">{booking.events?.title}</div>
                      <div className="text-gray-500 text-sm">📍 {booking.events?.venue}</div>
                    </td>
                    <td className="py-4 px-6"><span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full capitalize">{booking.ticket_type}</span></td>
                    <td className="py-4 px-6 font-semibold text-gray-700">{booking.quantity}</td>
                    <td className="py-4 px-6 font-bold text-blue-700">{booking.total_amount === 0 ? 'FREE' : `₹${booking.total_amount}`}</td>
                    <td className="py-4 px-6">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${booking.payment_status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}`}>{booking.payment_status}</span>
                    </td>
                    <td className="py-4 px-6 text-gray-500 text-sm">{new Date(booking.created_at).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
