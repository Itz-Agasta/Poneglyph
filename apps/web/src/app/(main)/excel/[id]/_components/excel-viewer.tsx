"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@Poneglyph/ui/components/button";
import {
  IconArrowLeft,
  IconDownload,
  IconTable,
  IconLoader2,
  IconAlertCircle,
} from "@tabler/icons-react";

interface Props {
  datasetId: string;
  src: string;
  title: string;
}

interface SheetData {
  name: string;
  rows: string[][];
}

export function ExcelViewer({ datasetId, src, title }: Props) {
  const [sheets, setSheets] = useState<SheetData[]>([]);
  const [activeSheet, setActiveSheet] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const proxyUrl = `/api/proxy/file?url=${encodeURIComponent(src)}`;
    fetch(proxyUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
        return res.arrayBuffer();
      })
      .then((buf) => {
        const wb = XLSX.read(buf, { type: "array" });
        const parsed: SheetData[] = wb.SheetNames.map((name) => {
          const ws = wb.Sheets[name];
          const rows: string[][] = XLSX.utils.sheet_to_json(ws, {
            header: 1,
            defval: "",
          }) as string[][];
          return { name, rows };
        });
        setSheets(parsed);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [src]);

  const current = sheets[activeSheet];
  const headers = current?.rows[0] ?? [];
  const dataRows = current?.rows.slice(1) ?? [];

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

      {!loading && !error && sheets.length > 1 && (
        <div className="border-b border-border shrink-0 px-6 flex gap-1 overflow-x-auto">
          {sheets.map((sheet, i) => (
            <button
              key={sheet.name}
              onClick={() => setActiveSheet(i)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                i === activeSheet
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {sheet.name}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-auto">
        {loading && (
          <div className="flex items-center justify-center h-full gap-2 text-muted-foreground">
            <IconLoader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Loading Excel file…</span>
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center h-full gap-2 text-destructive">
            <IconAlertCircle className="h-5 w-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        {!loading && !error && current && (
          <div className="p-4">
            <div className="rounded-lg border border-border overflow-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    {headers.map((header, i) => (
                      <th
                        key={i}
                        className="px-3 py-2 text-left font-semibold text-foreground border-b border-border whitespace-nowrap"
                      >
                        {String(header)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataRows.map((row, ri) => (
                    <tr key={ri} className="hover:bg-muted/30 transition-colors">
                      {headers.map((_, ci) => (
                        <td
                          key={ci}
                          className="px-3 py-2 text-muted-foreground border-b border-border/50 whitespace-nowrap"
                        >
                          {String(row[ci] ?? "")}
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
            <p className="text-xs text-muted-foreground mt-2">
              {dataRows.length} row{dataRows.length !== 1 ? "s" : ""} · {headers.length} column
              {headers.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
