import type { User, Video } from '../App'

type Props = { user: User | null; videos: Video[] }

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 text-center">
      <p className="text-2xl font-bold text-white">{Number(value).toLocaleString()}</p>
      <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">{label}</p>
    </div>
  )
}

export default function Profile({ user, videos }: Props) {
  if (!user) return <div className="text-gray-500 text-center py-20">No profile data available.</div>

  const totalViews = videos.reduce((s, v) => s + v.view_count, 0)
  const avgER = videos.length
    ? (videos.reduce((s, v) => s + v.er, 0) / videos.length).toFixed(2)
    : '0'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-6">
        <img
          src={user.avatar_url}
          alt={user.display_name}
          className="w-20 h-20 rounded-full border-2 border-brand object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold text-white">{user.display_name}</h1>
          <p className="text-gray-400 mt-1 text-sm max-w-md">{user.bio_description}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Followers" value={user.follower_count} />
        <StatCard label="Following" value={user.following_count} />
        <StatCard label="Total Likes" value={user.likes_count} />
        <StatCard label="Videos" value={user.video_count} />
      </div>

      {/* Derived stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Views (last 20 videos)</p>
          <p className="text-3xl font-bold text-white">{totalViews.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Avg Engagement Rate</p>
          <p className="text-3xl font-bold text-brand">{avgER}%</p>
        </div>
      </div>
    </div>
  )
}
