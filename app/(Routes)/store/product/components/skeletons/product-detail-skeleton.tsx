import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailsSkeleton() {
  return (
    <div className="flex-1 no-scrollbar overflow-y-auto px-6 py-6">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <Skeleton className="w-full aspect-square rounded-xl" />={" "}
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-20 rounded-lg shrink-0" />
            ))}
          </div>
        </div>

        <div className="space-y-12">
          <div className="space-y-3">
            <Skeleton className="h-10 w-3/4" /> {/* Title */}
            <Skeleton className="h-8 w-1/4" /> {/* Price */}
            <Skeleton className="h-4 w-1/2" /> {/* Vendor/SKU */}
          </div>

          <div className="space-y-3">
            <Skeleton className="h-7 w-40" /> {/* Section Title */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-7 w-48" /> {/* Section Title */}
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-7 w-40" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-40" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
