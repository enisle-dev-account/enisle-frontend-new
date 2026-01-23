import { Skeleton } from "@/components/ui/skeleton";

export function FormSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-50" />
      </div>
      
      {/* Title and Price Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>

      {/* Description Area with Cover Image placeholder */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <div className="flex gap-3 border rounded-lg p-4 bg-muted/20">
          <Skeleton className="h-24 w-24 rounded-lg shrink-0" />
          <Skeleton className="h-24 w-full rounded-md" />
        </div>
      </div>

      {/* Grid Fields (Stock, Availability, Type, Vendor, Category, SKU) */}
      <div className="grid grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ))}
      </div>

      {/* Product Images Section */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-4">
          <Skeleton className="h-32 w-32 rounded-lg" />
          <Skeleton className="h-32 w-32 rounded-lg border-2 border-dashed" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        <Skeleton className="h-10 w-28 rounded-full" />
        <Skeleton className="h-10 w-40 rounded-full" />
      </div>
    </div>
  );
}