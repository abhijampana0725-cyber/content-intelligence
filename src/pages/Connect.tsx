type Props = { error: string | null }

export default function Connect({ error }: Props) {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <div className="w-16 h-16 bg-gradient-to-br from-[#69C9D0] to-[#EE1D52] rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6">
          CI
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Content Intelligence</h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Connect your TikTok account to analyze your content performance and get AI-powered recommendations.
        </p>
        {error && (
          <div className="mb-6 bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        <a
          href="http://localhost:3001/auth/tiktok"
          className="inline-flex items-center gap-3 bg-white text-black font-semibold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors text-lg"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z"/>
          </svg>
          Connect TikTok
        </a>
        <p className="text-xs text-gray-600 mt-4">
          Make sure your backend is running on port 3001
        </p>
      </div>
    </div>
  )
}
