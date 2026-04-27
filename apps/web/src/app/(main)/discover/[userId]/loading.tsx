import { VolunteerProfileSkeleton } from "./_components/volunteer-profile-skeleton";
import { IconArrowLeft } from "@tabler/icons-react";

export default function VolunteerProfileLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="inline-flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
        <IconArrowLeft className="w-4 h-4" />
        Back to Discover
      </div>
      <VolunteerProfileSkeleton />
    </div>
  );
}
