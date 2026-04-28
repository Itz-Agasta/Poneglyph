"use client";

export interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  initial: string;
}

interface ActivityItemProps {
  activity: Activity;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  return (
    <div className="activity-item">
      <div className="av">{activity.initial}</div>
      <div className="body">
        <b>{activity.user}</b> {activity.action} <b>{activity.target}</b>
        <br />
        <time>{activity.time}</time>
      </div>
    </div>
  );
}
