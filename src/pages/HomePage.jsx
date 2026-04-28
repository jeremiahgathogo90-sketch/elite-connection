import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import ProductCard from '../components/ProductCard'
import { ArrowRight, Package, Truck, ShieldCheck, Phone, Flame, Star } from 'lucide-react'

const categoryIcons = {
  'non-woven-bags': '🛍️',
  'gift-bags': '🎁',
  'khaki-bags': '👜',
  'straws': '🥤',
  'disposable-cups': '☕',
  'disposable-plates': '🍽️',
  'nigerian-bags': '👜',
  'tapes': '🎀',
  'happy-birthday-bags': '🎉',
  '3d-bags': '🎒',
  '3d-bag': '🎒',
  'd-cut-bags': '🛍️',
  'd-cut-bag': '🛍️',
  '4d-bags': '🛍️',
  '4d-bag': '🛍️',
  'sinny-bags': '👛',
  'shinny-bags': '👛',
  'smart-bags': '💼',
  'flower-bags-import': '🌸',
  'flower-bags-local': '🌺',
  'foil': '✨',
  'nets': '🪢',
  'roll-net': '🪢',
  'ropes': '🪢',
  'sacks': '🧺',
  'scarbers': '📦',
  'cling-film': '🎬',
}

export default function HomePage() {
  const [categories, setCategories] = useState([])
  const [featured, setFeatured] = useState([])
  const [newItems, setNewItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const [{ data: featuredProds }, { data: newProds }, { data: cats }] = await Promise.all([
        supabase.from('products').select('*').eq('is_featured', true).eq('is_active', true).limit(10),
        supabase.from('products').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(10),
        supabase.from('categories').select('*').order('name'),
      ])
      setFeatured(featuredProds || [])
      setNewItems(newProds || [])
      setCategories(cats || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  function ProductGrid({ products }) {
    if (loading) {
      return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl aspect-square animate-pulse" />
          ))}
        </div>
      )
    }
    if (products.length === 0) {
      return (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-3">🛍️</p>
          <p className="text-sm">No products here yet. Add some from the admin panel!</p>
        </div>
      )
    }
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    )
  }

  function CategoryCard({ cat }) {
    return (
      <Link
        key={cat.id}
        to={`/category/${cat.slug}`}
        className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-[#2D6A4F] hover:shadow-sm transition-all group"
      >
        <div className="w-12 h-12 bg-[#D8F3DC] rounded-xl flex items-center justify-center text-2xl group-hover:bg-[#2D6A4F] transition-colors">
          <span className="group-hover:scale-110 transition-transform inline-block">
            {categoryIcons[cat.slug] || '📦'}
          </span>
        </div>
        <p className="text-xs text-center text-gray-600 group-hover:text-[#2D6A4F] font-medium leading-tight">
          {cat.name}
        </p>
      </Link>
    )
  }

  return (
    <main>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#52B788] text-white py-8 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          <div className="flex-1">
            <p className="text-[#F4D000] text-xs font-semibold tracking-widest uppercase mb-2">
              Nairobi's Premier Packaging Store
            </p>
            <h1 className="text-2xl md:text-3xl font-bold font-serif leading-tight mb-3">
              Quality Bags &amp; Packaging Solutions
            </h1>
            <p className="text-green-200 text-sm mb-5 max-w-md">
              Non-woven bags, gift bags, khaki bags, straws, disposable cups &amp; plates.
              Wholesale &amp; retail across Kenya.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link
                to="/products"
                className="bg-[#F4D000] text-[#1B4332] font-bold px-5 py-2.5 rounded-xl hover:bg-yellow-300 transition-colors flex items-center gap-2 text-sm"
              >
                Shop Now <ArrowRight size={15} />
              </Link>
              <a
                href="tel:0723041535"
                className="border border-white border-opacity-40 text-white px-5 py-2.5 rounded-xl hover:bg-white hover:bg-opacity-10 transition-colors flex items-center gap-2 text-sm"
              >
                <Phone size={15} /> Call Us
              </a>
            </div>
          </div>

          {/* Icons row - desktop only */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {['🛍️', '🎁', '👜', '🥤', '☕', '🍽️'].map((icon, i) => (
              <div
                key={i}
                className="w-12 h-12 bg-white bg-opacity-10 rounded-xl flex items-center justify-center text-xl"
              >
                {icon}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="bg-[#F4D000] py-3">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-6 text-[#1B4332] text-sm font-medium">
          <span className="flex items-center gap-2">
            <Truck size={16} /> Free CBD delivery over KSh 2,000
          </span>
          <span className="flex items-center gap-2">
            <Package size={16} /> Wholesale &amp; Retail
          </span>
          <span className="flex items-center gap-2">
            <ShieldCheck size={16} /> Quality Guaranteed
          </span>
          <span className="flex items-center gap-2">
            <Phone size={16} /> 0723 041 535
          </span>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-[#2D6A4F] rounded-full"></div>
            <h2 className="text-xl font-bold text-gray-800 font-serif">Shop by Category</h2>
          </div>
          <Link
            to="/products"
            className="text-[#2D6A4F] text-sm font-medium hover:underline flex items-center gap-1"
          >
            See All <ArrowRight size={14} />
          </Link>
        </div>

        {/* Mobile: exactly 2 rows x 2 cols = 4 items */}
        <div className="grid grid-cols-2 gap-3 sm:hidden">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-24 animate-pulse" />
            ))
          ) : (
            categories.slice(0, 4).map(cat => (
              <CategoryCard key={cat.id} cat={cat} />
            ))
          )}
        </div>

        {/* Desktop: exactly 2 rows x 4 cols = 8 items */}
        <div className="hidden sm:grid sm:grid-cols-4 gap-3">
          {loading ? (
            [...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-24 animate-pulse" />
            ))
          ) : (
            categories.slice(0, 8).map(cat => (
              <CategoryCard key={cat.id} cat={cat} />
            ))
          )}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="border-t border-gray-100" />
      </div>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-[#F4D000] rounded-full"></div>
            <div className="w-8 h-8 bg-[#F4D000] rounded-lg flex items-center justify-center">
              <Star size={16} className="text-[#1B4332]" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 font-serif">Featured Products</h2>
          </div>
          <Link
            to="/products"
            className="text-[#2D6A4F] text-sm font-medium hover:underline flex items-center gap-1"
          >
            See All <ArrowRight size={14} />
          </Link>
        </div>
        <ProductGrid products={featured} />
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="border-t border-gray-100" />
      </div>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-[#2D6A4F] rounded-full"></div>
            <div className="w-8 h-8 bg-[#2D6A4F] rounded-lg flex items-center justify-center">
              <Flame size={16} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 font-serif">New Arrivals</h2>
          </div>
          <Link
            to="/products"
            className="text-[#2D6A4F] text-sm font-medium hover:underline flex items-center gap-1"
          >
            See All <ArrowRight size={14} />
          </Link>
        </div>
        <ProductGrid products={newItems} />
      </section>

      {/* CTA Banner */}
      <section className="bg-[#1B4332] text-white py-12 px-4 text-center mt-4">
        <h2 className="text-2xl font-bold font-serif mb-2">Need a Custom Order?</h2>
        <p className="text-green-300 mb-6">
          Specify your size, color, quantity and branding — we'll deliver exactly what you need.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            to="/custom-order"
            className="bg-[#F4D000] text-[#1B4332] font-bold px-8 py-3 rounded-xl hover:bg-yellow-300 transition-colors inline-flex items-center gap-2"
          >
            <Package size={16} /> Request Custom Order
          </Link>
          <a
            href="tel:0723041535"
            className="border border-white border-opacity-40 text-white px-8 py-3 rounded-xl hover:bg-white hover:bg-opacity-10 transition-colors inline-flex items-center gap-2"
          >
            <Phone size={16} /> Call 0723 041 535
          </a>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/254723041535"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[#20BA5A] transition-all hover:scale-105"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="white"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span className="text-sm font-semibold">Chat with us</span>
      </a>

    </main>
  )
}