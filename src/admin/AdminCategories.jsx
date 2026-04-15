import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react'

const emptyForm = { name: '', slug: '', image_url: '' }

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchCategories() }, [])

  async function fetchCategories() {
    setLoading(true)
    const { data } = await supabase.from('categories').select('*').order('name')
    setCategories(data || [])
    setLoading(false)
  }

  const generateSlug = name => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const openEdit = cat => {
    setForm({ name: cat.name, slug: cat.slug, image_url: cat.image_url || '' })
    setEditing(cat.id)
    setShowForm(true)
  }

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true)
    const payload = { ...form, slug: form.slug || generateSlug(form.name) }
    if (editing) {
      await supabase.from('categories').update(payload).eq('id', editing)
    } else {
      await supabase.from('categories').insert(payload)
    }
    setSaving(false)
    setShowForm(false)
    setForm(emptyForm)
    setEditing(null)
    fetchCategories()
  }

  const handleDelete = async id => {
    if (!confirm('Delete this category? Products in it will become uncategorized.')) return
    await supabase.from('categories').delete().eq('id', id)
    fetchCategories()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-serif">Categories</h1>
          <p className="text-gray-400 text-sm">{categories.length} categories</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setEditing(null); setShowForm(true) }}
          className="bg-[#2D6A4F] text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-[#1B4332] transition-colors">
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          [...Array(6)].map((_, i) => <div key={i} className="h-24 bg-white border border-gray-100 rounded-2xl animate-pulse" />)
        ) : categories.map(cat => (
          <div key={cat.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
            <div className="w-14 h-14 bg-[#D8F3DC] rounded-xl flex items-center justify-center text-2xl shrink-0 overflow-hidden">
              {cat.image_url ? <img src={cat.image_url} alt="" className="w-full h-full object-cover" /> : '📦'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 truncate">{cat.name}</p>
              <p className="text-xs text-gray-400 font-mono truncate">{cat.slug}</p>
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => openEdit(cat)}
                className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition-colors">
                <Pencil size={13} />
              </button>
              <button onClick={() => handleDelete(cat.id)}
                className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:border-red-400 hover:text-red-400 transition-colors">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">{editing ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: generateSlug(e.target.value) }))}
                  required placeholder="e.g. Gift Bags"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2D6A4F]" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Slug</label>
                <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                  placeholder="auto-generated"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2D6A4F] font-mono text-xs" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Image URL</label>
                <input type="url" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                  placeholder="https://..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2D6A4F]" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="submit" disabled={saving}
                  className="flex-1 bg-[#2D6A4F] text-white py-3 rounded-xl font-semibold hover:bg-[#1B4332] transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                  {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={15} /> Save</>}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
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