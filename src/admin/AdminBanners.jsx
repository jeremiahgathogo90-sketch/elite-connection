import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Plus, Pencil, Trash2, X, Save, Eye, EyeOff } from 'lucide-react'

const emptyForm = { title: '', subtitle: '', image_url: '', link: '', is_active: true, sort_order: 0 }

export default function AdminBanners() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchBanners() }, [])

  async function fetchBanners() {
    setLoading(true)
    const { data } = await supabase.from('banners').select('*').order('sort_order')
    setBanners(data || [])
    setLoading(false)
  }

  const openEdit = b => {
    setForm({ title: b.title || '', subtitle: b.subtitle || '', image_url: b.image_url || '', link: b.link || '', is_active: b.is_active, sort_order: b.sort_order || 0 })
    setEditing(b.id)
    setShowForm(true)
  }

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true)
    if (editing) {
      await supabase.from('banners').update(form).eq('id', editing)
    } else {
      await supabase.from('banners').insert(form)
    }
    setSaving(false)
    setShowForm(false)
    setForm(emptyForm)
    setEditing(null)
    fetchBanners()
  }

  const toggleActive = async (id, current) => {
    await supabase.from('banners').update({ is_active: !current }).eq('id', id)
    fetchBanners()
  }

  const handleDelete = async id => {
    if (!confirm('Delete this banner?')) return
    await supabase.from('banners').delete().eq('id', id)
    fetchBanners()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-serif">Banners</h1>
          <p className="text-gray-400 text-sm">Manage homepage banners</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setEditing(null); setShowForm(true) }}
          className="bg-[#2D6A4F] text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-[#1B4332] transition-colors">
          <Plus size={16} /> Add Banner
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {loading ? (
          [...Array(3)].map((_, i) => <div key={i} className="h-36 bg-white border border-gray-100 rounded-2xl animate-pulse" />)
        ) : banners.length === 0 ? (
          <div className="col-span-2 text-center py-16 text-gray-400 bg-white border border-gray-100 rounded-2xl">
            <p className="text-4xl mb-2">🖼️</p>
            <p>No banners yet. Add one to showcase on the homepage.</p>
          </div>
        ) : banners.map(banner => (
          <div key={banner.id} className={`bg-white border rounded-2xl overflow-hidden ${banner.is_active ? 'border-gray-100' : 'border-gray-100 opacity-60'}`}>
            {banner.image_url && (
              <div className="h-32 bg-gray-100 overflow-hidden">
                <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-gray-800 truncate">{banner.title || 'Untitled banner'}</p>
                {banner.subtitle && <p className="text-xs text-gray-400 truncate mt-0.5">{banner.subtitle}</p>}
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1.5 inline-block ${banner.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                  {banner.is_active ? 'Active' : 'Hidden'}
                </span>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button onClick={() => toggleActive(banner.id, banner.is_active)}
                  className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition-colors">
                  {banner.is_active ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
                <button onClick={() => openEdit(banner)}
                  className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition-colors">
                  <Pencil size={13} />
                </button>
                <button onClick={() => handleDelete(banner.id)}
                  className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:border-red-400 hover:text-red-400 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">{editing ? 'Edit Banner' : 'Add Banner'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              {[
                { label: 'Title', key: 'title', placeholder: 'e.g. New Arrivals' },
                { label: 'Subtitle', key: 'subtitle', placeholder: 'e.g. Shop our latest collection' },
                { label: 'Image URL', key: 'image_url', placeholder: 'https://...', type: 'url' },
                { label: 'Link URL', key: 'link', placeholder: '/products or /category/gift-bags' },
              ].map(field => (
                <div key={field.key}>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">{field.label}</label>
                  <input type={field.type || 'text'} value={form[field.key]} onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2D6A4F]" />
                </div>
              ))}
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="accent-[#2D6A4F] w-4 h-4" />
                <span className="text-sm text-gray-700">Active (show on homepage)</span>
              </label>
              <div className="flex gap-3 pt-1">
                <button type="submit" disabled={saving}
                  className="flex-1 bg-[#2D6A4F] text-white py-3 rounded-xl font-semibold hover:bg-[#1B4332] transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                  {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={15} /> Save</>}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
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