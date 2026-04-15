import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Search, Eye, X } from 'lucide-react'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}
const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [selected, setSelected] = useState(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => { fetchOrders() }, [])

  async function fetchOrders() {
    setLoading(true)
    const { data } = await supabase
      .from('orders')
      .select('*, customer_profiles(full_name, phone), order_items(*, products(name, images))')
      .order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  const updateStatus = async (id, status) => {
    setUpdating(true)
    await supabase.from('orders').update({ status }).eq('id', id)
    setUpdating(false)
    fetchOrders()
    if (selected?.id === id) setSelected(prev => ({ ...prev, status }))
  }

  const filtered = orders.filter(o => {
    const matchSearch = o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_profiles?.full_name?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !filterStatus || o.status === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-serif">Orders</h1>
          <p className="text-gray-400 text-sm">{orders.length} total orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by order # or customer..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#2D6A4F]" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2D6A4F] bg-white">
          <option value="">All statuses</option>
          {statuses.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {[...Array(6)].map((_, j) => <td key={j} className="px-5 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>)}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">No orders found</td></tr>
              ) : filtered.map(order => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 font-semibold text-gray-800">{order.order_number}</td>
                  <td className="px-5 py-4">
                    <p className="text-gray-700">{order.customer_profiles?.full_name || 'Guest'}</p>
                    <p className="text-xs text-gray-400">{order.customer_profiles?.phone}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-xs">
                    {new Date(order.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-4 font-bold text-gray-800">KSh {order.total_amount?.toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <select value={order.status} onChange={e => updateStatus(order.id, e.target.value)}
                      disabled={updating}
                      className={`text-xs font-semibold px-2.5 py-1.5 rounded-full border-0 outline-none cursor-pointer capitalize ${statusColors[order.status]}`}>
                      {statuses.map(s => <option key={s} value={s} className="bg-white text-gray-700 capitalize">{s}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => setSelected(order)}
                      className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition-colors ml-auto">
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white">
              <div>
                <h2 className="font-bold text-gray-800">{selected.order_number}</h2>
                <p className="text-xs text-gray-400">{new Date(selected.created_at).toLocaleString('en-KE')}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">Customer</p>
                  <p className="text-sm font-semibold text-gray-800">{selected.customer_profiles?.full_name || 'Guest'}</p>
                  <p className="text-xs text-gray-500">{selected.customer_profiles?.phone}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">Status</p>
                  <select value={selected.status} onChange={e => updateStatus(selected.id, e.target.value)}
                    className={`text-xs font-semibold px-2 py-1 rounded-full capitalize border-0 outline-none cursor-pointer ${statusColors[selected.status]}`}>
                    {statuses.map(s => <option key={s} value={s} className="bg-white text-gray-700 capitalize">{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Delivery Address</p>
                <p className="text-sm text-gray-700">{selected.shipping_address || '—'}</p>
              </div>
              {selected.notes && (
                <div className="bg-yellow-50 rounded-xl p-3">
                  <p className="text-xs text-yellow-600 mb-1">Notes</p>
                  <p className="text-sm text-gray-700">{selected.notes}</p>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Items</p>
                <div className="space-y-2">
                  {selected.order_items?.map(item => (
                    <div key={item.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                        {item.products?.images?.[0]
                          ? <img src={item.products.images[0]} alt="" className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center">🛍️</div>
                        }
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">{item.products?.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity} × KSh {item.unit_price?.toLocaleString()}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-800">KSh {(item.quantity * item.unit_price)?.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#D8F3DC] rounded-xl p-3 flex justify-between items-center">
                <span className="font-bold text-[#1B4332]">Total</span>
                <span className="text-lg font-bold text-[#2D6A4F]">KSh {selected.total_amount?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}