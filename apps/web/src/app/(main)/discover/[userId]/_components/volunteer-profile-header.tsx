import type { VolunteerProfile } from "@/lib/types";

interface VolunteerProfileBannerProps {
  volunteer: VolunteerProfile;
}

function getAvatarSrc(userId: string, fallback: string | null): string | undefined {
  const s3 = process.env.NEXT_PUBLIC_S3_ENDPOINT;
  if (s3) return `${s3}/pfp/${userId}.jpg`;
  return fallback ?? undefined;
}

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function VolunteerProfileHeader({ volunteer }: VolunteerProfileBannerProps) {
  const initials = getInitials(volunteer.name);
  const avatarSrc = getAvatarSrc(volunteer.userId, volunteer.image);

  return (
    <div className="profile-banner">
      <div className="profile-avatar-wrap">
        <div className="profile-avatar">
          {avatarSrc ? <img src={avatarSrc} alt={volunteer.name ?? "Volunteer"} /> : initials}
        </div>
      </div>
    </div>
  );
}
