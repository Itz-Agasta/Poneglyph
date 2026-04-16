import Link from "next/link";
import type { DatasetListItem } from "@Poneglyph/validators";
import { Badge } from "@Poneglyph/ui/components/badge";
import { IconEye, IconDownload, IconDatabase } from "@tabler/icons-react";

interface DatasetCardProps {
  dataset: DatasetListItem;
}

export function DatasetCard({ dataset }: DatasetCardProps) {
  // Generate a predictable gradient based on the dataset ID for the fallback thumbnail
  const gradientId = dataset.id.charCodeAt(0) % 5;
  const gradients = [
    "from-blue-500/20 to-purple-500/20",
    "from-emerald-500/20 to-teal-500/20",
    "from-orange-500/20 to-amber-500/20",
    "from-rose-500/20 to-red-500/20",
    "from-indigo-500/20 to-cyan-500/20",
  ];
  const fallbackGradient = gradients[gradientId];

  // Format the date
  const formattedDate = new Date(dataset.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );

  return (
    <Link
      href={`/datasets/${dataset.id}`}
      className="group flex flex-col h-full overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/30"
    >
      {/* Thumbnail Area */}
      <div className="relative h-24 w-full overflow-hidden bg-muted">
        {dataset.thumbnailS3Key ? (
          <img
            src={`/api/images/${dataset.thumbnailS3Key}`} // Assuming some image proxy or direct URL
            alt={dataset.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className={`h-full w-full bg-gradient-to-r ${fallbackGradient} flex items-center justify-center`}
          >
            <IconDatabase className="w-8 h-8 text-foreground/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold leading-tight tracking-tight text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">
          {dataset.title}
        </h3>

        <div className="flex items-center text-xs text-muted-foreground mb-3">
          {dataset.publisher ? (
            <span className="truncate max-w-[120px] font-medium">
              {dataset.publisher}
            </span>
          ) : (
            <span className="truncate max-w-[120px] font-medium text-foreground/50">
              Community
            </span>
          )}
          <span className="mx-1.5">•</span>
          <span>{formattedDate}</span>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
          {dataset.description || "No description provided for this dataset."}
        </p>

        {/* Tags */}
        <div className="mt-auto flex flex-wrap gap-1.5">
          {dataset.tags && dataset.tags.length > 0 ? (
            <>
              {dataset.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="px-2 py-0 text-[10px] font-normal rounded-md bg-secondary/50 hover:bg-secondary"
                >
                  {tag.name}
                </Badge>
              ))}
              {dataset.tags.length > 3 && (
                <Badge
                  variant="secondary"
                  className="px-2 py-0 text-[10px] font-normal rounded-md bg-secondary/50"
                >
                  +{dataset.tags.length - 3}
                </Badge>
              )}
            </>
          ) : null}
        </div>
      </div>

      {/* Footer Metadata */}
      <div className="flex items-center justify-between border-t border-border/50 bg-muted/20 px-5 py-3">
        <div className="flex flex-wrap gap-1.5">
          {dataset.fileTypes && dataset.fileTypes.length > 0 ? (
            dataset.fileTypes.slice(0, 3).map((ft) => (
              <span
                key={ft}
                className="uppercase text-[10px] font-bold tracking-wider text-foreground/70 bg-background border border-border px-1.5 py-0.5 rounded"
              >
                {ft}
              </span>
            ))
          ) : (
            <span className="text-[10px] text-muted-foreground">UNKNOWN</span>
          )}
        </div>

        <div className="flex items-center gap-3 text-muted-foreground">
          <div
            className="flex items-center gap-1"
            title={`${dataset.viewCount} views`}
          >
            <IconEye className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">{dataset.viewCount}</span>
          </div>
          <div
            className="flex items-center gap-1"
            title={`${dataset.downloadCount} downloads`}
          >
            <IconDownload className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">{dataset.downloadCount}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
