import fs from "fs";
import path from "path";

import HTMLReactParser from "html-react-parser";
import * as React from "react";

import IssueLayout from "@/components/IssueLayout";
import { convertToHTML } from "@/lib/mdx";

import type { Meta } from "@/types";
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from "next/types";
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

  const html = await convertToHTML(file);

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
  return (
    <React.Fragment>
      <IssueLayout meta={meta}>{HTMLReactParser(html)}</IssueLayout>;
    </React.Fragment>
  );
};

export default IssuePage;
