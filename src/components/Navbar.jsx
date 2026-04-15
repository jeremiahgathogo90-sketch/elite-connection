import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Heart, User, Menu, X, Search, LayoutDashboard } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { cartCount } = useCart()
  const { user, profile } = useAuth()

  const categories = [
    { name: 'Non-woven Bags', slug: 'non-woven-bags' },
    { name: 'Gift Bags', slug: 'gift-bags' },
    { name: 'Khaki Bags', slug: 'khaki-bags' },
    { name: 'Straws', slug: 'straws' },
    { name: 'Disposable Cups', slug: 'disposable-cups' },
    { name: 'Disposable Plates', slug: 'disposable-plates' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top bar */}
      <div className="bg-[#2D6A4F] text-white text-xs text-center py-1.5 px-4">
        📦 Free delivery within Nairobi CBD on orders above KSh 2,000 · Tel: 0723 041 535
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-10 h-10 bg-[#2D6A4F] rounded-xl flex items-center justify-center">
            <span className="text-[#F4D000] text-lg font-bold font-serif">E</span>
          </div>
          <div className="leading-tight">
            <p className="text-[#2D6A4F] font-bold text-base font-serif leading-none">
              Elite <span className="text-[#B8860B]">Connections</span>
            </p>
            <p className="text-[10px] tracking-widest text-gray-400 uppercase">Limited</p>
          </div>
        </Link>

        {/* Search bar - desktop */}
        <div className="hidden md:flex flex-1 max-w-lg">
          <div className="flex w-full border border-gray-200 rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Search products, brands and categories"
              className="flex-1 px-4 py-2 text-sm outline-none"
            />
            <button className="bg-[#2D6A4F] px-4 text-white hover:bg-[#1B4332] transition-colors">
              <Search size={16} />
            </button>
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-3">

          {/* Mobile search toggle */}
          <button className="md:hidden" onClick={() => setSearchOpen(!searchOpen)}>
            <Search size={20} className="text-gray-600" />
          </button>

          {/* Account area - desktop */}
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              {/* Admin button */}
              {profile?.is_admin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 text-xs font-semibold bg-[#2D6A4F] text-white px-3 py-1.5 rounded-lg hover:bg-[#1B4332] transition-colors"
                >
                  <LayoutDashboard size={13} />
                  Admin
                </Link>
              )}
              {/* Account link */}
              <Link
                to="/account"
                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#2D6A4F] transition-colors"
              >
                <div className="w-7 h-7 bg-[#D8F3DC] rounded-full flex items-center justify-center text-[#2D6A4F] text-xs font-bold">
                  {profile?.full_name?.[0] || user.email[0].toUpperCase()}
                </div>
                <span>{profile?.full_name?.split(' ')[0] || 'Account'}</span>
              </Link>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#2D6A4F] transition-colors"
            >
              <User size={20} />
              <span>Sign In</span>
            </Link>
          )}

          {/* Wishlist - desktop */}
          <Link
            to="/wishlist"
            className="hidden md:block text-gray-600 hover:text-[#2D6A4F] transition-colors"
          >
            <Heart size={20} />
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative text-gray-600 hover:text-[#2D6A4F] transition-colors">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#F4D000] text-[#1B4332] text-[10px] font-bold rounded-full flex items-center justify-center w-5 h-5">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

        </div>
      </div>

      {/* Search bar - mobile */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3">
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 px-3 py-2 text-sm outline-none"
            />
            <button className="bg-[#2D6A4F] px-4 text-white">
              <Search size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Categories nav - desktop */}
      <nav className="hidden md:block border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center gap-6 overflow-x-auto py-2.5 text-sm">
            <li>
              <Link
                to="/products"
                className="font-medium text-[#2D6A4F] whitespace-nowrap"
              >
                All Products
              </Link>
            </li>
            {categories.map(cat => (
              <li key={cat.slug}>
                <Link
                  to={`/category/${cat.slug}`}
                  className="text-gray-600 hover:text-[#2D6A4F] whitespace-nowrap transition-colors"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3">
          <ul className="space-y-3 text-sm">

            {/* Admin link - mobile */}
            {profile?.is_admin && (
              <li>
                <Link
                  to="/admin"
                  className="flex items-center gap-2 font-semibold text-white bg-[#2D6A4F] px-3 py-2 rounded-lg w-fit"
                  onClick={() => setMenuOpen(false)}
                >
                  <LayoutDashboard size={15} />
                  Admin Dashboard
                </Link>
              </li>
            )}

            <li>
              <Link
                to="/products"
                className="font-medium text-[#2D6A4F]"
                onClick={() => setMenuOpen(false)}
              >
                All Products
              </Link>
            </li>

            {categories.map(cat => (
              <li key={cat.slug}>
                <Link
                  to={`/category/${cat.slug}`}
                  className="text-gray-600"
                  onClick={() => setMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              </li>
            ))}

            <li className="pt-2 border-t border-gray-100">
              {user ? (
                <Link
                  to="/account"
                  className="flex items-center gap-2 text-gray-600"
                  onClick={() => setMenuOpen(false)}
                >
                  <div className="w-6 h-6 bg-[#D8F3DC] rounded-full flex items-center justify-center text-[#2D6A4F] text-xs font-bold">
                    {profile?.full_name?.[0] || user.email[0].toUpperCase()}
                  </div>
                  {profile?.full_name?.split(' ')[0] || 'My Account'}
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-gray-600"
                  onClick={() => setMenuOpen(false)}
                >
                  <User size={16} /> Sign In
                </Link>
              )}
            </li>

            <li>
              <Link
                to="/wishlist"
                className="flex items-center gap-2 text-gray-600"
                onClick={() => setMenuOpen(false)}
              >
                <Heart size={16} /> Wishlist
              </Link>
            </li>

          </ul>
        </div>
      )}
    </header>
  )
}