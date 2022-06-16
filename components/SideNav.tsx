import * as React from "react";
import Link from "next/link";
import { useIssues } from "@providers/IssuesProvider";
import { issues as initialIssues } from "@data/issues";

import type { DirectoryList } from "@lib/octokit";

type MappedDirectoryList = {
  name: string;
  path: string;
  id: string;
};

// TODO: add radix tabs -> sort by latest, oldest, etc.
const SideNav = () => {
  const issues = initialIssues;
  console.log(issues[0]);
  return (
    <nav className="no-scrollbar col-span-1 col-start-1 h-full max-h-screen w-full overflow-y-auto overflow-x-hidden border-r border-stone-200 dark:border-stone-600 xl:col-span-2">
      <ul className="flex h-full flex-col">
        {issues.map((issue: any) => (
          <Link key={issue.name} href={`/issue/${issue.id}`}>
            <a className="flex flex-col items-start py-2 px-4 text-black dark:text-white">
              <span className="text-sm">Issue: {issue.id}</span>
              <span className="ml-2 truncate text-sm">{issue.name}</span>
            </a>
          </Link>
        ))}
      </ul>
    </nav>
  );
};

export default SideNav;
