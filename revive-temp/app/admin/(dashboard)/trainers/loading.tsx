export default function TrainersLoading() {
  return (
    <div className="max-w-5xl space-y-5 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-6 w-28 bg-white/[0.06]" />
        <div className="h-8 w-28 bg-white/[0.06]" />
      </div>
      <div className="h-10 bg-white/[0.04] border border-white/[0.04]" />
      <div className="bg-[#111312] border border-white/[0.07]">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4 px-4 py-3.5 border-b border-white/[0.04]">
            <div className="h-4 w-28 bg-white/[0.05]" />
            <div className="h-4 w-24 bg-white/[0.04]" />
            <div className="h-4 w-12 bg-white/[0.04]" />
            <div className="h-4 w-16 bg-white/[0.04]" />
          </div>
        ))}
      </div>
    </div>
  )
}
