import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'
import TopPerformers from './pages/TopPerformers'
import Strategist from './pages/Strategist'
import Connect from './pages/Connect'

export type Video = {
  id: string
  video_description: string
  cover_image_url: string
  share_url: string
  view_count: number
  like_count: number
  comment_count: number
  share_count: number
  create_time: number
  duration: number
  er: number
}

export type User = {
  open_id: string
  display_name: string
  avatar_url: string
  bio_description: string
  follower_count: number
  following_count: number
  likes_count: number
  video_count: number
}

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('tiktok_token'))
  const [user, setUser] = useState<User | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Pick up token from OAuth redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const t = params.get('access_token')
    const err = params.get('error')
    if (t) {
      localStorage.setItem('tiktok_token', t)
      setToken(t)
      window.history.replaceState({}, '', '/')
    }
    if (err) {
      setError('TikTok authentication failed. Please try again.')
      window.history.replaceState({}, '', '/')
    }
  }, [])

  // Fetch data when token available
  useEffect(() => {
    if (!token) return
    setLoading(true)
    setError(null)

    const headers = { 'x-access-token': token }

    Promise.all([
      fetch('http://localhost:3001/api/user', { headers }).then(r => r.json()),
      fetch('http://localhost:3001/api/videos', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      }).then(r => r.json()),
    ])
      .then(([userData, videoData]) => {
        if (userData.error) throw new Error(userData.error)
        setUser(userData)
        const enriched: Video[] = (Array.isArray(videoData) ? videoData : []).map((v: Video) => ({
          ...v,
          er: v.view_count > 0
            ? Number((((v.like_count + v.comment_count + v.share_count) / v.view_count) * 100).toFixed(2))
            : 0,
        }))
        setVideos(enriched)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [token])

  const logout = () => {
    localStorage.removeItem('tiktok_token')
    setToken(null)
    setUser(null)
    setVideos([])
  }

  if (!token) return <Connect error={error} />

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading your TikTok data...</p>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-dark">
        <Navbar onLogout={logout} />
        {error && (
          <div className="max-w-6xl mx-auto px-6 pt-4">
            <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          </div>
        )}
        <main className="max-w-6xl mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/profile" />} />
            <Route path="/profile" element={<Profile user={user} videos={videos} />} />
            <Route path="/dashboard" element={<Dashboard videos={videos} />} />
            <Route path="/top-performers" element={<TopPerformers videos={videos} />} />
            <Route path="/strategist" element={<Strategist videos={videos} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
