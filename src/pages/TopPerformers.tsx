import type { Video } from '../App'

type Props = { videos: Video[] }

const MEDALS = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣']

export default function TopPerformers({ videos }: Props) {
  const top5 = [...videos].sort((a, b) => b.er - a.er).slice(0, 5)

  if (!top5.length) return <div className="text-gray-500 text-center py-20">No videos found.</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Top Performers</h1>
        <p className="text-gray-400 text-sm mt-1">Your 5 highest-engagement videos, ranked by engagement rate</p>
      </div>

      <div className="space-y-4">
        {top5.map((video, i) => (
          <div key={video.id} className="bg-card border border-border rounded-xl overflow-hidden flex">
            <div className="relative w-32 flex-shrink-0">
              <img
                src={video.cover_image_url}
                alt="cover"
                className="w-full h-full object-cover bg-gray-800"
                style={{ minHeight: '160px' }}
              />
              <div className="absolute top-2 left-2 text-xl">{MEDALS[i]}</div>
            </div>
            <div className="flex-1 p-5">
              <p className="text-white text-sm mb-4 line-clamp-2">
                {video.video_description || 'No caption'}
              </p>
              <div className="grid grid-cols-4 gap-4 mb-4">
                {[
                  { label: 'Views', value: video.view_count.toLocaleString() },
                  { label: 'Likes', value: video.like_count.toLocaleString() },
                  { label: 'Comments', value: video.comment_count.toLocaleString() },
                  { label: 'Shares', value: video.share_count.toLocaleString() },
                ].map(m => (
                  <div key={m.label}>
                    <p className="text-white font-semibold">{m.value}</p>
                    <p className="text-xs text-gray-500">{m.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-brand">{video.er}%</span>
                  <span className="text-xs text-gray-500">engagement rate</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">{new Date(video.create_time * 1000).toLocaleDateString()}</span>
                  <a
                    href={video.share_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs border border-border px-3 py-1.5 rounded-lg text-gray-300 hover:text-white hover:border-gray-400 transition-colors"
                  >
                    Open on TikTok →
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
