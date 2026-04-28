"use client";

import { useCallback, useTransition, useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { IconSearch, IconTag } from "@tabler/icons-react";

export function VolunteerFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [cityInput, setCityInput] = useState(searchParams.get("city") ?? "");
  const [tagsInput, setTagsInput] = useState(searchParams.get("tags") ?? "");

  useEffect(() => {
    setCityInput(searchParams.get("city") ?? "");
    setTagsInput(searchParams.get("tags") ?? "");
  }, [searchParams]);

  const applyFilters = useCallback(
    (city: string, tags: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (city.trim()) {
        params.set("city", city.trim());
      } else {
        params.delete("city");
      }
      if (tags.trim()) {
        params.set("tags", tags.trim());
      } else {
        params.delete("tags");
      }
      params.set("page", "1");
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [searchParams, pathname, router],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") applyFilters(cityInput, tagsInput);
  };

  const hasFilters = !!searchParams.get("city") || !!searchParams.get("tags");

  return (
    <div
      className="discover-search-bar"
      style={{ opacity: isPending ? 0.65 : 1, pointerEvents: isPending ? "none" : undefined }}
    >
      <div className="discover-search-field">
        <IconSearch className="discover-search-icon" />
        <input
          type="text"
          placeholder="City or location..."
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => applyFilters(cityInput, tagsInput)}
          className="discover-search-input"
        />
      </div>

      <div className="discover-search-divider" />

      <div className="discover-search-field">
        <IconTag className="discover-search-icon" />
        <input
          type="text"
          placeholder="Skills, tags..."
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => applyFilters(cityInput, tagsInput)}
          className="discover-search-input"
        />
      </div>

      <button className="discover-search-btn" onClick={() => applyFilters(cityInput, tagsInput)}>
        Search
      </button>

      {hasFilters && (
        <button
          className="discover-clear-btn"
          onClick={() => {
            setCityInput("");
            setTagsInput("");
            startTransition(() => {
              router.push(pathname);
            });
          }}
        >
          Clear
        </button>
      )}
    </div>
  );
}
