import * as React from "react";

import IssueCard from "./IssueCard";
import { issues as initialIssues } from "@data/issues";

// TODO: add radix tabs -> sort by latest, oldest, etc.
const SideNav = () => {
  const issues = initialIssues;
  return (
    <nav className="no-scrollbar col-span-1 col-start-1 h-full max-h-screen w-full overflow-y-auto overflow-x-hidden border-r border-stone-200 dark:border-stone-600 xl:col-span-2">
      <ul className="flex h-full flex-col">
        {issues.map((issue: any) => (
          <IssueCard
            key={issue.name}
            title={`Issue ${issue.id}`}
            description={issue.name}
            id={issue.id}
          />
        ))}
      </ul>
    </nav>
  );
};

export default SideNav;
