import { DatasetDetailSkeleton } from "./_components/dataset-detail-skeleton";

export default function DatasetDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <DatasetDetailSkeleton />
    </div>
  );
}
