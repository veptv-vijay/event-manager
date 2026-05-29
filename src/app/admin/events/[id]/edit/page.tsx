'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'

export default function EditEventPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ title: '', description: '', date: '', venue: '', category: 'Tech', price: '', max_participants: '' })

  useEffect(() => {
    const adminSession = localStorage.getItem('admin_session')
    if (!adminSession) { window.location.href = '/admin'; return }
    fetchEvent()
  }, [])

  const fetchEvent = async () => {
    const { data } = await supabase.from('events').select('*').eq('id', id).single()
    if (data) {
      setForm({
        title: data.title || '', description: data.description || '',
        date: data.date ? new Date(data.date).toISOString().slice(0, 16) : '',
        venue: data.venue || '', category: data.category || 'Tech',
        price: data.price?.toString() || '0', max_participants: data.max_participants?.toString() || '100'
      })
    }
    setLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const { error } = await supabase.from('events').update({
      title: form.title, description: form.description, date: form.date,
      venue: form.venue, category: form.category,
      price: parseFloat(form.price) || 0,
      max_participants: parseInt(form.max_participants) || 100,
    }).eq('id', id)
    if (error) { setError(error.message) }
    else { setSuccess(true); setTimeout(() => router.push('/admin/events'), 2000) }
    setSaving(false)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl text-gray-400">Loading...</div>

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold">⚡ EventManager — Admin</h1>
        <Link href="/admin/events" className="bg-emerald-500 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition">← Back to Events</Link>
      </nav>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Edit Event</h2>
        {success && <div className="bg-emerald-50 border-2 border-emerald-500 text-emerald-700 px-6 py-4 rounded-2xl mb-6 font-semibold text-center">✅ Event Updated! Redirecting...</div>}
        {error && <div className="bg-red-50 border-2 border-red-300 text-red-600 px-6 py-4 rounded-2xl mb-6">⚠️ {error}</div>}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Event Title *</label>
              <input name="title" value={form.title} onChange={handleChange} required className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
              <select name="category" value={form.category} onChange={handleChange} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition">
                {['Tech', 'Music', 'Wedding', 'College', 'Corporate', 'Workshop', 'Webinar'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date & Time *</label>
              <input type="datetime-local" name="date" value={form.date} onChange={handleChange} required className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Venue *</label>
              <input name="venue" value={form.venue} onChange={handleChange} required className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Ticket Price (₹)</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Max Participants</label>
              <input type="number" name="max_participants" value={form.max_participants} onChange={handleChange} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition resize-none" />
          </div>
          <div className="flex gap-4 pt-4">
            <button type="submit" disabled={saving} className="flex-1 bg-blue-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition disabled:opacity-50">
              {saving ? 'Saving...' : '💾 Save Changes'}
            </button>
            <Link href="/admin/events" className="flex-1 border-2 border-gray-300 text-gray-600 py-4 rounded-xl font-bold text-lg text-center hover:bg-gray-50 transition">Cancel</Link>
          </div>
        </form>
      </div>
    </main>
  )
}
