import { Badge } from "@Poneglyph/ui/components/badge";
import { Button } from "@Poneglyph/ui/components/button";
import { IconDownload, IconEye, IconPaperclip } from "@tabler/icons-react";
import type { DatasetAttachment } from "@/lib/types";

interface Props {
  datasetId: string;
  attachments: DatasetAttachment[];
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
          const fileName = `file-${attachment.index + 1}.${attachment.fileType.toLowerCase()}`;
          const isPdf = attachment.fileType.toLowerCase() === "pdf";
          const previewHref = isPdf
            ? `/pdf/${datasetId}?fileIndex=${attachment.index}&title=${encodeURIComponent(fileName)}`
            : attachment.url;

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
                <a
                  href={previewHref}
                  target={isPdf ? undefined : "_blank"}
                  rel={isPdf ? undefined : "noopener noreferrer"}
                >
                  <Button variant="ghost" size="sm" className="gap-1.5">
                    <IconEye className="size-3.5" />
                    Preview
                  </Button>
                </a>
                <DownloadButton datasetId={datasetId} fileIndex={attachment.index} fileName={fileName} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
