import * as React from "react";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import IssueCard from "./IssueCard";
import Toggle from "./Toggle";

import type { getAllIssues } from "@lib/octokit";

type Issues = Awaited<ReturnType<typeof getAllIssues>>;
type Issue = Issues[number];
type SideNavProps = React.PropsWithChildren<{
  allIssues: Issues;
}>;
export type SortValues = "newest" | "oldest";

const sortByAtom = atomWithStorage<SortValues>("sortBy", "newest");

// prettier-ignore
const sortByNewest = (a: Issue, b: Issue) => new Date(b.date).getTime() - new Date(a.date).getTime();
// prettier-ignore
const sortByOldest = (a: Issue, b: Issue) => new Date(a.date).getTime() - new Date(b.date).getTime();

const SideNav: React.FC<SideNavProps> = ({ allIssues }) => {
  const router = useRouter();
  const [currentIssue, setCurrentIssue] = React.useState("");
  const [sortBy, setSortBy] = useAtom(sortByAtom);
  const [issues, SetIssues] = React.useState(() =>
    allIssues.sort(sortBy === "newest" ? sortByNewest : sortByOldest)
  );

  React.useEffect(() => {
    if (router.query.id) {
      setCurrentIssue(String(router.query.id));
    }
  }, [router.query.id]);

  React.useEffect(() => {
    SetIssues((issues) =>
      issues.sort(sortBy === "newest" ? sortByNewest : sortByOldest)
    );
  }, [sortBy]);

  return (
    <nav className="no-scrollbar relative order-first h-full max-h-screen w-full overflow-y-auto overflow-x-hidden border-r border-stone-200 dark:border-stone-600 sm:w-56">
      <ClientOnly>
        <Toggle setSortBy={setSortBy} sortBy={sortBy!} />
        <ul className="mt-4 flex h-full flex-col">
          {issues.map((issue: any) => (
            <IssueCard
              key={issue.name}
              title={issue.title}
              description={format(new Date(issue.date), "MMM dd, yyyy")}
              id={issue.id}
              active={issue.id === currentIssue}
            />
          ))}
        </ul>
      </ClientOnly>
    </nav>
  );
};

// https://jotai.org/docs/utils/atom-with-storage#server-side-rendering
const ClientOnly: React.FC<React.PropsWithChildren> = ({
  children,
  ...delegated
}: any) => {
  const [hasMounted, setHasMounted] = React.useState(false);
  React.useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }
  return <React.Fragment {...delegated}>{children}</React.Fragment>;
};

export default SideNav;
