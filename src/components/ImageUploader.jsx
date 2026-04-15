import { useState, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'
import { compressImage, formatFileSize } from '../utils/imageUtils'
import { Upload, X, ImagePlus, CheckCircle, Loader } from 'lucide-react'

export default function ImageUploader({ images = [], onChange }) {
  const inputRef = useRef()
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [uploadStatus, setUploadStatus] = useState([]) // [{name, originalSize, compressedSize, status}]

  const handleFiles = async (files) => {
    if (!files?.length) return
    setUploading(true)

    const newStatuses = []
    const newUrls = []

    for (const file of files) {
      if (!file.type.startsWith('image/')) continue

      const statusEntry = {
        name: file.name,
        originalSize: file.size,
        compressedSize: 0,
        status: 'compressing',
      }
      newStatuses.push(statusEntry)
      setUploadStatus(prev => [...prev, { ...statusEntry }])

      try {
        // Compress
        const compressed = await compressImage(file)
        statusEntry.compressedSize = compressed.size
        statusEntry.status = 'uploading'
        setUploadStatus(prev => prev.map(s =>
          s.name === file.name ? { ...statusEntry } : s
        ))

        // Upload to Supabase Storage
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`
        const { data, error } = await supabase.storage
          .from('products')
          .upload(fileName, compressed, { contentType: 'image/webp', upsert: false })

        if (error) throw error

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(data.path)

        newUrls.push(publicUrl)
        statusEntry.status = 'done'
        setUploadStatus(prev => prev.map(s =>
          s.name === file.name ? { ...statusEntry } : s
        ))
      } catch (err) {
        statusEntry.status = 'error'
        setUploadStatus(prev => prev.map(s =>
          s.name === file.name ? { ...statusEntry } : s
        ))
        console.error('Upload error:', err)
      }
    }

    onChange([...images, ...newUrls])
    setUploading(false)

    // Clear statuses after 3 seconds
    setTimeout(() => setUploadStatus([]), 3000)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  const removeImage = async (url, idx) => {
    // Extract path from URL and delete from storage
    try {
      const path = url.split('/products/')[1]
      if (path) await supabase.storage.from('products').remove([path])
    } catch (e) { /* ignore */ }
    onChange(images.filter((_, i) => i !== idx))
  }

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          dragOver
            ? 'border-[#2D6A4F] bg-[#D8F3DC]/40'
            : 'border-gray-200 hover:border-[#2D6A4F] hover:bg-gray-50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="flex flex-col items-center gap-2">
          {uploading ? (
            <Loader size={28} className="text-[#2D6A4F] animate-spin" />
          ) : (
            <ImagePlus size={28} className="text-gray-300" />
          )}
          <p className="text-sm font-medium text-gray-500">
            {uploading ? 'Uploading & compressing...' : 'Click or drag images here'}
          </p>
          <p className="text-xs text-gray-400">
            PNG, JPG, WEBP — auto compressed to WebP
          </p>
        </div>
      </div>

      {/* Upload progress */}
      {uploadStatus.length > 0 && (
        <div className="space-y-1.5">
          {uploadStatus.map((s, i) => (
            <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2">
              {s.status === 'done' ? (
                <CheckCircle size={14} className="text-green-500 shrink-0" />
              ) : s.status === 'error' ? (
                <X size={14} className="text-red-400 shrink-0" />
              ) : (
                <Loader size={14} className="text-[#2D6A4F] animate-spin shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 truncate">{s.name}</p>
                {s.status === 'done' && s.compressedSize > 0 && (
                  <p className="text-[10px] text-green-600">
                    {formatFileSize(s.originalSize)} → {formatFileSize(s.compressedSize)}{' '}
                    <span className="font-semibold">
                      ({Math.round((1 - s.compressedSize / s.originalSize) * 100)}% saved)
                    </span>
                  </p>
                )}
                {s.status === 'error' && <p className="text-[10px] text-red-400">Upload failed</p>}
              </div>
              <span className={`text-[10px] font-semibold capitalize px-2 py-0.5 rounded-full ${
                s.status === 'done' ? 'bg-green-100 text-green-600' :
                s.status === 'error' ? 'bg-red-100 text-red-500' :
                'bg-yellow-100 text-yellow-600'
              }`}>{s.status}</span>
            </div>
          ))}
        </div>
      )}

      {/* Image previews */}
      {images.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {images.map((url, i) => (
            <div key={i} className="relative group w-20 h-20">
              <img
                src={url}
                alt=""
                className="w-full h-full object-cover rounded-xl border border-gray-200"
              />
              <button
                type="button"
                onClick={() => removeImage(url, i)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              >
                <X size={10} />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 text-[9px] bg-[#2D6A4F] text-white px-1.5 py-0.5 rounded-full font-semibold">
                  Main
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}