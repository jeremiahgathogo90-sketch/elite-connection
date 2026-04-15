import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'

export default function CartPage() {
  const { cartItems, addToCart, removeFromCart, clearCart } = useCart()

  const updateQty = (item, delta) => {
    if (item.quantity + delta <= 0) {
      removeFromCart(item.id)
    } else {
      addToCart(item, delta)
    }
  }

  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const shipping = subtotal >= 2000 ? 0 : 200

  if (cartItems.length === 0) return (
    <div className="max-w-lg mx-auto text-center py-20 px-4">
      <ShoppingBag size={64} className="mx-auto text-gray-200 mb-4" />
      <h2 className="text-xl font-bold text-gray-700 font-serif mb-2">Your cart is empty</h2>
      <p className="text-gray-400 text-sm mb-6">Add some products to get started</p>
      <Link to="/products" className="bg-[#2D6A4F] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1B4332] transition-colors inline-flex items-center gap-2">
        Browse Products <ArrowRight size={16} />
      </Link>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 font-serif mb-6">Shopping Cart</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Cart items */}
        <div className="flex-1 space-y-3">
          {cartItems.map(item => (
            <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4">
              <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden shrink-0">
                {item.images?.[0] ? (
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">🛍️</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.slug}`} className="text-sm font-medium text-gray-800 hover:text-[#2D6A4F] line-clamp-2">{item.name}</Link>
                <p className="text-[#2D6A4F] font-bold mt-1">KSh {(item.price * item.quantity).toLocaleString()}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button onClick={() => updateQty(item, -1)} className="px-2 py-1 hover:bg-gray-50"><Minus size={12} /></button>
                    <span className="px-3 text-sm border-x border-gray-200">{item.quantity}</span>
                    <button onClick={() => updateQty(item, 1)} className="px-2 py-1 hover:bg-gray-50"><Plus size={12} /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button onClick={clearCart} className="text-sm text-gray-400 hover:text-red-400 transition-colors mt-2">
            Clear cart
          </button>
        </div>

        {/* Order summary */}
        <div className="w-full md:w-80 shrink-0">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 sticky top-28">
            <h2 className="font-bold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>KSh {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                  {shipping === 0 ? 'FREE' : `KSh ${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gray-400">Add KSh {(2000 - subtotal).toLocaleString()} more for free delivery</p>
              )}
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-base text-gray-800">
                <span>Total</span>
                <span className="text-[#2D6A4F]">KSh {(subtotal + shipping).toLocaleString()}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="w-full bg-[#2D6A4F] text-white py-3 rounded-xl font-semibold hover:bg-[#1B4332] transition-colors flex items-center justify-center gap-2"
            >
              Proceed to Checkout <ArrowRight size={16} />
            </Link>
            <Link to="/products" className="block text-center text-sm text-[#2D6A4F] mt-3 hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}