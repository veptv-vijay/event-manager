'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type Profile = {
  id: string
  full_name: string
  email: string
  role: string
  phone: string
  created_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const adminSession = localStorage.getItem('admin_session')
    if (!adminSession) { window.location.href = '/admin'; return }
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
      if (!error && data) setUsers(data)
      setLoading(false)
    }
    fetchUsers()
  }, [])

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold">⚡ EventManager — Admin</h1>
        <Link href="/admin" className="bg-emerald-500 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition">← Dashboard</Link>
      </nav>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Manage Users</h2>
        {loading ? (
          <div className="text-center py-20 text-gray-400 text-xl">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-xl">No users found.</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-blue-50">
                <tr>
                  <th className="text-left py-4 px-6 text-blue-700 font-bold">User</th>
                  <th className="text-left py-4 px-6 text-blue-700 font-bold">Email</th>
                  <th className="text-left py-4 px-6 text-blue-700 font-bold">Role</th>
                  <th className="text-left py-4 px-6 text-blue-700 font-bold">Phone</th>
                  <th className="text-left py-4 px-6 text-blue-700 font-bold">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg">{user.full_name?.[0] || '?'}</div>
                        <span className="font-bold text-gray-900">{user.full_name || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{user.email}</td>
                    <td className="py-4 px-6">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{user.role || 'attendee'}</span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{user.phone || 'N/A'}</td>
                    <td className="py-4 px-6 text-gray-500 text-sm">{new Date(user.created_at).toLocaleDateString('en-IN')}</td>
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
