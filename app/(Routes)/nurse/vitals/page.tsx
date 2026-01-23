import { Suspense } from "react";
import { VitalsPageContent } from "./components/vitals-page-content";
import { Skeleton } from "@/components/ui/skeleton";

function VitalsLoadingState() {
  return (
    <main className="rounded-t-2xl bg-background overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b bg-background">
        <Skeleton className="h-10 w-32 mb-6" />
        <div className="flex gap-4 mb-6">
          <Skeleton className="h-10 flex-1 max-w-md" />
          <Skeleton className="h-10 w-10" />
        </div>
        <Skeleton className="h-8 w-48 mb-6" />
      </div>
      <div className="flex-1 p-6">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    </main>
  );
}

export default function VitalsPage() {
  return (
    <Suspense fallback={<VitalsLoadingState />}>
      <VitalsPageContent />
    </Suspense>
  );
}
