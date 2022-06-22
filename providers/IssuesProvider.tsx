import * as React from "react";
import { useAtom, atom, useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { getAllIssues } from "@lib/octokit";

import type { RESET } from "jotai/utils";

type SortValues = "newest" | "oldest";
type Issue = Issues[number];
type Issues = Awaited<ReturnType<typeof getAllIssues>>;
type IssuesProviderProps = React.PropsWithChildren<{}>;
type IssuesProviderState = {
  issues: Issues;
  sortBy: SortValues;
  setSortBy: (update: typeof RESET | React.SetStateAction<SortValues>) => void;
};

const IssuesContext = React.createContext<IssuesProviderState | null>(null);

// prettier-ignore
const sortByNewest = (a: Issue, b: Issue) => new Date(b.date).getTime() - new Date(a.date).getTime();
// prettier-ignore
const sortByOldest = (a: Issue, b: Issue) => new Date(a.date).getTime() - new Date(b.date).getTime();

const sortByAtom = atomWithStorage<SortValues>("sortBy", "newest");

// prettier-ignore
const URL = process.env.NODE_ENV == "development" ? "http://localhost:3000" : String(process.env.NEXT_PUBLIC_VERCEL_URL);
const issuesAtom = atom<any>(async () => {
  const issues = await fetch(`${URL}/api/issues`).then((res) => res.json());
  return issues;
});

const sortedIssuesAtom = atom((get) => {
  const sortBy = get(sortByAtom);
  const issues = get(issuesAtom);
  const sortedIssues = issues.sort(
    sortBy === "newest" ? sortByNewest : sortByOldest
  );
  return sortedIssues;
});

export const IssuesProvider: React.FC<IssuesProviderProps> = ({ children }) => {
  const issues = useAtomValue(sortedIssuesAtom);
  const [sortBy, setSortBy] = useAtom(sortByAtom);

  return (
    <IssuesContext.Provider value={{ issues, sortBy, setSortBy }}>
      {children}
    </IssuesContext.Provider>
  );
};

export const useIssues = () => {
  const context = React.useContext(IssuesContext);
  if (context === null) {
    throw new Error("useIssues must be used within a IssuesProvider");
  }
  return context;
};
