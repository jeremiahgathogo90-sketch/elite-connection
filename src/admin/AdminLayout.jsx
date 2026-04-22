import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Package, Tag, ShoppingBag,
  Users, Image, LogOut, Menu, X, Store, ClipboardList
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { label: 'Products', icon: Package, path: '/admin/products' },
  { label: 'Categories', icon: Tag, path: '/admin/categories' },
  { label: 'Orders', icon: ShoppingBag, path: '/admin/orders' },
  { label: 'Customers', icon: Users, path: '/admin/customers' },
  { label: 'Banners', icon: Image, path: '/admin/banners' },
  { label: 'Custom Orders', icon: ClipboardList, path: '/admin/custom-orders' },
]

export default function AdminLayout({ children }) {
  const { profile, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">

      {/* Sidebar — fixed height, independent scroll */}
      <aside
        className={`${
          sidebarOpen ? 'w-56' : 'w-0 md:w-16'
        } shrink-0 transition-all duration-200 bg-white border-r border-gray-100 flex flex-col h-screen overflow-hidden`}
        style={{ position: 'sticky', top: 0, height: '100vh' }}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 bg-[#2D6A4F] rounded-xl flex items-center justify-center shrink-0">
            <span className="text-[#F4D000] font-bold font-serif text-base">E</span>
          </div>
          {sidebarOpen && (
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#2D6A4F] font-serif truncate">Elite Connections</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Admin Panel</p>
            </div>
          )}
        </div>

        {/* Nav items — scrollable */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const active =
              location.pathname === item.path ||
              (item.path !== '/admin' && location.pathname.startsWith(item.path))
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-[#2D6A4F] text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#2D6A4F]'
                }`}
              >
                <item.icon size={18} className="shrink-0" />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Bottom actions — always visible */}
        <div className="p-2 border-t border-gray-100 space-y-0.5 shrink-0">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-[#D8F3DC] hover:text-[#2D6A4F] transition-colors"
          >
            <Store size={18} className="shrink-0" />
            {sidebarOpen && <span>View Store</span>}
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <LogOut size={18} className="shrink-0" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main content — independent scroll */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

        {/* Top bar — sticky */}
        <header className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span className="text-sm font-medium text-gray-500">Store Management</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden md:flex items-center gap-1.5 text-xs text-[#2D6A4F] font-semibold border border-[#2D6A4F] border-opacity-30 px-3 py-1.5 rounded-lg hover:bg-[#D8F3DC] transition-colors"
            >
              <Store size={13} />
              View Store
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#D8F3DC] rounded-full flex items-center justify-center text-[#2D6A4F] text-sm font-bold">
                {profile?.full_name?.[0] || 'A'}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden md:block">
                {profile?.full_name || 'Admin'}
              </span>
            </div>
          </div>
        </header>

        {/* Page content — this part scrolls */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}