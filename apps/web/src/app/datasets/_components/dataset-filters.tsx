"use client";

import { useCallback, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const SORT_OPTIONS = [
  { label: "Newest First", value: "createdAt", order: "desc" },
  { label: "Oldest First", value: "createdAt", order: "asc" },
  { label: "Most Viewed", value: "viewCount", order: "desc" },
  { label: "Most Downloaded", value: "downloadCount", order: "desc" },
];

const FILE_TYPES = [
  { label: "CSV", value: "csv" },
  { label: "JSON", value: "json" },
  { label: "Excel (XLSX)", value: "xlsx" },
  { label: "Excel (XLS)", value: "xls" },
  { label: "PDF", value: "pdf" },
  { label: "Word (DOCX)", value: "docx" },
  { label: "Other", value: "other" },
];

const STATUS_OPTIONS = [
  { label: "All", value: "" },
  { label: "Approved", value: "approved" },
  { label: "Pending", value: "pending" },
];

const LANGUAGES = [
  { label: "All Languages", value: "" },
  { label: "English", value: "en" },
  { label: "Spanish", value: "es" },
  { label: "French", value: "fr" },
  { label: "Arabic", value: "ar" },
];

export function DatasetFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }

      // Always reset to page 1 when changing filters
      if (name !== "page") {
        params.set("page", "1");
      }

      return params.toString();
    },
    [searchParams],
  );

  const handleParamChange = (name: string, value: string) => {
    startTransition(() => {
      router.push(`${pathname}?${createQueryString(name, value)}`);
    });
  };

  const handleSortChange = (value: string) => {
    const option = SORT_OPTIONS.find((opt) => `${opt.value}-${opt.order}` === value);
    if (!option) return;

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("sortBy", option.value);
      params.set("sortOrder", option.order);
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const currentSortBy = searchParams.get("sortBy") || "createdAt";
  const currentSortOrder = searchParams.get("sortOrder") || "desc";
  const currentSortValue = `${currentSortBy}-${currentSortOrder}`;

  const currentStatus = searchParams.get("status") || "";
  const currentFileType = searchParams.get("fileType") || "";
  const currentLanguage = searchParams.get("language") || "";

  return (
    <div
      className={`space-y-8 ${isPending ? "opacity-70 pointer-events-none" : ""} transition-opacity duration-200`}
    >
      {/* Sort */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold tracking-tight text-foreground uppercase">Sort By</h3>
        <select
          className="w-full bg-card border border-border text-sm rounded-md px-3 py-2 focus:ring-1 focus:ring-primary outline-none text-foreground"
          value={currentSortValue}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={`${opt.value}-${opt.order}`} value={`${opt.value}-${opt.order}`}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Status */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold tracking-tight text-foreground uppercase">Status</h3>
        <div className="space-y-2">
          {STATUS_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="status"
                value={opt.value}
                checked={currentStatus === opt.value}
                onChange={(e) => handleParamChange("status", e.target.value)}
                className="w-4 h-4 text-primary bg-background border-border focus:ring-primary focus:ring-offset-background cursor-pointer"
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* File Type */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold tracking-tight text-foreground uppercase">
          File Type
        </h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="fileType"
              value=""
              checked={currentFileType === ""}
              onChange={(e) => handleParamChange("fileType", e.target.value)}
              className="w-4 h-4 text-primary bg-background border-border focus:ring-primary focus:ring-offset-background cursor-pointer"
            />
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              All Types
            </span>
          </label>
          {FILE_TYPES.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="fileType"
                value={opt.value}
                checked={currentFileType === opt.value}
                onChange={(e) => handleParamChange("fileType", e.target.value)}
                className="w-4 h-4 text-primary bg-background border-border focus:ring-primary focus:ring-offset-background cursor-pointer"
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Language */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold tracking-tight text-foreground uppercase">Language</h3>
        <select
          className="w-full bg-card border border-border text-sm rounded-md px-3 py-2 focus:ring-1 focus:ring-primary outline-none text-foreground"
          value={currentLanguage}
          onChange={(e) => handleParamChange("language", e.target.value)}
        >
          {LANGUAGES.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Reset button */}
      {(currentStatus ||
        currentFileType ||
        currentLanguage ||
        currentSortBy !== "createdAt" ||
        currentSortOrder !== "desc") && (
        <button
          onClick={() => {
            startTransition(() => {
              router.push(pathname);
            });
          }}
          className="w-full py-2 text-sm font-medium text-muted-foreground bg-muted hover:bg-muted/80 rounded-md transition-colors"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
