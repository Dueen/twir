import localIssues from "./issues.json";

import type { mapIssues } from "../generate-build-data.mjs";

// VERY SHAKY
export type Issue = ReturnType<typeof mapIssues> & {
  title: string;
  date: string;
};

export const issues: Array<Issue> = JSON.parse(localIssues);
