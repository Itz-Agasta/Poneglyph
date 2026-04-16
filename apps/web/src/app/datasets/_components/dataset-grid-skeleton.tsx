export function DatasetGridSkeleton() {
  // We'll show 6 skeleton cards by default as a placeholder
  const skeletons = Array.from({ length: 6 });

  return (
    <div className="space-y-6">
      {/* Top summary bar skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-5 w-48 bg-muted animate-pulse rounded-md"></div>
      </div>

      {/* Grid of skeleton cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skeletons.map((_, i) => (
          <div
            key={i}
            className="flex flex-col h-full overflow-hidden rounded-xl border border-border bg-card"
          >
            {/* Thumbnail skeleton */}
            <div className="h-24 w-full bg-muted animate-pulse"></div>

            {/* Main content skeleton */}
            <div className="flex flex-1 flex-col p-5 gap-4">
              {/* Title skeleton (2 lines) */}
              <div className="space-y-2">
                <div className="h-5 w-full bg-muted animate-pulse rounded-md"></div>
                <div className="h-5 w-3/4 bg-muted animate-pulse rounded-md"></div>
              </div>

              {/* Publisher + Date skeleton */}
              <div className="h-3 w-1/2 bg-muted animate-pulse rounded-md"></div>

              {/* Description skeleton (3 lines) */}
              <div className="space-y-2 mt-1">
                <div className="h-3 w-full bg-muted animate-pulse rounded-md"></div>
                <div className="h-3 w-full bg-muted animate-pulse rounded-md"></div>
                <div className="h-3 w-4/5 bg-muted animate-pulse rounded-md"></div>
              </div>

              {/* Tags skeleton */}
              <div className="mt-auto pt-2 flex gap-1.5">
                <div className="h-4 w-12 bg-muted animate-pulse rounded-md"></div>
                <div className="h-4 w-16 bg-muted animate-pulse rounded-md"></div>
                <div className="h-4 w-10 bg-muted animate-pulse rounded-md"></div>
              </div>
            </div>

            {/* Footer skeleton */}
            <div className="flex items-center justify-between border-t border-border/50 bg-muted/20 px-5 py-3">
              {/* File types */}
              <div className="flex gap-1.5">
                <div className="h-4 w-8 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-10 bg-muted animate-pulse rounded"></div>
              </div>

              {/* View / Download counts */}
              <div className="flex gap-3">
                <div className="h-4 w-10 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-10 bg-muted animate-pulse rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
