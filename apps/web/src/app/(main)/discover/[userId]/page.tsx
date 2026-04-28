import { notFound } from "next/navigation";
import Link from "next/link";
import { IconArrowLeft, IconMapPin } from "@tabler/icons-react";
import { apiClientWithCookies } from "@/lib/api-client";
import { VolunteerProfileHeader } from "./_components/volunteer-profile-header";
import { VolunteerPastWorks } from "./_components/volunteer-past-works";
import { SendMessageButtonWrapper } from "./_components/send-message-button-wrapper";
import "../discover.css";

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function VolunteerProfilePage(props: Props) {
  const { userId } = await props.params;

  const client = await apiClientWithCookies();
  const res = await client.get("/api/discover/volunteers/:targetUserId", {
    param: { targetUserId: userId },
  });

  if (res.status === 404) notFound();
  if (!res.ok) throw new Error("Failed to load volunteer profile");

  const { volunteer } = await res.json();

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
                  {volunteer.tags.map((tag: { id: string; name: string }) => (
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
              {volunteer.tags.map((tag: { id: string; name: string }) => (
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
