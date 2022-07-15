import withMDX from "@next/mdx";
import remarkCommentConfig from "remark-comment-config";
import remarkRemoveComments from "remark-remove-comments";
import remarkGithub from "remark-github";
import remarkGfm from "remark-gfm";
import remarklinkifyRegex from "remark-linkify-regex";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["tsx", "mdx"],
};

const mdxOptions = {
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      // remarkGithub({
      //   repository: "rustlang/this-week-in-rust",
      // }),
      // remarkGfm,
      // remarkRemoveComments,
    ],
    rehypePlugins: [],
    // If you use `MDXProvider`, uncomment the following line.
    providerImportSource: "@mdx-js/react",
  },
};

export default withMDX(mdxOptions)(nextConfig);
