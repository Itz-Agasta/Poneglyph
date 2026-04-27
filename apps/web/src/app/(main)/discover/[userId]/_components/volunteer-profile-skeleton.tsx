import { Skeleton } from "@Poneglyph/ui/components/skeleton";
import { Separator } from "@Poneglyph/ui/components/separator";

export function VolunteerProfileSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      {/* Profile header */}
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <Skeleton className="w-24 h-24 rounded-xl shrink-0" />
        <div className="flex flex-col gap-3 flex-1">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-24" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
        </div>
      </div>

      <Separator />

      {/* About section */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-16" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>

      <Separator />

      {/* Past works */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-24" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex gap-3 rounded-xl border border-border bg-card p-4">
            <Skeleton className="w-4 h-4 mt-0.5 shrink-0 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
