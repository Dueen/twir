import { graphql } from "@octokit/graphql";

import type { Blob, Tree } from "@octokit/graphql-schema";
import type { NextApiRequest, NextApiResponse } from "next";

type MappedEntries = ReturnType<typeof mapEntries>;
type QueryResult = {
  repository?: {
    object?: Tree;
  };
};
type Entry = NonNullable<Tree["entries"]>[number];

const REPO_OWNER = "rust-lang";
const REPO_NAME = "this-week-in-rust";

// Only include markdown files
const filterMarkdown = (entry: Entry) => /\.(mdx?|markdown)$/.test(entry.name);

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
  let slug = title.split(" ").join("-").toLowerCase();
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

const sortEntriesDesc = (a: MappedEntries, b: MappedEntries) =>
  b.date.getTime() - a.date.getTime();

const mapEntries = (entry: Entry) => {
  // FIXME: fix these types
  // prettier-ignore
  const title = extractTitle((entry.object as any).text as Blob["text"] ?? "");
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
    name: entry.name,
    path: entry.path,
    sourceUrl,
    title,
  };
};

const extractTitle = (string: string) => /title:\s(.*)/gi.exec(string)![1];

async function getContentList() {
  const { repository } = await graphql<QueryResult>({
    query: `query repoFiles($owner: String!, $name: String!) {
          repository(owner: $owner, name: $name) {
            object(expression: "HEAD:content") {
              ... on Tree {
                entries {
                  name
                  type
                  mode
                  
                  object {
                    ... on Blob {
                      byteSize
                      text
                      isBinary
                    }
                  }
                }
              }
            }
          }
        }`,
    owner: REPO_OWNER,
    name: REPO_NAME,
    headers: {
      authorization: `bearer ${process.env.GITHUB_GRAPHQL_TOKEN}`,
    },
  });

  if (repository && repository.object && repository.object.entries) {
    // Filter out non-markdown files
    const onlyMarkdown = repository.object.entries.filter(filterMarkdown);

    // Map the entries to a more useful format
    const mappedEntries = onlyMarkdown.map(mapEntries);

    // Sort the entries by date descending order
    const sortedEntries = mappedEntries.sort(sortEntriesDesc);

    return sortedEntries;
  }
  return [];
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const issues = await getContentList();
  res.status(200).json(issues);
};
