import { apiClientWithCookies } from "@/lib/api-client";
import type { VolunteerListItem, PaginatedResponse } from "@/lib/types";
import { VolunteerCard } from "./volunteer-card";
import Link from "next/link";
import {
  IconChevronLeft,
  IconChevronRight,
  IconAlertTriangle,
  IconUsers,
} from "@tabler/icons-react";
import { Button } from "@Poneglyph/ui/components/button";

interface VolunteerGridProps {
  city?: string;
  tags?: string;
  page?: number;
  limit?: number;
}

export async function VolunteerGrid({ city, tags, page = 1, limit = 20 }: VolunteerGridProps) {
  const query: Record<string, string> = {
    page: page.toString(),
    limit: limit.toString(),
  };
  if (city) query.city = city;
  if (tags) query.tags = tags;

  const client = await apiClientWithCookies();
  const res = await client.get("/api/discover/volunteers", { query });

  if (!res.ok) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center rounded-xl border border-border bg-card">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10">
          <IconAlertTriangle className="w-6 h-6 text-destructive" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-foreground">Failed to load volunteers</h3>
          <p className="text-sm text-muted-foreground">
            Something went wrong. Please refresh the page.
          </p>
        </div>
      </div>
    );
  }

  const {
    data: volunteers,
    total,
    page: currentPage,
    totalPages,
  } = (await res.json()) as PaginatedResponse<VolunteerListItem>;

  if (volunteers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center border border-dashed border-border rounded-xl bg-card">
        <IconUsers className="w-8 h-8 text-muted-foreground/40" />
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-foreground">No volunteers found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters to find who you're looking for.
          </p>
        </div>
      </div>
    );
  }

  const createPageUrl = (newPage: number) => {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (tags) params.set("tags", tags);
    params.set("page", newPage.toString());
    params.set("limit", limit.toString());
    return `/discover?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{volunteers.length}</span> of{" "}
        <span className="font-medium text-foreground">{total}</span> volunteers
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {volunteers.map((volunteer) => (
          <VolunteerCard key={volunteer.userId} volunteer={volunteer} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <Link
            href={currentPage <= 1 ? "#" : createPageUrl(currentPage - 1)}
            aria-label="Previous page"
            className={currentPage <= 1 ? "pointer-events-none" : ""}
            tabIndex={currentPage <= 1 ? -1 : undefined}
          >
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage <= 1}
              className={currentPage <= 1 ? "opacity-50" : ""}
            >
              <IconChevronLeft className="w-4 h-4" />
            </Button>
          </Link>

          <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-foreground">Page {currentPage}</span>
            <span className="text-sm text-muted-foreground">of {totalPages}</span>
          </div>

          <Link
            href={currentPage >= totalPages ? "#" : createPageUrl(currentPage + 1)}
            aria-label="Next page"
            className={currentPage >= totalPages ? "pointer-events-none" : ""}
            tabIndex={currentPage >= totalPages ? -1 : undefined}
          >
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage >= totalPages}
              className={currentPage >= totalPages ? "opacity-50" : ""}
            >
              <IconChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
