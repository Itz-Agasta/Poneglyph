import Link from "next/link";
import type { VolunteerListItem } from "@/lib/types";
import { IconMapPin, IconBriefcase } from "@tabler/icons-react";

interface VolunteerCardProps {
  volunteer: VolunteerListItem;
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

export function VolunteerCard({ volunteer }: VolunteerCardProps) {
  const initials = getInitials(volunteer.name);
  const avatarSrc = getAvatarSrc(volunteer.userId, volunteer.image);
  const pastWorksCount = volunteer.pastWorks?.length ?? 0;

  return (
    <Link href={`/discover/${volunteer.userId}`} className="volunteer-card">
      <div className="volunteer-card-banner">
        <div className="volunteer-card-avatar-wrap">
          <div className="volunteer-card-avatar">
            {avatarSrc ? <img src={avatarSrc} alt={volunteer.name ?? "Volunteer"} /> : initials}
          </div>
        </div>
      </div>

      <div className="volunteer-card-body">
        <p className="volunteer-card-name">{volunteer.name ?? "Anonymous Volunteer"}</p>

        {volunteer.city && (
          <div className="volunteer-card-location">
            <IconMapPin width={12} height={12} />
            <span>{volunteer.city}</span>
          </div>
        )}

        {volunteer.description && <p className="volunteer-card-desc">{volunteer.description}</p>}

        {volunteer.tags.length > 0 && (
          <div className="volunteer-card-tags">
            {volunteer.tags.slice(0, 3).map((tag) => (
              <span key={tag.id} className="volunteer-card-tag">
                {tag.name}
              </span>
            ))}
            {volunteer.tags.length > 3 && (
              <span className="volunteer-card-tag volunteer-card-tag-more">
                +{volunteer.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="volunteer-card-footer">
        <span className="volunteer-card-works">
          <IconBriefcase width={12} height={12} />
          {pastWorksCount} {pastWorksCount === 1 ? "project" : "projects"}
        </span>
        <span className="volunteer-card-view">View profile →</span>
      </div>
    </Link>
  );
}
