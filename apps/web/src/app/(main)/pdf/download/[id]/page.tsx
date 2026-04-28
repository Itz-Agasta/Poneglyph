import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@Poneglyph/ui/components/button";
import { IconArrowLeft, IconDownload, IconFileText } from "@tabler/icons-react";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ src?: string; title?: string }>;
}

export default async function PDFDownloadPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { src, title } = await searchParams;

  if (!src) {
    redirect(`/datasets/${id}`);
  }

  const decodedSrc = decodeURIComponent(src);
  const displayTitle = title ? decodeURIComponent(title) : "document";

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="mx-auto max-w-[800px] px-6 py-16">
        <div className="mb-8">
          <Link
            href={`/pdf/${id}?src=${encodeURIComponent(src)}&title=${encodeURIComponent(title ?? "")}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <IconArrowLeft className="h-4 w-4" />
            Back to Preview
          </Link>
        </div>

        <div className="rounded-lg border border-border bg-background p-8 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <IconFileText className="h-10 w-10 text-primary" />
          </div>

          <h1 className="mb-6 text-2xl font-semibold tracking-tight text-foreground">
            {displayTitle}
          </h1>

          <a href={`${decodedSrc}?download=true`} download={displayTitle}>
            <Button size="lg" className="gap-2">
              <IconDownload className="h-5 w-5" />
              Download File
            </Button>
          </a>

          <p className="mt-4 text-xs text-muted-foreground">
            Your download will start automatically
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <Link href="/datasets">
            <Button variant="outline" size="sm">
              Browse More Datasets
            </Button>
          </Link>
          <Link
            href={`/pdf/${id}?src=${encodeURIComponent(src)}&title=${encodeURIComponent(title ?? "")}`}
          >
            <Button variant="outline" size="sm">
              View Preview
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
