import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { CheckCircle, ShoppingBag } from 'lucide-react'

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart()
  const { user, profile } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
    notes: '',
    payment: 'mpesa',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [orderPlaced, setOrderPlaced] = useState(null)

  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const shipping = subtotal >= 2000 ? 0 : 200
  const total = subtotal + shipping

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!user) { navigate('/login', { state: { from: '/checkout' } }); return }
    if (cartItems.length === 0) return

    setLoading(true)
    setError('')

    try {
      const orderNumber = `EC-${Date.now().toString().slice(-8)}`

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_id: user.id,
          status: 'pending',
          total_amount: total,
          shipping_address: `${form.full_name}, ${form.phone}, ${form.address}`,
          notes: form.notes,
        })
        .select()
        .single()

      if (orderError) throw orderError

      const items = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
      }))

      const { error: itemsError } = await supabase.from('order_items').insert(items)
      if (itemsError) throw itemsError

      clearCart()
      setOrderPlaced(order)
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Success screen
  if (orderPlaced) return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <CheckCircle size={64} className="mx-auto text-[#2D6A4F] mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 font-serif mb-2">Order Placed!</h2>
        <p className="text-gray-500 text-sm mb-2">Thank you for your order 🎉</p>
        <div className="bg-[#D8F3DC] rounded-xl px-6 py-4 mb-6">
          <p className="text-xs text-gray-500 mb-1">Order number</p>
          <p className="text-lg font-bold text-[#1B4332]">{orderPlaced.order_number}</p>
          <p className="text-[#2D6A4F] font-semibold mt-1">KSh {orderPlaced.total_amount?.toLocaleString()}</p>
        </div>
        <p className="text-sm text-gray-400 mb-6">
          We'll call you on <strong>{form.phone}</strong> to confirm your order and arrange delivery.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/account" className="bg-[#2D6A4F] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1B4332] transition-colors">
            View Orders
          </Link>
          <Link to="/products" className="border border-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )

  if (cartItems.length === 0) return (
    <div className="text-center py-20 px-4">
      <ShoppingBag size={48} className="mx-auto text-gray-200 mb-4" />
      <p className="text-gray-500 mb-4">Your cart is empty</p>
      <Link to="/products" className="text-[#2D6A4F] text-sm hover:underline">← Browse products</Link>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 font-serif mb-6">Checkout</h1>

      {!user && (
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-3 mb-6 text-sm text-yellow-700 flex items-center gap-2">
          <span>⚠️</span>
          <span>You need to <Link to="/login" state={{ from: '/checkout' }} className="font-semibold underline">sign in</Link> to complete your order.</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-5">
          {/* Delivery details */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h2 className="font-bold text-gray-800 mb-4">Delivery Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Full Name</label>
                <input type="text" name="full_name" value={form.full_name} onChange={handleChange} required
                  placeholder="Jane Wanjiku"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D6A4F] transition-colors" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Phone Number</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} required
                  placeholder="07XX XXX XXX"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D6A4F] transition-colors" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Delivery Address</label>
                <textarea name="address" value={form.address} onChange={handleChange} required
                  placeholder="e.g. Tom Mboya Street, Nairobi CBD, near GPO"
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D6A4F] transition-colors resize-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Order Notes (optional)</label>
                <textarea name="notes" value={form.notes} onChange={handleChange}
                  placeholder="Any special instructions..."
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D6A4F] transition-colors resize-none" />
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h2 className="font-bold text-gray-800 mb-4">Payment Method</h2>
            <div className="space-y-2">
              {[
                { value: 'mpesa', label: 'M-Pesa', desc: 'Pay via M-Pesa Paybill or Till', emoji: '📱' },
                { value: 'cash', label: 'Cash on Delivery', desc: 'Pay when your order arrives', emoji: '💵' },
                { value: 'bank', label: 'Bank Transfer', desc: 'Pay via bank transfer', emoji: '🏦' },
              ].map(opt => (
                <label key={opt.value}
                  className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${form.payment === opt.value ? 'border-[#2D6A4F] bg-[#D8F3DC]/30' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="payment" value={opt.value} checked={form.payment === opt.value} onChange={handleChange} className="accent-[#2D6A4F]" />
                  <span className="text-xl">{opt.emoji}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{opt.label}</p>
                    <p className="text-xs text-gray-400">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
          )}

          <button type="submit" disabled={loading || !user}
            className="w-full bg-[#2D6A4F] text-white py-4 rounded-xl font-bold text-base hover:bg-[#1B4332] transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
            {loading
              ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : `Place Order · KSh ${total.toLocaleString()}`
            }
          </button>
        </form>

        {/* Order summary */}
        <div className="w-full md:w-80 shrink-0">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 sticky top-28">
            <h2 className="font-bold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                    {item.images?.[0]
                      ? <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-lg">🛍️</div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 line-clamp-2 leading-snug">{item.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-xs font-semibold text-gray-700 shrink-0">KSh {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span><span>KSh {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>{shipping === 0 ? 'FREE' : `KSh ${shipping}`}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-1 border-t border-gray-100">
                <span>Total</span>
                <span className="text-[#2D6A4F]">KSh {total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}