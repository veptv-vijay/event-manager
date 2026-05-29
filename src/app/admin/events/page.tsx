'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type Event = {
  id: string
  title: string
  category: string
  date: string
  venue: string
  price: number
  max_participants: number
  current_participants: number
  status: string
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const adminSession = localStorage.getItem('admin_session')
    if (!adminSession) { window.location.href = '/admin'; return }
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false })
    if (!error && data) setEvents(data)
    setLoading(false)
  }

  const deleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return
    await supabase.from('events').delete().eq('id', id)
    fetchEvents()
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold">⚡ EventManager — Admin</h1>
        <div className="flex gap-4">
          <Link href="/admin" className="bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition">← Dashboard</Link>
          <Link href="/admin/events/create" className="bg-emerald-500 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition">+ Create Event</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Manage Events</h2>
        {loading ? (
          <div className="text-center py-20 text-gray-400 text-xl">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl mb-6">No events yet!</p>
            <Link href="/admin/events/create" className="bg-blue-700 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-800 transition">+ Create Event</Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-blue-50">
                <tr>
                  <th className="text-left py-4 px-6 text-blue-700 font-bold">Event</th>
                  <th className="text-left py-4 px-6 text-blue-700 font-bold">Category</th>
                  <th className="text-left py-4 px-6 text-blue-700 font-bold">Date</th>
                  <th className="text-left py-4 px-6 text-blue-700 font-bold">Price</th>
                  <th className="text-left py-4 px-6 text-blue-700 font-bold">Slots</th>
                  <th className="text-left py-4 px-6 text-blue-700 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-4 px-6">
                      <div className="font-bold text-gray-900">{event.title}</div>
                      <div className="text-gray-500 text-sm">📍 {event.venue}</div>
                    </td>
                    <td className="py-4 px-6"><span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">{event.category}</span></td>
                    <td className="py-4 px-6 text-gray-600 text-sm">{new Date(event.date).toLocaleDateString('en-IN')}</td>
                    <td className="py-4 px-6 font-bold text-blue-700">{event.price === 0 ? 'FREE' : `₹${event.price}`}</td>
                    <td className="py-4 px-6 text-gray-600">{event.current_participants}/{event.max_participants}</td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <Link href={`/admin/events/${event.id}/edit`} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-semibold hover:bg-blue-200 transition">Edit</Link>
                        <button onClick={() => deleteEvent(event.id)} className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm font-semibold hover:bg-red-200 transition">Delete</button>
                      </div>
                    </td>
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
