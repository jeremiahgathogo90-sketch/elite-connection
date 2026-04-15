import { useEffect, useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import ProductCard from '../components/ProductCard'
import { SlidersHorizontal, X } from 'lucide-react'

export default function ProductsPage() {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') || ''

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(slug || '')
  const [sortBy, setSortBy] = useState('newest')
  const [loading, setLoading] = useState(true)
  const [filterOpen, setFilterOpen] = useState(false)

  useEffect(() => {
    supabase.from('categories').select('*').then(({ data }) => setCategories(data || []))
  }, [])

  useEffect(() => {
    setActiveCategory(slug || '')
  }, [slug])

  useEffect(() => {
    fetchProducts()
  }, [activeCategory, sortBy, searchQuery])

  async function fetchProducts() {
    setLoading(true)
    let query = supabase.from('products').select('*, categories(name,slug)').eq('is_active', true)

    if (activeCategory) {
      const cat = categories.find(c => c.slug === activeCategory)
      if (cat) query = query.eq('category_id', cat.id)
    }
    if (searchQuery) {
      query = query.ilike('name', `%${searchQuery}%`)
    }
    if (sortBy === 'newest') query = query.order('created_at', { ascending: false })
    else if (sortBy === 'price_asc') query = query.order('price', { ascending: true })
    else if (sortBy === 'price_desc') query = query.order('price', { ascending: false })

    const { data } = await query
    setProducts(data || [])
    setLoading(false)
  }

  const activeCategoryName = categories.find(c => c.slug === activeCategory)?.name || 'All Products'

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-400 mb-4">
        <Link to="/" className="hover:text-[#2D6A4F]">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{activeCategoryName}</span>
      </div>

      <div className="flex gap-6">
        {/* Sidebar — desktop */}
        <aside className="hidden md:block w-52 shrink-0">
          <div className="bg-white border border-gray-100 rounded-2xl p-4 sticky top-28">
            <p className="font-semibold text-sm text-gray-700 mb-3 uppercase tracking-wider">Categories</p>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => setActiveCategory('')}
                  className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${!activeCategory ? 'bg-[#2D6A4F] text-white font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  All Products
                </button>
              </li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => setActiveCategory(cat.slug)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${activeCategory === cat.slug ? 'bg-[#2D6A4F] text-white font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-5 gap-3">
            <div>
              <h1 className="text-xl font-bold text-gray-800 font-serif">{activeCategoryName}</h1>
              <p className="text-sm text-gray-400">{products.length} products</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="md:hidden flex items-center gap-1.5 text-sm border border-gray-200 px-3 py-2 rounded-lg"
              >
                <SlidersHorizontal size={14} /> Filter
              </button>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2D6A4F]"
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Mobile category filter */}
          {filterOpen && (
            <div className="md:hidden bg-white border border-gray-100 rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-sm">Categories</p>
                <button onClick={() => setFilterOpen(false)}><X size={16} /></button>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => { setActiveCategory(''); setFilterOpen(false) }}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${!activeCategory ? 'bg-[#2D6A4F] text-white border-[#2D6A4F]' : 'border-gray-200 text-gray-600'}`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { setActiveCategory(cat.slug); setFilterOpen(false) }}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${activeCategory === cat.slug ? 'bg-[#2D6A4F] text-white border-[#2D6A4F]' : 'border-gray-200 text-gray-600'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Products grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-2xl aspect-square animate-pulse" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <p className="text-5xl mb-4">📦</p>
              <p className="font-medium">No products found</p>
              <p className="text-sm mt-1">Try a different category or search term</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}