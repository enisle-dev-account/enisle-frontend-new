export default function CSVImportLoading() {
  return (
    <div className="rounded-t-2xl bg-background overflow-hidden h-full flex flex-col pt-6 px-10 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center gap-4 mb-8">
        <div className="h-10 w-10 bg-muted rounded-lg" />
        <div className="space-y-2 flex-1">
          <div className="h-8 w-48 bg-muted rounded-lg" />
          <div className="h-4 w-96 bg-muted rounded-lg" />
        </div>
      </div>

      {/* Step Indicator Skeleton */}
      <div className="flex items-center justify-between w-full max-w-2xl mx-auto mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center flex-1">
            <div className="h-12 w-12 bg-muted rounded-full" />
            <div className="flex-1 mx-2 h-0.5 bg-muted" />
          </div>
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 flex items-center justify-center max-w-2xl mx-auto w-full">
        <div className="space-y-6 w-full">
          <div className="space-y-3">
            <div className="h-6 w-48 bg-muted rounded-lg" />
            <div className="h-4 w-96 bg-muted rounded-lg" />
          </div>
          <div className="h-48 bg-muted rounded-lg" />
          <div className="h-32 bg-muted rounded-lg" />
        </div>
      </div>
    </div>
  )
}
