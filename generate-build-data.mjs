#!/usr/bin/node
import fs from "fs-extra";
import { downloadDirList } from "./lib/octokit.js";

// Adding extra filter for this issue: https://github.com/rust-lang/this-week-in-rust/blob/master/content/2016-02-01-this-week-this-rust.md
// All valid issues end with in-rust.(md|markdown), but this one ☝🏾 does not.
// filter out 2013-07-06-this-week-in-rust.markdown
// TODO: look intp this issue and see if it's valid or not.
const filterMarkdown = (issue) => /\.(mdx?|markdown)$/.test(issue.name);

// 2013-06-22-this-week-in-rust.markdown -> https://this-week-in-rust.org/blog/2013/06/22/this-week-in-rust-3/
const baseURL = "https://this-week-in-rust.org/blog/";
const parseSourceUrl = (name, idx) => {
  const slug = name.replace(/\.(mdx?|markdown)$/, "");
  const [year, month, day, ...rest] = slug.split("-");
  const path = rest.join("-");
  return `${baseURL}${year}/${month}/${day}/${path}-${idx}/`;
};

// 2013-06-22-this-week-in-rust.markdown -> Sat, 22 Jun 2013 00:00:00 GMT
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
    // Map to the properties we need
    .map(mapIssues)
    // Sort by date, newest first
    .sort(sortIssues)
    // Add the title
    .map(addProperties);

  const issues = JSON.stringify(initialIssues);

  fs.writeJson(`data/issues.json`, issues);
}

run();
