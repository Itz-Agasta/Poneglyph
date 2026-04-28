"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@Poneglyph/ui/components/button";
import {
  IconArrowLeft,
  IconDownload,
  IconTable,
  IconLoader2,
  IconAlertCircle,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";

const PAGE_SIZE = 100;

interface Props {
  datasetId: string;
  src: string;
  title: string;
}

function parseCSV(text: string): string[][] {
  return text
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const cells: string[] = [];
      let current = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
          if (inQuotes && line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (ch === "," && !inQuotes) {
          cells.push(current);
          current = "";
        } else {
          current += ch;
        }
      }
      cells.push(current);
      return cells;
    });
}

export function CsvViewer({ datasetId, src, title }: Props) {
  const [rows, setRows] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const proxyUrl = `/api/proxy/file?url=${encodeURIComponent(src)}`;
    fetch(proxyUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
        return res.text();
      })
      .then((text) => {
        setRows(parseCSV(text));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [src]);

  const headers = rows[0] ?? [];
  const dataRows = rows.slice(1);
  const totalPages = Math.max(1, Math.ceil(dataRows.length / PAGE_SIZE));
  const pageRows = dataRows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const startRow = page * PAGE_SIZE + 1;
  const endRow = Math.min((page + 1) * PAGE_SIZE, dataRows.length);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="border-b border-border shrink-0">
        <div className="mx-auto max-w-[1400px] px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/datasets/${datasetId}`}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <IconArrowLeft className="h-4 w-4" />
                Back to Dataset
              </Link>
              <div className="h-5 w-px bg-border" />
              <div className="flex items-center gap-2">
                <IconTable className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground truncate max-w-[320px]">
                  {title}
                </span>
              </div>
            </div>
            <a href={src} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="gap-2">
                <IconDownload className="h-4 w-4" />
                Download
              </Button>
            </a>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {loading && (
          <div className="flex items-center justify-center h-full gap-2 text-muted-foreground">
            <IconLoader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Loading CSV…</span>
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center h-full gap-2 text-destructive">
            <IconAlertCircle className="h-5 w-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        {!loading && !error && (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-auto p-4">
              <div className="rounded-lg border border-border overflow-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-muted/50 sticky top-0">
                      {headers.map((header, i) => (
                        <th
                          key={i}
                          className="px-3 py-2 text-left font-semibold text-foreground border-b border-border whitespace-nowrap"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((row, ri) => (
                      <tr key={ri} className="hover:bg-muted/30 transition-colors">
                        {headers.map((_, ci) => (
                          <td
                            key={ci}
                            className="px-3 py-2 text-muted-foreground border-b border-border/50 whitespace-nowrap"
                          >
                            {row[ci] ?? ""}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {dataRows.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-8">No data rows.</p>
                )}
              </div>
            </div>

            <div className="shrink-0 border-t border-border px-6 py-3 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {dataRows.length > 0
                  ? `Rows ${startRow}–${endRow} of ${dataRows.length} · ${headers.length} column${headers.length !== 1 ? "s" : ""}`
                  : `0 rows · ${headers.length} column${headers.length !== 1 ? "s" : ""}`}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="gap-1"
                >
                  <IconChevronLeft className="h-4 w-4" />
                  Prev
                </Button>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {page + 1} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page === totalPages - 1}
                  className="gap-1"
                >
                  Next
                  <IconChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
