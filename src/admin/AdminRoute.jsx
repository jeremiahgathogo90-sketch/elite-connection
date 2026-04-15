import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminRoute({ children }) {
  const { user, profile, loading } = useAuth()

  // Still loading auth or profile — show spinner, don't redirect yet
  if (loading || (user && profile === null)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="w-8 h-8 border-2 border-[#2D6A4F]/30 border-t-[#2D6A4F] rounded-full animate-spin" />
      </div>
    )
  }

  // Not logged in at all
  if (!user) return <Navigate to="/login" replace />

  // Logged in but not admin
  if (!profile?.is_admin) return <Navigate to="/" replace />

  return children
}