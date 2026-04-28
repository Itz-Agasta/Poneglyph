import Link from "next/link";
import { IconUsers, IconDatabase, IconArticle } from "@tabler/icons-react";

export function DiscoverTabs({ currentTab }: { currentTab: string }) {
  const tabs = [
    { id: "volunteers", label: "Volunteers", icon: IconUsers, default: true },
    { id: "datasets", label: "Datasets", icon: IconDatabase },
    { id: "articles", label: "Articles", icon: IconArticle },
  ];

  return (
    <div className="discover-tabs">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id || (tab.default && !currentTab);
        const Icon = tab.icon;

        return (
          <Link
            key={tab.id}
            href={`/discover?type=${tab.id}`}
            className={`discover-tab ${isActive ? "discover-tab-active" : ""}`}
          >
            <Icon size={18} stroke={isActive ? 2.5 : 2} />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
