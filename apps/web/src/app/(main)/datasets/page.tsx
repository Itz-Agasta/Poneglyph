import { Suspense } from "react";
import "../../(auth)/auth.css";

import { DatasetGrid } from "./_components/dataset-grid";
import { DatasetFilters } from "./_components/dataset-filters";
import { DatasetSearchBar } from "./_components/dataset-search-bar";
import { DatasetGridSkeleton } from "./_components/dataset-grid-skeleton";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function DatasetsPage(props: Props) {
  const searchParams = await props.searchParams;

  // Extract and normalize query parameters
  const q = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const status = typeof searchParams.status === "string" ? searchParams.status : undefined;
  const fileType = typeof searchParams.fileType === "string" ? searchParams.fileType : undefined;
  const language = typeof searchParams.language === "string" ? searchParams.language : undefined;
  const page = typeof searchParams.page === "string" ? searchParams.page : "1";
  const limit = typeof searchParams.limit === "string" ? searchParams.limit : "20";
  const sortBy = typeof searchParams.sortBy === "string" ? searchParams.sortBy : "createdAt";
  const sortOrder = typeof searchParams.sortOrder === "string" ? searchParams.sortOrder : "desc";

  // Tags can be repeated in the URL, forming an array
  const tags = Array.isArray(searchParams.tags)
    ? searchParams.tags
    : typeof searchParams.tags === "string"
      ? [searchParams.tags]
      : undefined;

  // Serialize the active parameters to use as a Suspense key.
  // This guarantees the boundary remounts and shows the fallback skeleton
  // instantly when the user navigates or changes a filter.
  const suspenseKey = JSON.stringify({
    q,
    status,
    fileType,
    tags,
    language,
    page,
    limit,
    sortBy,
    sortOrder,
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-[1200px]" data-accent="lime">
      <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="font-heading font-normal text-[34px] leading-[1.1] tracking-[-0.015em] text-foreground mb-3">
            Explore <em className="italic" style={{ color: "color-mix(in oklch, var(--primary) 75%, var(--foreground))" }}>Datasets</em>
          </h1>
        <p className="text-[14.5px] text-muted-foreground mb-8">
          Search and discover curated survey data for analysis. Start charting your own poneglyphs today.
        </p>
        <DatasetSearchBar initialQuery={q} />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0">
          <DatasetFilters />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          <Suspense key={suspenseKey} fallback={<DatasetGridSkeleton />}>
            <DatasetGrid
              q={q}
              status={status as any}
              fileType={fileType as any}
              tags={tags}
              language={language}
              page={Number(page)}
              limit={Number(limit)}
              sortBy={sortBy as any}
              sortOrder={sortOrder as any}
            />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
