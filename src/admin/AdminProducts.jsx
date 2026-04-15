import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Plus, Pencil, Trash2, X, Save, Search } from 'lucide-react'
import ImageUploader from '../components/ImageUploader'

const emptyForm = {
  name: '', slug: '', description: '', price: '',
  compare_at_price: '', stock_quantity: '', category_id: '',
  is_featured: false, is_active: true, images: [],
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchAll()
    supabase.from('categories').select('*').then(({ data }) => setCategories(data || []))
  }, [])

  async function fetchAll() {
    setLoading(true)
    const { data } = await supabase
      .from('products')
      .select('*, categories(name)')
      .order('created_at', { ascending: false })
    setProducts(data || [])
    setLoading(false)
  }

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const generateSlug = name =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const openNew = () => {
    setForm(emptyForm)
    setEditing(null)
    setShowForm(true)
  }

  const openEdit = product => {
    setForm({
      name: product.name || '',
      slug: product.slug || '',
      description: product.description || '',
      price: product.price || '',
      compare_at_price: product.compare_at_price || '',
      stock_quantity: product.stock_quantity || '',
      category_id: product.category_id || '',
      is_featured: product.is_featured || false,
      is_active: product.is_active ?? true,
      images: product.images || [],
    })
    setEditing(product.id)
    setShowForm(true)
  }

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      slug: form.slug || generateSlug(form.name),
      price: parseFloat(form.price),
      compare_at_price: form.compare_at_price ? parseFloat(form.compare_at_price) : null,
      stock_quantity: parseInt(form.stock_quantity) || 0,
      category_id: form.category_id || null,
    }
    if (editing) {
      await supabase.from('products').update(payload).eq('id', editing)
    } else {
      await supabase.from('products').insert(payload)
    }
    setSaving(false)
    setShowForm(false)
    fetchAll()
  }

  const handleDelete = async id => {
    if (!confirm('Delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    fetchAll()
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-serif">Products</h1>
          <p className="text-gray-400 text-sm">{products.length} total products</p>
        </div>
        <button
          onClick={openNew}
          className="bg-[#2D6A4F] text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-[#1B4332] transition-colors"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#2D6A4F]"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    No products found
                  </td>
                </tr>
              ) : (
                filtered.map(product => (
                  <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    {/* Product */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg">🛍️</div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 truncate max-w-[180px]">{product.name}</p>
                          {product.is_featured && (
                            <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full font-semibold">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4 text-gray-500">
                      {product.categories?.name || '—'}
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-800">KSh {product.price?.toLocaleString()}</p>
                      {product.compare_at_price && (
                        <p className="text-xs text-gray-400 line-through">
                          KSh {product.compare_at_price?.toLocaleString()}
                        </p>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        product.stock_quantity === 0
                          ? 'bg-red-100 text-red-600'
                          : product.stock_quantity < 10
                          ? 'bg-orange-100 text-orange-600'
                          : 'bg-green-100 text-green-600'
                      }`}>
                        {product.stock_quantity === 0 ? 'Out of stock' : `${product.stock_quantity} units`}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        product.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:border-red-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">

            {/* Modal header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="font-bold text-gray-800">{editing ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {/* Modal form */}
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">

                {/* Name */}
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                    Product Name *
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={e => {
                      handleChange(e)
                      setForm(f => ({ ...f, slug: generateSlug(e.target.value) }))
                    }}
                    required
                    placeholder="e.g. Non-woven Bag Large"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2D6A4F]"
                  />
                </div>

                {/* Slug */}
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                    Slug
                  </label>
                  <input
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="auto-generated"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2D6A4F] font-mono text-xs"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                    Price (KSh) *
                  </label>
                  <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    required
                    placeholder="0"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2D6A4F]"
                  />
                </div>

                {/* Compare Price */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                    Compare Price (KSh)
                  </label>
                  <input
                    name="compare_at_price"
                    type="number"
                    value={form.compare_at_price}
                    onChange={handleChange}
                    placeholder="Original price"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2D6A4F]"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                    Stock Quantity
                  </label>
                  <input
                    name="stock_quantity"
                    type="number"
                    value={form.stock_quantity}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2D6A4F]"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                    Category
                  </label>
                  <select
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2D6A4F] bg-white"
                  >
                    <option value="">Select category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Product description..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2D6A4F] resize-none"
                  />
                </div>

                {/* Image Upload */}
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                    Product Images
                  </label>
                  <ImageUploader
                    images={form.images || []}
                    onChange={urls => setForm(f => ({ ...f, images: urls }))}
                  />
                </div>

                {/* Toggles */}
                <div className="col-span-2 flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_featured"
                      checked={form.is_featured}
                      onChange={handleChange}
                      className="accent-[#2D6A4F] w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">Featured product</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={form.is_active}
                      onChange={handleChange}
                      className="accent-[#2D6A4F] w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">Active (visible in store)</span>
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[#2D6A4F] text-white py-3 rounded-xl font-semibold hover:bg-[#1B4332] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {saving ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><Save size={15} /> {editing ? 'Save Changes' : 'Add Product'}</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}