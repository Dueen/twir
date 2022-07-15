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
import type { Meta } from "@/types";

const extractTitle = (string: string) => /title:\s(.*)/gi.exec(string)![1];

export default function Fetch({ html, meta }: { html: string; meta: Meta }) {
  return <IssueLayout meta={meta}>{HTMLReactParser(html)}</IssueLayout>;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const files = fs.readdirSync(path.join(process.cwd(), "tmp"));
  const paths = files
    .filter((file) => file.includes(".md"))
    .map((file) => ({
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

  const latestIssue = Number(
    fs
      .readdirSync(path.join(process.cwd(), "tmp"))
      .filter((file) => file.includes(".md"))
      .map((s) => Number(s.replace(".md", "")))
      .sort((a, b) => a - b)
      .pop()
  );

  if (isNaN(id) || id < 0 || id > latestIssue) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const filePath = path.join(process.cwd(), "tmp", `${id}.md`);
  const file = fs.readFileSync(filePath, "utf8");

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

  const meta = {
    title: extractTitle(file),
    hasNext: id < latestIssue,
    hasPrev: id > 1,
  };

  return {
    props: {
      html,
      meta,
    },
    revalidate: DAY_IN_SECONDS,
  };
};
