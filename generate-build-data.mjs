#!/usr/bin/node
import fs from "fs-extra";
import { downloadDirList } from "./lib/octokit.js";

// Only include markdown files
const filterMarkdown = (issue) => /\.(mdx?|markdown)$/.test(issue.name);
// Filter out non-this-week-in-rust issues
const filterTWIR = (issue) =>
  /\d{4}-\d{2}-\d{2}-(this|these|last)-weeks?-(in|this)-rust/.test(issue.name);

// 2013-06-22-this-week-in-rust.markdown -> https://this-week-in-rust.org/blog/2013/06/22/this-week-in-rust-3/
const baseURL = "https://this-week-in-rust.org/blog/";
const parseSourceUrl = (name, idx) => {
  const slug = name.replace(/\.(mdx?|markdown)$/, "");
  const [year, month, day, ...rest] = slug.split("-");
  const path = rest.join("-");
  return `${baseURL}${year}/${month}/${day}/${path}-${idx}/`;
};

// 2013-06-22-this-week-in-rust.markdown -> 2013-06-22T22:00:00.000Z
const parseDate = (name) => {
  const slug = name.replace(/\.(mdx?|markdown)$/, "");
  const [year, month, day] = slug.split("-");
  return new Date(year, Number(month) - 1, day);
};

const sortIssues = (a, b) => b.date.getTime() - a.date.getTime();

export const mapIssues = (issue) => ({
  name: issue.name,
  path: issue.path,
  date: parseDate(issue.name),
});

export const addProperties = (issue, idx, array) => {
  const issueNumber = String(array.length - idx);
  return {
    ...issue,
    id: issueNumber,
    title: `This Week in Rust ${issueNumber}`,
    sourceUrl: parseSourceUrl(issue.name, issueNumber),
  };
};

async function run() {
  const allIssues = await downloadDirList("content");
  const initialIssues = allIssues
    // FIXME: this is for dev. make sure we have all the issues for production.
    .slice(0, 10)
    // Only include markdown files
    .filter(filterMarkdown)
    // Only include this week in rust issues
    // TODO: include the rest
    .filter(filterTWIR)
    // Map to the properties we need
    .map(mapIssues)
    // Sort by date, newest first
    .sort(sortIssues)
    // Add the title
    .map(addProperties);

  const issues = JSON.stringify(initialIssues);

  fs.writeJson(`data/issues.json`, issues);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

/***** NOTE: SPECIAL CASES *****/
// 2013-07-05-the-state-of-rust.markdown
// 2013-07-29-last-week-in-rust.markdown
// 2013-10-06-the-state-of-rust-0-dot-8.markdown
// 2013-11-09-these-weeks-in-rust.markdown
// 2014-01-12-the-state-of-rust-0-dot-9.markdown
// state-of-rust-0-11-0.rst
