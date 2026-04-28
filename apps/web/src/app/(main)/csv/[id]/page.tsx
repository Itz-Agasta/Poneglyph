import { redirect } from "next/navigation";
import { CsvViewer } from "./_components/csv-viewer";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ src?: string; title?: string }>;
}

export default async function CsvViewerPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { src, title } = await searchParams;

  if (!src) {
    redirect(`/datasets/${id}`);
  }

  const decodedSrc = decodeURIComponent(src);
  const displayTitle = title ? decodeURIComponent(title) : "CSV Preview";

  return <CsvViewer datasetId={id} src={decodedSrc} title={displayTitle} />;
}
