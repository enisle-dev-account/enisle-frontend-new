export default function Loading() {
  return (
    <div className="rounded-t-2xl bg-background overflow-hidden h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground">Loading registration form...</p>
      </div>
    </div>
  )
}
