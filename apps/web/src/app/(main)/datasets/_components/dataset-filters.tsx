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
        <h3 className="text-[13px] font-medium tracking-wide text-foreground uppercase">Sort By</h3>
        <select
          className="w-full bg-transparent border border-input text-[14px] rounded-[var(--radius-md)] px-3 h-10 focus:border-ring focus:ring-3 focus:ring-ring/35 outline-none text-foreground transition-all"
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
        <h3 className="text-[13px] font-medium tracking-wide text-foreground uppercase">Status</h3>
        <div className="space-y-2.5">
          {STATUS_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="status"
                value={opt.value}
                checked={currentStatus === opt.value}
                onChange={(e) => handleParamChange("status", e.target.value)}
                className="w-[16px] h-[16px] text-primary bg-transparent border border-input focus:ring-ring/35 focus:ring-offset-0 cursor-pointer transition-colors"
              />
              <span className="text-[12.5px] leading-[1.45] text-muted-foreground group-hover:text-foreground transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* File Type */}
      <div className="space-y-3">
        <h3 className="text-[13px] font-medium tracking-wide text-foreground uppercase">
          File Type
        </h3>
        <div className="space-y-2.5">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="radio"
              name="fileType"
              value=""
              checked={currentFileType === ""}
              onChange={(e) => handleParamChange("fileType", e.target.value)}
              className="w-[16px] h-[16px] text-primary bg-transparent border border-input focus:ring-ring/35 focus:ring-offset-0 cursor-pointer transition-colors"
            />
            <span className="text-[12.5px] leading-[1.45] text-muted-foreground group-hover:text-foreground transition-colors">
              All Types
            </span>
          </label>
          {FILE_TYPES.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="fileType"
                value={opt.value}
                checked={currentFileType === opt.value}
                onChange={(e) => handleParamChange("fileType", e.target.value)}
                className="w-[16px] h-[16px] text-primary bg-transparent border border-input focus:ring-ring/35 focus:ring-offset-0 cursor-pointer transition-colors"
              />
              <span className="text-[12.5px] leading-[1.45] text-muted-foreground group-hover:text-foreground transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Language */}
      <div className="space-y-3">
        <h3 className="text-[13px] font-medium tracking-wide text-foreground uppercase">Language</h3>
        <select
          className="w-full bg-transparent border border-input text-[14px] rounded-[var(--radius-md)] px-3 h-10 focus:border-ring focus:ring-3 focus:ring-ring/35 outline-none text-foreground transition-all"
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
          className="w-full h-10 flex items-center justify-center text-[14px] font-semibold text-foreground bg-card border border-border rounded-[var(--radius-md)] shadow-[0_1px_0_rgba(0,0,0,0.02)] hover:bg-muted transition-colors mt-4"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
