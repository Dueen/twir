import fs from "fs";
import path from "path";

import * as React from "react";
import HTMLReactParser from "html-react-parser";

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import remarkFrontmatter from "remark-frontmatter";
import rehypeStringify from "rehype-stringify";

import IssueLayout from "@/components/IssueLayout";

import type { GetStaticProps, GetStaticPaths } from "next/types";
type Meta = {
  title: string;
  isFirst: boolean;
  isLast: boolean;
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

export default function Fetch({ html, meta }: { html: string; meta: Meta }) {
  return <IssueLayout meta={meta}>{HTMLReactParser(html)}</IssueLayout>;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const files = fs.readdirSync(path.join(process.cwd(), "tmp"));
  const paths = files.map((file) => ({
    params: {
      id: file.replace(".md", ""),
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

const DAY_IN_SECONDS = 24 * 60 * 60;

export const getStaticProps: GetStaticProps = async (ctx) => {
  const id = Number(ctx.params?.id);
  if (isNaN(id)) {
    return {
      notFound: true,
    };
  }

  const filePath = path.join(process.cwd(), "tmp", `${id}.md`);
  const file = fs.readFileSync(filePath, "utf8");

  const issueID = Number(extractIssueID(file));
  const latestIssue = fs
    .readdirSync(path.join(process.cwd(), "tmp"))
    .filter((file) => file.includes(".md"))
    .map((s) => Number(s.replace(".md", "")))
    .sort((a, b) => a - b)
    .pop();

  const meta = {
    title: extractTitle(file),
    isFirst: issueID == 1,
    isLast: issueID == latestIssue,
  };

  const vFile = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(remarkFrontmatter, ["yaml"])
    .use(rehypeStringify)
    .process(file);

  const html = String(vFile)
    .replace(/\{\%\sblockquote\s\%\}/gi, "<blockquote>")
    .replace(/\{\%\sendblockquote\s\%\}/gi, "</blockquote>");

  return {
    props: {
      html,
      meta,
    },
    revalidate: DAY_IN_SECONDS,
  };
};
