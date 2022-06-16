const fs = require("fs-extra");
const { downloadDirList } = require("./lib/octokit");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

// Adding extra filter for this issue: https://github.com/rust-lang/this-week-in-rust/blob/master/content/2016-02-01-this-week-this-rust.md
// All valid issues end with in-rust.(md|markdown), but this one ☝🏾 does not.
// filter out 2013-07-06-this-week-in-rust.markdown
// TODO: look intp this issue and see if it's valid or not.
const filterMarkdown = (issue) => /\.(mdx?|markdown)$/.test(issue.name);

// 2013-06-22-this-week-in-rust.markdown -> https://this-week-in-rust.org/blog/2013/06/22/this-week-in-rust-3/
const baseURL = "https://this-week-in-rust.org/blog/";
const parseSourceUrl = (name, index) => {
  const slug = name.replace(/\.(mdx?|markdown)$/, "");
  const [year, month, day, ...rest] = slug.split("-");
  const path = rest.join("-");
  return `${baseURL}${year}/${month}/${day}/${path}-${index}/`;
};

// TODO: include date for sorting
// TODO: parse the title
const mapIssues = (issue, idx, array) => ({
  name: issue.name,
  path: issue.path,
  id: String(idx + 1),
  sourceUrl: parseSourceUrl(issue.name, idx + 1),
  // date: new Date(),
});

/** @type {import('next').NextConfig} */
module.exports = async (phase, { defaultConfig }) => {
  const allIssues = await downloadDirList("content");
  const initialIssues = allIssues
    .filter(filterMarkdown)
    .map(mapIssues)
    .slice(0, 10);
  const issues = JSON.stringify(initialIssues);

  fs.writeJson(`data/issues.json`, issues);

  defaultConfig.reactStrictMode = true;
  return defaultConfig;
};
