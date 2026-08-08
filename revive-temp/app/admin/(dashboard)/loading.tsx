export default function AdminLoading() {
  return (
    <div className="max-w-5xl space-y-6 animate-pulse">
      <div className="h-6 w-32 bg-white/[0.06] rounded" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[...Array(8)].map((_, i) => <div key={i} className="h-20 bg-white/[0.04] border border-white/[0.04]" />)}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-white/[0.04] border border-white/[0.04]" />)}
      </div>
    </div>
  )
}
