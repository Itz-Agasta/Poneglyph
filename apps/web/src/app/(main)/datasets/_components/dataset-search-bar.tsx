"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconSearch, IconX } from "@tabler/icons-react";
import { Input } from "@Poneglyph/ui/components/input";
import { Button } from "@Poneglyph/ui/components/button";

interface DatasetSearchBarProps {
  initialQuery?: string;
}

export function DatasetSearchBar({ initialQuery = "" }: DatasetSearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state with URL if it changes externally
  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) {
      setQuery(q);
    } else {
      setQuery("");
    }
  }, [searchParams]);

  const updateUrl = (newQuery: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newQuery.trim()) {
      params.set("q", newQuery.trim());
    } else {
      params.delete("q");
    }
    // Reset to page 1 on new search
    params.set("page", "1");

    router.replace(`/datasets?${params.toString()}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      updateUrl(value);
    }, 400);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handleClear = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    setQuery("");
    updateUrl("");
  };

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
        <IconSearch className="w-4 h-4 text-muted-foreground" />
      </div>
      <Input
        type="text"
        placeholder="Search datasets by title, description, or publisher..."
        value={query}
        onChange={handleChange}
        className="w-full pl-11 pr-10 h-[48px] text-[14.5px] bg-card border-border rounded-[calc(var(--radius-md))] shadow-[0_1px_2px_rgba(0,0,0,0.04)] focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all duration-200"
      />
      {query && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <IconX className="w-4 h-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        </div>
      )}
    </div>
  );
}
