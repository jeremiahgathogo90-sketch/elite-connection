import { Link } from 'react-router-dom'
import { Heart, ShoppingBag } from 'lucide-react'

export default function WishlistPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart size={32} className="text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 font-serif mb-2">Your Wishlist</h2>
        <p className="text-gray-400 text-sm mb-6">
          You haven't saved any products yet. Browse our store and click the heart icon to save items here.
        </p>
        <Link
          to="/products"
          className="bg-[#2D6A4F] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1B4332] transition-colors inline-flex items-center gap-2"
        >
          <ShoppingBag size={16} /> Browse Products
        </Link>
      </div>
    </div>
  )
}