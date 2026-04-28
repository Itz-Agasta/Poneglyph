import { VolunteerProfileSkeleton } from "./_components/volunteer-profile-skeleton";
import "../discover.css";

export default function VolunteerProfileLoading() {
  return (
    <div className="profile-page">
      <VolunteerProfileSkeleton />
    </div>
  );
}
