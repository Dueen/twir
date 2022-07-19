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
import type { NextPage, InferGetStaticPropsType } from "next/types";
import type { Meta } from "@/types";
import type { ParsedUrlQuery } from "querystring";
type IssueData = {
  html: string;
  meta: Meta;
};
type Params = ParsedUrlQuery & {
  id: string;
};

const extractTitle = (string: string) => /title:\s(.*)/gi.exec(string)![1];

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const files = fs.readdirSync(path.join(process.cwd(), "content"));
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

export const getStaticProps: GetStaticProps<IssueData, Params> = async (
  ctx
) => {
  const id = Number(ctx.params?.id);

  const latestIssue = Number(
    fs
      .readdirSync(path.join(process.cwd(), "content"))
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

  const filePath = path.join(process.cwd(), "content", `${id}.md`);
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
  };

  return {
    props: {
      html,
      meta,
    },
    revalidate: DAY_IN_SECONDS,
  };
};

type IssuePageProps = InferGetStaticPropsType<typeof getStaticProps>;

const IssuePage: NextPage<IssuePageProps> = ({ html, meta }) => {
  return <IssueLayout meta={meta}>{HTMLReactParser(html)}</IssueLayout>;
};

export default IssuePage;
