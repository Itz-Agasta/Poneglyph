import { IconBriefcase } from "@tabler/icons-react";

interface VolunteerPastWorksProps {
  pastWorks: string[];
}

export function VolunteerPastWorks({ pastWorks }: VolunteerPastWorksProps) {
  if (pastWorks.length === 0) {
    return <p className="profile-no-works">No past work listed yet.</p>;
  }

  return (
    <div className="profile-works">
      {pastWorks.map((work, index) => (
        <div key={index} className="profile-work-item">
          <div className="profile-work-icon-wrap">
            <IconBriefcase width={16} height={16} />
          </div>
          <p className="profile-work-text">{work}</p>
        </div>
      ))}
    </div>
  );
}
