'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
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
  description: string
}

type User = {
  id: string
  email: string
  user_metadata?: { full_name?: string }
}

const categoryEmoji: Record<string, string> = {
  Tech: '🖥️', Music: '🎵', Wedding: '💒', College: '🎓',
  Corporate: '💼', Workshop: '🛠️', Webinar: '💻', default: '🎪'
}

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [success, setSuccess] = useState(false)
  const [ticketType, setTicketType] = useState('regular')
  const [quantity, setQuantity] = useState(1)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUser(user as User)
      const { data } = await supabase.from('events').select('*').eq('id', id).single()
      if (data) setEvent(data)
      setLoading(false)
    }
    fetchData()
  }, [id])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-2xl text-gray-400">Loading...</div>
  if (!event) return <div className="min-h-screen flex items-center justify-center text-2xl text-gray-500">Event not found</div>

  const prices: Record<string, number> = {
    regular: event.price,
    vip: event.price * 2,
    earlybird: Math.floor(event.price * 0.7)
  }
  const total = prices[ticketType] * quantity

  const handleBooking = async () => {
    if (!user) { router.push('/auth/login'); return }
    setBooking(true)
    try {
      const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single()
      if (!profile) {
        await supabase.from('profiles').insert([{
          id: user.id,
          full_name: user.user_metadata?.full_name || 'User',
          email: user.email,
          role: 'attendee'
        }])
      }
      const { error: bookingError } = await supabase.from('bookings').insert([{
        event_id: event.id,
        user_id: user.id,
        ticket_type: ticketType,
        quantity: quantity,
        total_amount: total,
        payment_status: event.price === 0 ? 'confirmed' : 'pending',
        qr_code: `QR-${event.id}-${user.id}-${Date.now()}`
      }])
      if (bookingError) { alert('Booking failed: ' + bookingError.message); setBooking(false); return }
      await supabase.from('events').update({ current_participants: (event.current_participants || 0) + quantity }).eq('id', event.id)
      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 2000)
    } catch (err) {
      alert('Something went wrong. Please try again.')
      console.error(err)
    }
    setBooking(false)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-lg">
        <Link href="/" className="text-2xl font-bold">⚡ EventManager</Link>
        <div className="flex gap-3">
          {user ? (
            <Link href="/dashboard" className="bg-emerald-500 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition">My Dashboard</Link>
          ) : (
            <Link href="/auth/login" className="bg-emerald-500 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition">Login</Link>
          )}
          <Link href="/events" className="bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition">← Events</Link>
        </div>
      </nav>

      {success && (
        <div className="bg-emerald-500 text-white text-center py-4 text-lg font-bold">
          🎉 Booking Confirmed! Redirecting to dashboard...
        </div>
      )}

      <div className="bg-gradient-to-br from-blue-700 to-emerald-500 py-16 px-6 text-center text-white">
        <div className="text-8xl mb-4">{categoryEmoji[event.category] || categoryEmoji.default}</div>
        <span className="bg-white text-blue-700 text-sm font-bold px-4 py-1 rounded-full">{event.category}</span>
        <h1 className="text-4xl font-extrabold mt-4 mb-2">{event.title}</h1>
        <p className="text-blue-100 text-lg">📅 {new Date(event.date).toLocaleDateString('en-IN')} &nbsp;|&nbsp; 📍 {event.venue}</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
            <p className="text-gray-600 leading-relaxed">{event.description || 'No description provided.'}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-blue-500 text-sm font-semibold">📅 Date</p>
                <p className="text-gray-800 font-bold mt-1">{new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4">
                <p className="text-emerald-500 text-sm font-semibold">📍 Venue</p>
                <p className="text-gray-800 font-bold mt-1">{event.venue}</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <p className="text-purple-500 text-sm font-semibold">🎫 Available Slots</p>
                <p className="text-gray-800 font-bold mt-1">{event.max_participants - event.current_participants} remaining</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-4">
                <p className="text-orange-500 text-sm font-semibold">🏷️ Category</p>
                <p className="text-gray-800 font-bold mt-1">{event.category}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Tickets</h2>
            {!user && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-4 text-center">
                <p className="text-blue-700 font-semibold mb-2">Login to book tickets</p>
                <Link href="/auth/login" className="bg-blue-700 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-800 transition text-sm">Login Now →</Link>
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Ticket Type</label>
              <div className="space-y-2">
                {[
                  { value: 'regular', label: 'Regular', desc: event.price === 0 ? 'FREE' : `₹${event.price}` },
                  { value: 'vip', label: '⭐ VIP', desc: event.price === 0 ? 'FREE' : `₹${event.price * 2}` },
                  { value: 'earlybird', label: '🐦 Early Bird', desc: event.price === 0 ? 'FREE' : `₹${Math.floor(event.price * 0.7)}` },
                ].map(t => (
                  <label key={t.value} className={`flex justify-between items-center p-3 rounded-xl border-2 cursor-pointer transition ${ticketType === t.value ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-2">
                      <input type="radio" name="ticket" value={t.value} checked={ticketType === t.value} onChange={() => setTicketType(t.value)} className="accent-blue-600" />
                      <span className="font-semibold text-gray-800">{t.label}</span>
                    </div>
                    <span className="text-blue-700 font-bold">{t.desc}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center gap-4">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 bg-gray-100 rounded-full text-xl font-bold hover:bg-gray-200 transition">-</button>
                <span className="text-2xl font-bold text-gray-900">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(10, quantity + 1))} className="w-10 h-10 bg-gray-100 rounded-full text-xl font-bold hover:bg-gray-200 transition">+</button>
              </div>
            </div>
            <div className="border-t-2 border-gray-100 pt-4 mb-6">
              <div className="flex justify-between text-gray-600 mb-2"><span>Price per ticket</span><span>{event.price === 0 ? 'FREE' : `₹${prices[ticketType]}`}</span></div>
              <div className="flex justify-between text-gray-600 mb-2"><span>Quantity</span><span>{quantity}</span></div>
              <div className="flex justify-between text-xl font-extrabold text-blue-700 mt-3"><span>Total</span><span>{total === 0 ? 'FREE' : `₹${total}`}</span></div>
            </div>
            <button onClick={handleBooking} disabled={booking || success}
              className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-600 transition shadow-lg disabled:opacity-50">
              {booking ? '⏳ Booking...' : success ? '✅ Booked!' : user ? 'Book Now →' : 'Login to Book →'}
            </button>
            {user && <p className="text-center text-gray-400 text-sm mt-3">Logged in as {user.email}</p>}
          </div>
        </div>
      </div>
    </main>
  )
}
