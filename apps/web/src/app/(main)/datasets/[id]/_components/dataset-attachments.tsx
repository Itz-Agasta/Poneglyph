"use client";

import { Badge } from "@Poneglyph/ui/components/badge";
import { Button } from "@Poneglyph/ui/components/button";
import { IconDownload, IconEye, IconPaperclip } from "@tabler/icons-react";
import { env } from "@Poneglyph/env/web";
import type { DatasetAttachment } from "@/lib/types";

interface Props {
  datasetId: string;
  attachments: DatasetAttachment[];
}

/** Route file access through the Next.js proxy so session cookies are forwarded to the backend. */
function toProxiedUrl(relativeOrAbsolute: string) {
  const absolute = relativeOrAbsolute.startsWith("http")
    ? relativeOrAbsolute
    : `${env.NEXT_PUBLIC_SERVER_URL}${relativeOrAbsolute}`;
  return `/api/proxy/file?url=${encodeURIComponent(absolute)}`;
}

export function DatasetAttachments({ datasetId, attachments }: Props) {
  if (attachments.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <p className="text-sm text-muted-foreground">No attachments available.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center gap-2">
        <IconPaperclip className="size-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold text-foreground">
          Attachments ({attachments.length})
        </h2>
      </div>

      <ul className="divide-y divide-border">
        {attachments.map((attachment) => {
          const ext = attachment.fileType.toLowerCase();
          const fileName =
            ext === "other"
              ? `file-${attachment.index + 1}`
              : `file-${attachment.index + 1}.${ext}`;

          // All file access goes through the Next.js proxy to carry auth cookies
          const proxiedUrl = toProxiedUrl(attachment.url);
          const downloadUrl = `${proxiedUrl}&download=true`;

          // Pass the raw URL as src — each viewer proxies it internally.
          // Do NOT pass proxiedUrl here or the viewer will double-proxy.
          const rawUrl = attachment.url.startsWith("http")
            ? attachment.url
            : `${env.NEXT_PUBLIC_SERVER_URL}${attachment.url}`;
          const encodedParams = `src=${encodeURIComponent(rawUrl)}&title=${encodeURIComponent(fileName)}`;
          const previewHref =
            ext === "pdf"
              ? `/pdf/${datasetId}?${encodedParams}`
              : ext === "csv"
                ? `/csv/${datasetId}?${encodedParams}`
                : ext === "xlsx" || ext === "xls"
                  ? `/excel/${datasetId}?${encodedParams}`
                  : null;

          return (
            <li
              key={attachment.index}
              className="flex items-center justify-between px-5 py-3.5 gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Badge variant="outline" className="uppercase text-[10px] font-bold shrink-0">
                  {attachment.fileType}
                </Badge>
                <span className="text-sm text-muted-foreground truncate">
                  File {attachment.index + 1}
                  {attachment.isExternal && (
                    <span className="ml-1.5 text-xs text-muted-foreground/60">(external)</span>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a href={previewHref ?? proxiedUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="sm" className="gap-1.5">
                    <IconEye className="size-3.5" />
                    {previewHref ? "Preview" : "Open"}
                  </Button>
                </a>
                <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="sm" className="gap-1.5">
                    <IconDownload className="size-3.5" />
                    Download
                  </Button>
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
