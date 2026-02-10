 export function PatientCardSkeleton() {
  return (
    <div className="bg-white rounded-lg p-6 space-y-4 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 rounded-full bg-slate-200" />
        <div className="flex-1 space-y-2">
          <div className="h-6 w-32 rounded bg-slate-200" />
          <div className="h-4 w-24 rounded bg-slate-200" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-16 rounded bg-slate-200" />
            <div className="h-5 w-20 rounded bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
  )
}