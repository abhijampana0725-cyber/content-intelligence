import { useState } from 'react'
import type { Video } from '../App'

type Props = { videos: Video[] }

type StrategistResult = {
  hookAnalysis: { bestStyle: string; avgER: string; insight: string }
  bestPostTime: { day: string; window: string; label: string }
  topHashtags: string[]
  retireHashtags: string[]
  winningFormula: { hook: string; time: string; hashtags: string[]; topic: string }
  variations: { type: string; opener: string; body: string; cta: string }[]
  whatToFilm: string
  suggestedHashtags: string[]
}

export default function Strategist({ videos }: Props) {
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<StrategistResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<number>(0)
  const [copied, setCopied] = useState(false)

  const generate = async () => {
    if (!videos.length) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('http://localhost:3001/api/strategist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videos, topic }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data)
      setSelected(0)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const copyCaption = () => {
    if (!result) return
    const v = result.variations[selected]
    const text = `${v.opener}\n\n${v.body}\n\n${v.cta}\n\n${result.suggestedHashtags.map(h => `#${h.replace('#','')}`).join(' ')}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Strategist</h1>
        <p className="text-gray-400 text-sm mt-1">Your data, distilled into a content brief</p>
      </div>

      {/* Winning Formula — always shown if result exists */}
      {result && (
        <div className="bg-card border border-brand/30 rounded-xl p-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Your Winning Formula</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-dark rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase mb-1">Best Hook</p>
              <p className="font-bold text-white">{result.hookAnalysis.bestStyle}</p>
              <p className="text-brand text-sm mt-1">{result.hookAnalysis.avgER} avg ER</p>
            </div>
            <div className="bg-dark rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase mb-1">Best Time</p>
              <p className="font-bold text-white">{result.bestPostTime.day} · {result.bestPostTime.window}</p>
              <p className="text-gray-500 text-sm mt-1">{result.bestPostTime.label}</p>
            </div>
            <div className="bg-dark rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase mb-1">Top Hashtags</p>
              <p className="font-bold text-white text-sm">{result.topHashtags.slice(0, 3).join(' ')}</p>
            </div>
            <div className="bg-dark rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase mb-1">Winning Topic</p>
              <p className="font-bold text-white text-sm line-clamp-2">{result.winningFormula.topic}</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-4 italic">"{result.hookAnalysis.insight}"</p>
        </div>
      )}

      {/* Topic input + generate */}
      <div className="bg-card border border-border rounded-xl p-6">
        <p className="text-sm font-semibold text-white mb-1">What to post next</p>
        <p className="text-xs text-gray-500 mb-4">Bring your idea — the strategist packages it using what works for your account</p>
        <div className="flex gap-3">
          <input
            type="text"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="e.g. my morning routine, a restaurant I tried, skincare tips..."
            className="flex-1 bg-dark border border-border rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-brand"
            onKeyDown={e => e.key === 'Enter' && generate()}
          />
          <button
            onClick={generate}
            disabled={loading || !videos.length}
            className="bg-brand text-black font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40 text-sm whitespace-nowrap"
          >
            {loading ? 'Generating...' : '✦ Generate'}
          </button>
        </div>
        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      </div>

      {/* Results */}
      {result && (
        <>
          {/* 3 variations */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-white">Choose your hook style</p>
            {result.variations.map((v, i) => (
              <button
                key={v.type}
                onClick={() => setSelected(i)}
                className={`w-full text-left bg-card border rounded-xl p-5 transition-colors ${
                  selected === i ? 'border-brand' : 'border-border hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-semibold uppercase tracking-widest px-2 py-1 rounded ${
                    selected === i ? 'bg-brand/20 text-brand' : 'bg-gray-800 text-gray-400'
                  }`}>
                    {v.type}
                  </span>
                  {selected === i && <span className="text-brand text-xs">Selected ✓</span>}
                </div>
                <p className="text-white font-medium mb-2">"{v.opener}"</p>
                {selected === i && (
                  <div className="mt-3 space-y-2 border-t border-border pt-3">
                    <p className="text-gray-300 text-sm">{v.body}</p>
                    <p className="text-brand text-sm font-medium">{v.cta}</p>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Suggested hashtags + copy */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-white">Suggested hashtags</p>
              <button
                onClick={copyCaption}
                className="text-xs bg-brand text-black font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                {copied ? 'Copied! ✓' : 'Copy full caption'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.suggestedHashtags.map(tag => (
                <span key={tag} className="bg-brand/10 text-brand text-sm px-3 py-1 rounded-full border border-brand/20">
                  #{tag.replace('#', '')}
                </span>
              ))}
            </div>
          </div>

          {/* What to film */}
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">What to film</p>
            <p className="text-white leading-relaxed">{result.whatToFilm}</p>
          </div>

          {/* Hashtag intel */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-xs text-green-400 uppercase tracking-widest mb-3">Use more</p>
              <div className="flex flex-wrap gap-2">
                {result.topHashtags.map(tag => (
                  <span key={tag} className="bg-green-900/20 text-green-400 text-xs px-2 py-1 rounded border border-green-900/40">
                    #{tag.replace('#', '')}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-xs text-red-400 uppercase tracking-widest mb-3">Retire these</p>
              <div className="flex flex-wrap gap-2">
                {result.retireHashtags.map(tag => (
                  <span key={tag} className="bg-red-900/20 text-red-400 text-xs px-2 py-1 rounded border border-red-900/40">
                    #{tag.replace('#', '')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
