import * as React from "react";
import Head from "next/head";
import { AnimatePresence, motion } from "framer-motion";
import { micromark } from "micromark";
import { gfm, gfmHtml } from "micromark-extension-gfm";
import { frontmatter, frontmatterHtml } from "micromark-extension-frontmatter";

import { getAllIssues } from "@lib/octokit";

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

const removeMoreComment = (content: string) =>
  content.replace(/\<\!-- more --\>/g, "");

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

async function avoidRateLimit() {
  if (process.env.NODE_ENV === "production") {
    await sleep();
  }
}

function sleep(ms = 500) {
  return new Promise((res) => setTimeout(res, ms));
}

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
    await avoidRateLimit();

    const issues = await getAllIssues();

    const navIssues = issues.map((issue) => ({
      ...issue,
      text: "",
      date: String(issue.date),
    }));

    const issue = issues.find(
      (entry) => extractIssueID(entry.text) === params.id
    );

    // insert frontmatter
    const withFrontmatter = insertFrontMatter(issue ? issue.text : "");

    const title = extractTitle(issue!.text);

    // remove comment
    const withoutComment = removeMoreComment(withFrontmatter);

    // micromark the content
    const parsedContent = parse(withoutComment);

    return {
      props: { parsedContent, title, navIssues },
      // Next.js will attempt to re-generate the page:
      // - When a request comes in
      // - At most once every day
      revalidate: DAY_IN_SECONDS,
    };
  }
  return {
    props: { parsedContent: parse("# Content not found"), title: "TWIR" },
  };
};

export default function Issue({
  parsedContent,
  title,
  navIssues,
}: GetStaticPropsResult) {
  return (
    <React.Fragment>
      <Head>
        <title>{`TWIR | ${title}`}</title>
      </Head>
      <AnimatePresence exitBeforeEnter>
        <motion.div
          className="prose prose-stone max-w-none bg-stone-50 p-10 text-left prose-a:text-orange-500 hover:prose-a:text-orange-500 dark:prose-invert dark:bg-stone-800 dark:prose-a:text-orange-500/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          key={title}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          dangerouslySetInnerHTML={{ __html: String(parsedContent) }}
        />
      </AnimatePresence>
    </React.Fragment>
  );
}
