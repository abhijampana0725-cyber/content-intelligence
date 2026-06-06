import type { Video } from '../App'

type Props = { videos: Video[] }

function MetricBadge({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="text-center">
      <p className={`text-lg font-bold ${accent ? 'text-brand' : 'text-white'}`}>{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  )
}

export default function Dashboard({ videos }: Props) {
  if (!videos.length) return <div className="text-gray-500 text-center py-20">No videos found.</div>

  const sorted = [...videos].sort((a, b) => b.view_count - a.view_count)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Your last {videos.length} videos, sorted by views</p>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Views', value: videos.reduce((s, v) => s + v.view_count, 0).toLocaleString() },
          { label: 'Total Likes', value: videos.reduce((s, v) => s + v.like_count, 0).toLocaleString() },
          { label: 'Total Comments', value: videos.reduce((s, v) => s + v.comment_count, 0).toLocaleString() },
          { label: 'Total Shares', value: videos.reduce((s, v) => s + v.share_count, 0).toLocaleString() },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Video list */}
      <div className="space-y-3">
        {sorted.map(video => (
          <div key={video.id} className="bg-card border border-border rounded-xl p-4 flex gap-4 items-center">
            <img
              src={video.cover_image_url}
              alt="cover"
              className="w-16 h-20 object-cover rounded-lg flex-shrink-0 bg-gray-800"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white line-clamp-2 mb-3">
                {video.video_description || 'No caption'}
              </p>
              <div className="flex gap-6">
                <MetricBadge label="Views" value={video.view_count.toLocaleString()} />
                <MetricBadge label="Likes" value={video.like_count.toLocaleString()} />
                <MetricBadge label="Comments" value={video.comment_count.toLocaleString()} />
                <MetricBadge label="Shares" value={video.share_count.toLocaleString()} />
                <MetricBadge label="Eng. Rate" value={`${video.er}%`} accent />
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-gray-500">{new Date(video.create_time * 1000).toLocaleDateString()}</p>
              <a
                href={video.share_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-brand hover:underline mt-1 block"
              >
                View on TikTok →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
