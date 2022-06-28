import * as React from "react";
import Head from "next/head";
import { AnimatePresence, motion } from "framer-motion";
import { micromark } from "micromark";
import { gfm, gfmHtml } from "micromark-extension-gfm";
import { frontmatter, frontmatterHtml } from "micromark-extension-frontmatter";
import parseHTML from "html-react-parser";

import IssueLayout from "@/components/IssueLayout";
import { getAllIssues } from "@/lib/octokit";
import { LAST_ISSUE_ID } from "@/lib/constants";

import type {
  GetStaticPropsContext,
  InferGetStaticPropsType,
  GetStaticPaths,
  GetStaticProps,
} from "next/types";

type GetStaticPropsResult = InferGetStaticPropsType<typeof getStaticProps>;

const DAY_IN_SECONDS = 24 * 60 * 60;

const insertFrontMatter = (content: string) => {
  const match = /[\n]{2}/.exec(content);
  if (match) {
    // Add opening separator
    let newString = "---\n" + content;

    // Add closing separator
    const closingSeparator = "\n---";
    newString =
      newString.slice(0, match.index + closingSeparator.length) +
      closingSeparator +
      newString.slice(match.index + closingSeparator.length);

    return newString;
  } else {
    return content;
  }
};

const removeComments = (content: string) =>
  content.replace(/\<\!--(.*?)--\>/gis, "");

const parse = (content: string) =>
  micromark(content, {
    extensions: [gfm(), frontmatter()],
    htmlExtensions: [gfmHtml(), frontmatterHtml()],
  });

const extractIssueID = (text: string) => {
  const titleMatch = /title:\s(.*)/gi.exec(text);

  if (titleMatch) {
    const title = titleMatch[1].toLowerCase();

    const id = title.split(" ").pop() || "0";
    return id;
  }

  return "0";
};

const extractTitle = (string: string) => /title:\s(.*)/gi.exec(string)![1];

export const getStaticPaths: GetStaticPaths = async () => {
  const issues = await getAllIssues();
  const paths = issues.map((issue: any) => ({
    params: { id: issue.id },
  }));
  return {
    paths: paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext) => {
  if (params && params.id) {
    const issues = await getAllIssues();

    const issue = issues.find(
      (entry) => extractIssueID(entry.text) === params.id
    );

    const meta = {
      title: extractTitle(issue!.text),
      isFirst: issue!.id === "1",
      isLast: issue!.id === LAST_ISSUE_ID,
    };

    // insert frontmatter
    const withFrontmatter = insertFrontMatter(issue ? issue.text : "");

    // remove comment
    const withoutComment = removeComments(withFrontmatter);

    // micromark the content
    const content = parse(withoutComment);

    return {
      props: { content, meta },
      // Next.js will attempt to re-generate the page:
      // - When a request comes in
      // - At most once every day
      revalidate: DAY_IN_SECONDS,
    };
  }
  const meta = {
    title: "TWIR",
  };
  return {
    props: { content: parse("# Content not found"), meta },
  };
};

export default function Issue({ content, meta }: GetStaticPropsResult) {
  return (
    <React.Fragment>
      <Head>
        <title>{`TWIR | ${meta.title}`}</title>
      </Head>
      <IssueLayout isFirst={meta.isFirst} isLast={meta.isLast}>
        <AnimatePresence exitBeforeEnter>
          <motion.div
            className="prose prose-stone max-w-none bg-stone-50 p-10 text-left prose-a:text-orange-500 hover:prose-a:text-orange-500 dark:prose-invert dark:bg-stone-800 dark:prose-a:text-orange-500/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key={meta.title}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {parseHTML(content)}
          </motion.div>
        </AnimatePresence>
      </IssueLayout>
    </React.Fragment>
  );
}
