import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Search, Users } from 'lucide-react'

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    supabase.from('customer_profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setCustomers(data || []); setLoading(false) })
  }, [])

  const filtered = customers.filter(c =>
    c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-serif">Customers</h1>
          <p className="text-gray-400 text-sm">{customers.length} registered customers</p>
        </div>
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search by name or phone..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#2D6A4F]" />
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-gray-50">
                  {[...Array(4)].map((_, j) => <td key={j} className="px-5 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>)}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-12 text-gray-400">
                <Users size={32} className="mx-auto mb-2 opacity-30" />
                No customers found
              </td></tr>
            ) : filtered.map(c => (
              <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#D8F3DC] rounded-full flex items-center justify-center text-[#2D6A4F] font-bold text-sm shrink-0">
                      {c.full_name?.[0] || '?'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{c.full_name || 'No name'}</p>
                      {c.is_admin && <span className="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full font-semibold">Admin</span>}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-gray-500">{c.phone || '—'}</td>
                <td className="px-5 py-4 text-gray-500 max-w-[200px] truncate">{c.address || '—'}</td>
                <td className="px-5 py-4 text-gray-400 text-xs">
                  {new Date(c.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}