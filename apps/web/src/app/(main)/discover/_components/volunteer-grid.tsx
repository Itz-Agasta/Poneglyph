"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  IconChevronLeft,
  IconChevronRight,
  IconAlertTriangle,
  IconUsers,
} from "@tabler/icons-react";
import type { VolunteerListItem, PaginatedResponse } from "@/lib/types";
import { VolunteerCard } from "./volunteer-card";
import { VolunteerGridSkeleton } from "./volunteer-grid-skeleton";

interface VolunteerGridProps {
  city?: string;
  tags?: string;
  page?: number;
  limit?: number;
}

async function fetchVolunteers({
  city,
  tags,
  page,
  limit,
}: VolunteerGridProps): Promise<PaginatedResponse<VolunteerListItem>> {
  const query: Record<string, string> = {
    page: (page ?? 1).toString(),
    limit: (limit ?? 20).toString(),
  };
  if (city) query.city = city;
  if (tags) query.tags = tags;

  const params = new URLSearchParams(query);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/discover/volunteers?${params}`,
    { credentials: "include" },
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message ?? `Request failed: ${res.status}`);
  }

  return res.json() as Promise<PaginatedResponse<VolunteerListItem>>;
}

export function VolunteerGrid({ city, tags, page = 1, limit = 20 }: VolunteerGridProps) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["volunteers", { city, tags, page, limit }],
    queryFn: () => fetchVolunteers({ city, tags, page, limit }),
  });

  if (isLoading) return <VolunteerGridSkeleton />;

  if (isError) {
    return (
      <div className="discover-empty">
        <div className="discover-error-icon">
          <IconAlertTriangle width={24} height={24} />
        </div>
        <p className="discover-empty-title">Something went wrong</p>
        <p className="discover-empty-desc">
          {error instanceof Error ? error.message : "Failed to load volunteers. Please refresh."}
        </p>
      </div>
    );
  }

  const volunteers = data?.data ?? [];
  const total = data?.total ?? 0;
  const currentPage = data?.page ?? page;
  const totalPages = data?.totalPages ?? 1;

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
    const p = new URLSearchParams();
    if (city) p.set("city", city);
    if (tags) p.set("tags", tags);
    p.set("page", newPage.toString());
    p.set("limit", limit.toString());
    return `/discover?${p.toString()}`;
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
