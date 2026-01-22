import { Skeleton } from "@/components/ui/skeleton";

export function ProductsTableSkeleton() {
  // Create 10 rows to fill the screen
  const skeletonRows = Array.from({ length: 10 });

  return (
    <div className="w-full">
      <table className="w-full">
        <thead className="border-b bg-muted/30">
          <tr className="text-sm">
            <th className="px-6 py-4"><Skeleton className="h-4 w-4" /></th>
            <th className="px-6 py-4"><Skeleton className="h-4 w-32" /></th>
            <th className="px-6 py-4"><Skeleton className="h-4 w-24" /></th>
            <th className="px-6 py-4"><Skeleton className="h-4 w-16" /></th>
            <th className="px-6 py-4"><Skeleton className="h-4 w-12" /></th>
            <th className="px-6 py-4"><Skeleton className="h-4 w-20" /></th>
            <th className="px-6 py-4"><Skeleton className="h-4 w-24" /></th>
          </tr>
        </thead>
        <tbody>
          {skeletonRows.map((_, i) => (
            <tr key={i} className="border-b">
              {/* Checkbox */}
              <td className="px-6 py-4">
                <Skeleton className="h-4 w-4" />
              </td>
              {/* Product Details (Image + Text) */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-md shrink-0" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </td>
              {/* Categories */}
              <td className="px-6 py-4">
                <Skeleton className="h-4 w-24" />
              </td>
              {/* Price */}
              <td className="px-6 py-4">
                <Skeleton className="h-4 w-20" />
              </td>
              {/* Stock */}
              <td className="px-6 py-4">
                <Skeleton className="h-4 w-12" />
              </td>
              {/* SKU */}
              <td className="px-6 py-4">
                <Skeleton className="h-4 w-24 font-mono" />
              </td>
              {/* Actions */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-14 rounded-md" /> {/* View button */}
                  <Skeleton className="h-8 w-8 rounded-md" />    {/* Triple dot */}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}