const fs = require("fs-extra");
const { downloadDirList } = require("./lib/octokit.js");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

// Adding extra filter for this issue: https://github.com/rust-lang/this-week-in-rust/blob/master/content/2016-02-01-this-week-this-rust.md
// All valid issues end with in-rust.(md|markdown), but this one ☝🏾 does not.
// filter out 2013-07-06-this-week-in-rust.markdown
const filterMarkdown = (issue) => /\.(mdx?|markdown)$/.test(issue.name);

// TODO: include date for sorting
const mapIssues = (issue, idx, array) => ({
  name: issue.name,
  path: issue.path,
  id: idx + 1,
});

module.exports = async (phase, { defaultConfig }) => {
  const allIssues = await downloadDirList("content");
  const initialIssues = allIssues.filter(filterMarkdown).map(mapIssues);
  const issues = JSON.stringify(initialIssues);

  fs.writeJson(`issues.json`, issues);

  defaultConfig.reactStrictMode = true;
  return defaultConfig;
};
