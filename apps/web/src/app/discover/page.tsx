"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import "./discover.css";
import { VolunteerGrid } from "./_components/volunteer-grid";
import { VolunteerFilters } from "./_components/volunteer-filters";
import { DiscoverTabs } from "./_components/discover-tabs";

function DiscoverContent() {
  const searchParams = useSearchParams();

  const city = searchParams.get("city") ?? undefined;
  const tags = searchParams.get("tags") ?? undefined;
  const page = searchParams.get("page") ?? "1";
  const limit = searchParams.get("limit") ?? "20";
  const currentTab = searchParams.get("type") ?? "volunteers";

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
          <VolunteerGrid city={city} tags={tags} page={Number(page)} limit={Number(limit)} />
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

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div className="discover-page"><div className="discover-container">Loading...</div></div>}>
      <DiscoverContent />
    </Suspense>
  );
}
