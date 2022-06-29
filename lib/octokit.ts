import { Octokit as createOctokit } from "@octokit/core";
import { throttling } from "@octokit/plugin-throttling";

import type { Blob, Tree, Repository } from "@octokit/graphql-schema";

type MappedEntries = ReturnType<typeof mapEntries>;
type Entry = NonNullable<Tree["entries"]>[number];
type ThrottleOptions = {
  method: string;
  url: string;
  request: { retryCount: number };
};

const Octokit = createOctokit.plugin(throttling);

const octokit = new Octokit({
  auth: `bearer ${process.env.GITHUB_GRAPHQL_TOKEN}`,
  throttle: {
    onRateLimit: (retryAfter: number, options: ThrottleOptions) => {
      console.warn(
        `Request quota exhausted for request ${options.method} ${options.url}. Retrying after ${retryAfter} seconds.`
      );

      return true;
    },
    onSecondaryRateLimit: (retryAfter: number, options: ThrottleOptions) => {
      // does not retry, only logs a warning
      octokit.log.warn(
        `secondary rate limit detected for request ${options.method} ${options.url}`
      );
    },
  },
});

const REPO_OWNER = "rust-lang";
const REPO_NAME = "this-week-in-rust";

// Only include markdown files
const filterMarkdown = (entry: Entry) => /\.(mdx?|markdown)$/.test(entry.name);

// Filter out non-this-week-in-rust issues
const filterTWIR = (entry: Entry) =>
  /\d{4}-\d{2}-\d{2}-(this|these|last)-weeks?-(in|this)-rust/.test(entry.name);

// 2013-06-22-this-week-in-rust.markdown -> 2013-06-22T22:00:00.000Z
const parseDate = (name: string) => {
  const slug = name.replace(/\.(mdx?|markdown)$/, "");
  const [year, month, day] = slug.split("-").map(Number);
  const date = new Date();
  date.setUTCFullYear(year);
  date.setUTCMonth(month - 1);
  date.setUTCDate(day);
  date.setHours(0, 0, 0, 0);
  return date;
};

// 2013-06-22-this-week-in-rust.markdown -> https://this-week-in-rust.org/blog/2013/06/22/this-week-in-rust-3/
const baseURL = "https://this-week-in-rust.org/blog";
const parseSourceUrl = (
  title: string,
  year: number,
  month: number,
  day: number
) => {
  let slug = title.trim().replace(" ", "_").toLowerCase();
  // prettier-ignore
  const [yearString, monthString, dayString] = [year, month, day].map((n) => String(n).padStart(2, "0"));

  // NOTE: SPECIAL CASES
  if (
    slug === "the-state-of-rust-0.7" ||
    slug === "the-state-of-rust-0.8" ||
    slug === "the-state-of-rust-0.9"
  ) {
    slug = slug.replace(".", "");
  }

  //NOTE: https://this-week-in-rust.org/blog/2014/07/15/state-of-rust-0.11.0/ IS NOT INCLUDED IN THE FINAL LIST

  return `${baseURL}/${yearString}/${monthString}/${dayString}/${slug}`;
};

const extractTitle = (string: string) => /title:\s(.*)/gi.exec(string)![1];

const extractIssueID = (text: string) => {
  const titleMatch = /title:\s(.*)/gi.exec(text);

  if (titleMatch) {
    const title = titleMatch[1].toLowerCase();

    const id = title.split(" ").pop() || "0";
    return id;
  }

  return "0";
};

const sortEntriesDesc = (a: MappedEntries, b: MappedEntries) =>
  b.date.getTime() - a.date.getTime();

const mapEntries = (entry: Entry) => {
  // FIXME: fix these types
  const text = (entry.object as any).text as string;
  const title = extractTitle(text ?? "");
  const id = extractIssueID(text ?? "");
  // TODO: extract category from text
  //   const catyegory = extractCategory((entry.object as any).text as Blob["text"] as string);
  const date = parseDate(entry.name);
  const sourceUrl = parseSourceUrl(
    title,
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
  return {
    date,
    id,
    name: entry.name,
    path: entry.path ?? null,
    sourceUrl,
    text,
    title,
  };
};

export async function getAllIssues() {
  await avoidRateLimit();
  type QueryAllResult = {
    repository: Repository & {
      object: Tree & { entries: Tree["entries"] & { object: Blob } };
    };
  };
  const { repository } = await octokit.graphql<QueryAllResult>({
    query: `query repoFiles($owner: String!, $name: String!) {
                repository(owner: $owner, name: $name) {
                  object(expression: "HEAD:content") {
                    ... on Tree {
                      entries {
                        name
                        object {
                          ... on Blob {
                            text
                          }
                        }
                      }
                    }
                  }
                }
              }`,
    owner: REPO_OWNER,
    name: REPO_NAME,
  });

  if (repository && repository.object && repository.object.entries) {
    // Filter out non-markdown files
    const onlyMarkdown = repository.object.entries.filter(filterMarkdown);

    // Filter out non-this-week-in-rust issues
    const onlyTWIR = onlyMarkdown.filter(filterTWIR);

    // Map the entries to a more useful format
    const mappedEntries = onlyTWIR.map(mapEntries);

    // Sort the entries by date descending order
    const sortedEntries = mappedEntries.sort(sortEntriesDesc);

    return sortedEntries;
  }

  throw new Error("could not get issues");
}

export async function getIssueById(searchID: string) {
  await avoidRateLimit();
  const issues = await getAllIssues();

  const issue = issues.find((entry) => extractIssueID(entry.text) === searchID);
  if (issue) {
    return issue;
  }
  return issues[0];
}

let lastFetch = new Date();
// https://github.com/vercel/next.js/discussions/18550
export async function avoidRateLimit() {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    let sinceLastFetch = new Date().getTime() - lastFetch.getTime();
    if (sinceLastFetch < 5000) {
      await sleep();
    }
    lastFetch = new Date();
  }
}

function sleep(ms = 5000) {
  return new Promise((res) => setTimeout(res, ms));
}
