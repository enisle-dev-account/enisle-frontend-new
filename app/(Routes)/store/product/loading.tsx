export default function ProductsLoading() {
  return (
    <div className="rounded-t-2xl bg-background overflow-hidden h-full flex flex-col">
      {/* Header Skeleton */}
      <div className="space-y-4 border-b bg-background p-4 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-32 bg-muted rounded-lg" />
            <div className="h-4 w-48 bg-muted rounded-lg" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-10 w-32 bg-muted rounded-lg" />
            <div className="h-10 w-32 bg-muted rounded-lg" />
          </div>
        </div>

        {/* Search Skeleton */}
        <div className="h-10 w-full max-w-sm bg-muted rounded-lg" />

        {/* Info Card Skeleton */}
        <div className="p-4 bg-muted rounded-lg h-16" />
      </div>

      {/* Table Skeleton */}
      <div className="flex-1 overflow-auto p-4 space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  )
}
