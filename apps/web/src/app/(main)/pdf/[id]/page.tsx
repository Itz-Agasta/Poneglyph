import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@Poneglyph/ui/components/button";
import { IconArrowLeft, IconDownload, IconFileText } from "@tabler/icons-react";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ src?: string; title?: string }>;
}

export default async function PDFViewerPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { src, title } = await searchParams;

  if (!src) {
    redirect(`/datasets/${id}`);
  }

  const decodedSrc = decodeURIComponent(src);
  const displayTitle = title ? decodeURIComponent(title) : "Document Preview";

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="border-b border-border shrink-0">
        <div className="mx-auto max-w-[1400px] px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/datasets/${id}`}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <IconArrowLeft className="h-4 w-4" />
                Back to Dataset
              </Link>
              <div className="h-5 w-px bg-border" />
              <div className="flex items-center gap-2">
                <IconFileText className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground truncate max-w-[320px]">
                  {displayTitle}
                </span>
              </div>
            </div>
            <a href={`${decodedSrc}?download=true`} download={displayTitle}>
              <Button size="sm" className="gap-2">
                <IconDownload className="h-4 w-4" />
                Download
              </Button>
            </a>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <iframe
          src={decodedSrc}
          className="w-full h-full border-0"
          title={displayTitle}
        />
      </div>
    </div>
  );
}
