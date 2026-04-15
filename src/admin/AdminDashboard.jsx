import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { TrendingUp, ShoppingBag, Package, Users, AlertCircle, Plus, Tag, Image, Zap } from 'lucide-react'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ revenue: 0, orders: 0, products: 0, customers: 0 })
  const [recentOrders, setRecentOrders] = useState([])
  const [lowStock, setLowStock] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const [
        { data: orders },
        { count: productCount },
        { count: customerCount },
        { data: lowStockProducts },
      ] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('customer_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*').lt('stock_quantity', 10).eq('is_active', true).order('stock_quantity'),
      ])

      const revenue = orders?.filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0

      setStats({
        revenue,
        orders: orders?.length || 0,
        products: productCount || 0,
        customers: customerCount || 0,
      })
      setRecentOrders(orders?.slice(0, 6) || [])
      setLowStock(lowStockProducts || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  const statCards = [
    { label: 'Total Revenue', value: `KSh ${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: 'bg-[#D8F3DC] text-[#2D6A4F]', link: '/admin/orders' },
    { label: 'Total Orders', value: stats.orders, icon: ShoppingBag, color: 'bg-blue-50 text-blue-600', link: '/admin/orders' },
    { label: 'Active Products', value: stats.products, icon: Package, color: 'bg-purple-50 text-purple-600', link: '/admin/products' },
    { label: 'Customers', value: stats.customers, icon: Users, color: 'bg-orange-50 text-orange-600', link: '/admin/customers' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 font-serif">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-0.5">Welcome back! Here's what's happening in your store.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map(card => (
          <Link key={card.label} to={card.link}
            className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-sm transition-shadow group">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon size={20} />
              </div>
              <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{loading ? '...' : card.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-[#2D6A4F] hover:underline">View all</Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-50 rounded-xl animate-pulse" />)}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <ShoppingBag size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{order.order_number}</p>
                    <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                    <span className="text-sm font-bold text-gray-700">KSh {order.total_amount?.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low stock */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <AlertCircle size={16} className="text-orange-400" /> Low Stock
            </h2>
            <Link to="/admin/products" className="text-sm text-[#2D6A4F] hover:underline">Manage</Link>
          </div>
          {lowStock.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-2xl mb-1">✅</p>
              <p className="text-sm">All products well stocked</p>
            </div>
          ) : (
            <div className="space-y-2">
              {lowStock.map(p => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <p className="text-sm text-gray-700 truncate max-w-[140px]">{p.name}</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.stock_quantity === 0 ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                    {p.stock_quantity === 0 ? 'Out of stock' : `${p.stock_quantity} left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <h2 className="font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Add Product', icon: Package, link: '/admin/products?new=1', color: 'text-[#2D6A4F] bg-[#D8F3DC]' },
            { label: 'Add Category', icon: Tag, link: '/admin/categories?new=1', color: 'text-blue-600 bg-blue-50' },
            { label: 'Add Banner', icon: Image, link: '/admin/banners?new=1', color: 'text-purple-600 bg-purple-50' },
            { label: 'View Orders', icon: ShoppingBag, link: '/admin/orders', color: 'text-orange-600 bg-orange-50' },
          ].map(action => (
            <Link key={action.label} to={action.link}
              className="flex flex-col items-center gap-2 p-4 border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-sm transition-all">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.color}`}>
                <action.icon size={20} />
              </div>
              <span className="text-xs font-medium text-gray-600 text-center">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function ChevronRight({ size, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}