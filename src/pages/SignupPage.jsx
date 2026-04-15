import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, UserPlus } from 'lucide-react'

export default function SignupPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirm: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      await signUp({ email: form.email, password: form.password, fullName: form.fullName, phone: form.phone })
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Sign up failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="text-5xl mb-4">📧</div>
        <h2 className="text-xl font-bold text-gray-800 font-serif mb-2">Check your email!</h2>
        <p className="text-gray-500 text-sm mb-6">
          We sent a confirmation link to <strong>{form.email}</strong>. Click it to activate your account.
        </p>
        <Link to="/login" className="text-[#2D6A4F] font-medium hover:underline text-sm">Back to Login →</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#2D6A4F] rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-[#F4D000] text-2xl font-bold font-serif">E</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 font-serif">Create account</h1>
          <p className="text-gray-400 text-sm mt-1">Join Elite Connections today</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Full Name</label>
              <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required
                placeholder="Jane Wanjiku"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D6A4F] transition-colors" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Email address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required
                placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D6A4F] transition-colors" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Phone Number</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                placeholder="0712 345 678"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D6A4F] transition-colors" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Password</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} required
                  placeholder="Min. 6 characters"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D6A4F] transition-colors pr-11" />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Confirm Password</label>
              <input type="password" name="confirm" value={form.confirm} onChange={handleChange} required
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D6A4F] transition-colors" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-[#2D6A4F] text-white py-3 rounded-xl font-semibold hover:bg-[#1B4332] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 mt-2">
              {loading
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><UserPlus size={16} /> Create Account</>
              }
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#2D6A4F] font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}