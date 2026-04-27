import { Skeleton } from "@Poneglyph/ui/components/skeleton";
import { Separator } from "@Poneglyph/ui/components/separator";

export function DatasetDetailSkeleton() {
  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5">
        <Skeleton className="h-4 w-16" />
        <span className="text-muted-foreground/40">/</span>
        <Skeleton className="h-4 w-40" />
      </div>

      {/* Status badges */}
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>

      {/* Title */}
      <Skeleton className="h-9 w-3/4" />

      {/* Metadata row */}
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>

      <Separator />

      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {/* Summary box */}
      <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>

      {/* Tags */}
      <div className="flex gap-1.5">
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-18 rounded-full" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>

      <Separator />

      {/* Source info */}
      <div className="flex gap-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Attachments */}
      <div className="mt-8 rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <Skeleton className="h-4 w-32" />
        </div>
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center justify-between px-5 py-3.5 border-b border-border/50 last:border-0">
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-10 rounded" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20 rounded-lg" />
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
