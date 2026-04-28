"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { IconArrowLeft, IconMapPin, IconAlertTriangle } from "@tabler/icons-react";
import { VolunteerProfileHeader } from "./_components/volunteer-profile-header";
import { VolunteerPastWorks } from "./_components/volunteer-past-works";
import { SendMessageButtonWrapper } from "./_components/send-message-button-wrapper";
import { VolunteerProfileSkeleton } from "./_components/volunteer-profile-skeleton";
import "../discover.css";

interface VolunteerProfile {
  userId: string;
  name: string;
  image: string | null;
  description: string | null;
  city: string | null;
  pastWorks: string[];
  tags: { id: string; name: string; slug: string }[];
}

async function fetchVolunteerProfile(userId: string): Promise<VolunteerProfile> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/discover/volunteers/${userId}`,
    { credentials: "include" },
  );

  if (res.status === 404) throw new Error("NOT_FOUND");
  if (!res.ok) throw new Error("Failed to load volunteer profile");

  const data = await res.json() as { volunteer: VolunteerProfile };
  return data.volunteer;
}

export default function VolunteerProfilePage() {
  const { userId } = useParams<{ userId: string }>();

  const { data: volunteer, isLoading, isError, error } = useQuery({
    queryKey: ["volunteer-profile", userId],
    queryFn: () => fetchVolunteerProfile(userId),
    retry: (count, err) => err instanceof Error && err.message !== "NOT_FOUND" && count < 2,
  });

  if (isLoading) {
    return (
      <div className="profile-page">
        <VolunteerProfileSkeleton />
      </div>
    );
  }

  if (isError) {
    const isNotFound = error instanceof Error && error.message === "NOT_FOUND";
    return (
      <div className="profile-page">
        <div className="profile-container">
          <Link href="/discover" className="profile-back">
            <IconArrowLeft width={15} height={15} />
            Back to Discover
          </Link>
          <div className="discover-empty">
            <div className="discover-error-icon">
              <IconAlertTriangle width={24} height={24} />
            </div>
            <p className="discover-empty-title">
              {isNotFound ? "Volunteer not found" : "Something went wrong"}
            </p>
            <p className="discover-empty-desc">
              {isNotFound
                ? "This volunteer profile does not exist."
                : "Failed to load the profile. Please try again."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <Link href="/discover" className="profile-back">
          <IconArrowLeft width={15} height={15} />
          Back to Discover
        </Link>

        {/* Identity card */}
        <div className="profile-card">
          <VolunteerProfileHeader volunteer={volunteer} />

          <div className="profile-head">
            <div className="profile-identity">
              <p className="profile-name">{volunteer.name ?? "Anonymous Volunteer"}</p>

              {volunteer.city && (
                <div className="profile-location">
                  <IconMapPin width={14} height={14} />
                  <span>{volunteer.city}</span>
                </div>
              )}

              {volunteer.tags.length > 0 && (
                <div className="profile-tags">
                  {volunteer.tags.map((tag) => (
                    <span key={tag.id} className="profile-tag">
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="profile-actions">
              <SendMessageButtonWrapper targetUserId={userId} targetUserName={volunteer.name} />
            </div>
          </div>
        </div>

        {/* About */}
        {volunteer.description && (
          <div className="profile-section-card">
            <p className="profile-section-title">About</p>
            <p className="profile-about-text">{volunteer.description}</p>
          </div>
        )}

        {/* Experience */}
        <div className="profile-section-card">
          <p className="profile-section-title">Experience</p>
          <VolunteerPastWorks pastWorks={volunteer.pastWorks ?? []} />
        </div>

        {/* Skills */}
        {volunteer.tags.length > 0 && (
          <div className="profile-section-card">
            <p className="profile-section-title">Skills &amp; Interests</p>
            <div className="profile-skill-tags">
              {volunteer.tags.map((tag) => (
                <span key={tag.id} className="profile-skill-tag">
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
