import remarkGfm from "remark-gfm";
import { serialize } from "next-mdx-remote/serialize";

const linkRegex = /[<|(]([http|mailto:].*)[)|>]/gi;
// prettier-ignore
const replceLinks = (match: string, p1: string) => `[${p1.replace("mailto:", "")}](${p1})`;

// prettier-ignore
const replaceBlockQoute = (match: string, p1: string) => p1.split("\n").map((line: string) => `> ${line}`).join("\n");

// prettier-ignore
const pullRequestRegex = /\{\% blockquote \@dotdash (.*) \%\}([\s\S]*?)\{\% endblockquote \%\}/gi;
// prettier-ignore
const replacePullRequest = (match: string, p1: string, p2: string) =>`[${p2}](${p1})`;

const CONTENT_NOT_FOUND = (issue: any) => `
# Content not found
## Visit the original issue [here](${issue.sourceUrl})
`;

const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
  },
};

export const parse = async (issue: any) => {
  const cleanContent = issue.content
    // fixes: Unexpected character `!` (U+0021)
    //
    .replace(/\<\!.*\>/, "")
    // fixes: to create a link in MDX, use `[text](url)`
    // maps <https://....> to [text](url)
    .replace(linkRegex, replceLinks)
    // fixes: Could not parse expression with acorn
    // replaces lines inside of blockqoute with:  > ...
    .replace(
      /\{\% blockquote \%\}(.*)\{\% endblockquote \%\}/gis,
      replaceBlockQoute
    )
    // fixes: Could not parse expression with acorn
    // replaces the pull request with: [description](url)
    .replace(pullRequestRegex, replacePullRequest);

  try {
    return await serialize(cleanContent, options);
  } catch (e) {
    return await serialize(CONTENT_NOT_FOUND(issue), options);
  }
};
