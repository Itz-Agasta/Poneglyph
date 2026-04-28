import { Suspense } from "react";
import "./discover.css";
import { VolunteerGrid } from "./_components/volunteer-grid";
import { VolunteerFilters } from "./_components/volunteer-filters";
import { VolunteerGridSkeleton } from "./_components/volunteer-grid-skeleton";
import { DiscoverTabs } from "./_components/discover-tabs";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function DiscoverPage(props: Props) {
  const searchParams = await props.searchParams;

  const city = typeof searchParams.city === "string" ? searchParams.city : undefined;
  const tags = typeof searchParams.tags === "string" ? searchParams.tags : undefined;
  const page = typeof searchParams.page === "string" ? searchParams.page : "1";
  const limit = typeof searchParams.limit === "string" ? searchParams.limit : "20";
  const currentTab = typeof searchParams.type === "string" ? searchParams.type : "volunteers";

  const suspenseKey = JSON.stringify({ city, tags, page, limit, currentTab });

  return (
    <div className="discover-page">
      <div className="discover-container">
        <div className="discover-hero">
          <h1 className="discover-title">
            Discover <em>{currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}</em>
          </h1>
          <p className="discover-subtitle">
            {currentTab === "volunteers" && "Find passionate people ready to make a difference."}
            {currentTab === "datasets" && "Explore diverse datasets for your research needs."}
            {currentTab === "articles" && "Read insightful articles published by the community."}
          </p>

          <DiscoverTabs currentTab={currentTab} />

          {currentTab === "volunteers" && <VolunteerFilters />}
        </div>

        {currentTab === "volunteers" ? (
          <Suspense key={suspenseKey} fallback={<VolunteerGridSkeleton />}>
            <VolunteerGrid city={city} tags={tags} page={Number(page)} limit={Number(limit)} />
          </Suspense>
        ) : (
          <div className="discover-empty">
            <div className="discover-empty-title">Coming Soon</div>
            <p className="discover-empty-desc">
              The {currentTab} directory is currently under construction. Please check back later!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
