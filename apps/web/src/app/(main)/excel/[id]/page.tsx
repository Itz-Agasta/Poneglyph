import { redirect } from "next/navigation";
import { ExcelViewer } from "./_components/excel-viewer";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ src?: string; title?: string }>;
}

export default async function ExcelViewerPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { src, title } = await searchParams;

  if (!src) {
    redirect(`/datasets/${id}`);
  }

  const decodedSrc = decodeURIComponent(src);
  const displayTitle = title ? decodeURIComponent(title) : "Excel Preview";

  return <ExcelViewer datasetId={id} src={decodedSrc} title={displayTitle} />;
}
