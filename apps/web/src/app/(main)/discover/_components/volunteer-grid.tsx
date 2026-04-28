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
      <div className="discover-empty">
        <div className="discover-error-icon">
          <IconAlertTriangle width={24} height={24} />
        </div>
        <p className="discover-empty-title">Something went wrong</p>
        <p className="discover-empty-desc">Failed to load volunteers. Please refresh the page.</p>
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
      <div className="discover-empty">
        <div className="discover-empty-icon">
          <IconUsers width={24} height={24} />
        </div>
        <p className="discover-empty-title">No volunteers found</p>
        <p className="discover-empty-desc">
          Try adjusting your filters to find who you&apos;re looking for.
        </p>
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
    <div>
      <p className="discover-meta">
        Showing <strong>{volunteers.length}</strong> of <strong>{total}</strong> volunteers
      </p>

      <div className="volunteer-grid">
        {volunteers.map((volunteer) => (
          <VolunteerCard key={volunteer.userId} volunteer={volunteer} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="discover-pagination">
          <Link
            href={currentPage <= 1 ? "#" : createPageUrl(currentPage - 1)}
            aria-label="Previous page"
            className={`discover-page-btn${currentPage <= 1 ? " discover-page-btn--disabled" : ""}`}
          >
            <IconChevronLeft width={16} height={16} />
          </Link>

          <span className="discover-page-info">
            <strong>{currentPage}</strong> / {totalPages}
          </span>

          <Link
            href={currentPage >= totalPages ? "#" : createPageUrl(currentPage + 1)}
            aria-label="Next page"
            className={`discover-page-btn${currentPage >= totalPages ? " discover-page-btn--disabled" : ""}`}
          >
            <IconChevronRight width={16} height={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
