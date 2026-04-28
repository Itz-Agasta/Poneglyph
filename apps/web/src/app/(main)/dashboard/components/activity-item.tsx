"use client";

import Link from "next/link";

export interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  initial: string;
  href?: string; // Optional link
}

interface ActivityItemProps {
  activity: Activity;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const content = (
    <>
      <div className="av">{activity.initial}</div>
      <div className="body">
        <b>{activity.user}</b> {activity.action} <b>{activity.target}</b>
        <br />
        <time>{activity.time}</time>
      </div>
    </>
  );

  if (activity.href) {
    return (
      <Link href={activity.href} className="activity-item hover:bg-muted/50 transition-colors">
        {content}
      </Link>
    );
  }

  return <div className="activity-item">{content}</div>;
}
