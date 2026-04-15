import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { User, Package, LogOut, Save } from 'lucide-react'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function AccountPage() {
  const { user, profile, signOut, updateProfile, loading } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('profile')
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [form, setForm] = useState({ full_name: '', phone: '', address: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!loading && !user) navigate('/login', { state: { from: '/account' } })
  }, [user, loading])

  useEffect(() => {
    if (profile) setForm({ full_name: profile.full_name || '', phone: profile.phone || '', address: profile.address || '' })
  }, [profile])

  useEffect(() => {
    if (tab === 'orders' && user) {
      setOrdersLoading(true)
      supabase.from('orders').select('*, order_items(*, products(name))')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false })
        .then(({ data }) => { setOrders(data || []); setOrdersLoading(false) })
    }
  }, [tab, user])

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateProfile(form)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      alert('Failed to save: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  if (loading) return <div className="flex items-center justify-center py-20"><span className="w-8 h-8 border-2 border-[#2D6A4F]/30 border-t-[#2D6A4F] rounded-full animate-spin" /></div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 font-serif">My Account</h1>
        <button onClick={handleSignOut} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors">
          <LogOut size={15} /> Sign out
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        {[{ key: 'profile', label: 'Profile', icon: User }, { key: 'orders', label: 'My Orders', icon: Package }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.key ? 'bg-white text-[#2D6A4F] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {tab === 'profile' && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 max-w-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-[#D8F3DC] rounded-full flex items-center justify-center text-[#2D6A4F] font-bold text-xl">
              {profile?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{profile?.full_name || 'Customer'}</p>
              <p className="text-sm text-gray-400">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Full Name</label>
              <input type="text" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                placeholder="Your full name"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D6A4F] transition-colors" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Phone Number</label>
              <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="07XX XXX XXX"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D6A4F] transition-colors" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Delivery Address</label>
              <textarea value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                placeholder="Your delivery address"
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D6A4F] transition-colors resize-none" />
            </div>
            <button type="submit" disabled={saving}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors ${saved ? 'bg-green-600 text-white' : 'bg-[#2D6A4F] text-white hover:bg-[#1B4332]'} disabled:opacity-60`}>
              <Save size={15} />
              {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}

      {/* Orders tab */}
      {tab === 'orders' && (
        <div>
          {ordersLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Package size={48} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No orders yet</p>
              <Link to="/products" className="text-[#2D6A4F] text-sm mt-2 inline-block hover:underline">Start shopping →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map(order => (
                <div key={order.id} className="bg-white border border-gray-100 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{order.order_number}</p>
                      <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusColors[order.status]}`}>{order.status}</span>
                      <span className="font-bold text-[#2D6A4F]">KSh {order.total_amount?.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 border-t border-gray-50 pt-2">
                    {order.order_items?.map(item => item.products?.name).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}