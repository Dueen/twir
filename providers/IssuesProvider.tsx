import * as React from "react";
import { useAtom, atom, useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { issues } from "@data/issues";

import type { RESET } from "jotai/utils";
type SortValues = "newest" | "oldest";
type Issue = typeof issues[number];
type Issues = Array<Issue>;
type IssuesProviderProps = React.PropsWithChildren<{}>;
type IssuesProviderState = {
  issues: Issues;
  sortBy: SortValues;
  setSortBy: (update: typeof RESET | React.SetStateAction<SortValues>) => void;
};

export const IssuesContext = React.createContext<IssuesProviderState | null>(
  null
);

// prettier-ignore
const sortByNewest = (a: Issue, b: Issue) => new Date(b.date).getTime() - new Date(a.date).getTime();
// prettier-ignore
const sortByOldest = (a: Issue, b: Issue) => new Date(a.date).getTime() - new Date(b.date).getTime();

export const sortByAtom = atomWithStorage<SortValues>("sortBy", "newest");

export const issuesAtom = atom<Issues>(issues);

export const sortedIssuesAtom = atom((get) => {
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
