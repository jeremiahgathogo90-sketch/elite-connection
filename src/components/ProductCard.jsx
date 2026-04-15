import { Link } from 'react-router-dom'
import { ShoppingCart, Heart } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  const discount = product.compare_at_price
    ? Math.round((1 - product.price / product.compare_at_price) * 100)
    : null

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow group">
      <Link to={`/product/${product.slug}`} className="block relative overflow-hidden aspect-square bg-gray-50">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">🛍️</div>
        )}
        {discount && (
          <span className="absolute top-2 left-2 bg-[#F4D000] text-[#1B4332] text-xs font-bold px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}
        <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:text-red-400">
          <Heart size={14} />
        </button>
      </Link>

      <div className="p-3">
        <Link to={`/product/${product.slug}`}>
          <p className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-[#2D6A4F] transition-colors leading-snug">
            {product.name}
          </p>
        </Link>
        <div className="flex items-center justify-between mt-2">
          <div>
            <span className="text-[#2D6A4F] font-bold text-base">KSh {product.price?.toLocaleString()}</span>
            {product.compare_at_price && (
              <span className="text-gray-400 text-xs line-through ml-1.5">KSh {product.compare_at_price?.toLocaleString()}</span>
            )}
          </div>
          <button
            onClick={() => addToCart(product)}
            className="w-8 h-8 bg-[#2D6A4F] text-white rounded-full flex items-center justify-center hover:bg-[#1B4332] transition-colors"
          >
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}