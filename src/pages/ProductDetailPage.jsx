import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'
import { ShoppingCart, Heart, ArrowLeft, Minus, Plus, Phone } from 'lucide-react'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [qty, setQty] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true)
      const { data } = await supabase
        .from('products')
        .select('*, categories(name, slug)')
        .eq('slug', slug)
        .single()
      setProduct(data)
      setLoading(false)

      if (data?.category_id) {
        const { data: rel } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', data.category_id)
          .neq('id', data.id)
          .eq('is_active', true)
          .limit(4)
        setRelated(rel || [])
      }
    }
    fetchProduct()
    setQty(1)
    setActiveImage(0)
  }, [slug])

  const handleAddToCart = () => {
    addToCart(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const discount = product?.compare_at_price
    ? Math.round((1 - product.price / product.compare_at_price) * 100)
    : null

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-100 rounded-2xl aspect-square animate-pulse" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => <div key={i} className="bg-gray-100 rounded-lg h-6 animate-pulse" />)}
        </div>
      </div>
    </div>
  )

  if (!product) return (
    <div className="text-center py-20 text-gray-400">
      <p className="text-5xl mb-4">😕</p>
      <p>Product not found</p>
      <Link to="/products" className="text-[#2D6A4F] text-sm mt-2 inline-block hover:underline">← Back to products</Link>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-400 mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-[#2D6A4F]">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-[#2D6A4F]">Products</Link>
        {product.categories && <>
          <span>/</span>
          <Link to={`/category/${product.categories.slug}`} className="hover:text-[#2D6A4F]">{product.categories.name}</Link>
        </>}
        <span>/</span>
        <span className="text-gray-700 truncate max-w-xs">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Images */}
        <div>
          <div className="bg-gray-50 rounded-2xl overflow-hidden aspect-square mb-3 border border-gray-100">
            {product.images?.[activeImage] ? (
              <img src={product.images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">🛍️</div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-colors ${activeImage === i ? 'border-[#2D6A4F]' : 'border-transparent'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.categories && (
            <Link to={`/category/${product.categories.slug}`} className="text-[#2D6A4F] text-xs font-semibold uppercase tracking-wider hover:underline">
              {product.categories.name}
            </Link>
          )}
          <h1 className="text-2xl font-bold text-gray-800 font-serif mt-1 mb-3">{product.name}</h1>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-bold text-[#2D6A4F]">KSh {product.price?.toLocaleString()}</span>
            {product.compare_at_price && (
              <>
                <span className="text-gray-400 line-through text-lg">KSh {product.compare_at_price?.toLocaleString()}</span>
                <span className="bg-[#F4D000] text-[#1B4332] text-xs font-bold px-2 py-0.5 rounded-full">-{discount}%</span>
              </>
            )}
          </div>

          {product.description && (
            <p className="text-gray-600 text-sm leading-relaxed mb-6 border-t border-gray-100 pt-4">{product.description}</p>
          )}

          {/* Stock */}
          <p className={`text-sm font-medium mb-4 ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {product.stock_quantity > 0 ? `✓ In Stock (${product.stock_quantity} available)` : '✗ Out of Stock'}
          </p>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-5">
            <p className="text-sm font-medium text-gray-700">Quantity:</p>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-gray-50 transition-colors">
                <Minus size={14} />
              </button>
              <span className="px-4 py-2 text-sm font-medium border-x border-gray-200 min-w-[2.5rem] text-center">{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock_quantity, q + 1))} className="px-3 py-2 hover:bg-gray-50 transition-colors">
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold transition-all ${added ? 'bg-green-600 text-white' : 'bg-[#2D6A4F] text-white hover:bg-[#1B4332]'} disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              <ShoppingCart size={18} />
              {added ? 'Added to Cart!' : 'Add to Cart'}
            </button>
            <button className="w-12 h-12 border border-gray-200 rounded-xl flex items-center justify-center hover:border-red-400 hover:text-red-400 transition-colors">
              <Heart size={18} />
            </button>
          </div>

          {/* Contact for bulk */}
          <div className="bg-[#D8F3DC] rounded-xl p-4 flex items-center gap-3">
            <Phone size={18} className="text-[#2D6A4F] shrink-0" />
            <div>
              <p className="text-sm font-semibold text-[#1B4332]">Need bulk order pricing?</p>
              <a href="tel:0723041535" className="text-[#2D6A4F] text-sm hover:underline">Call 0723 041 535</a>
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-800 font-serif mb-5">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}