import * as React from "react";
import Head from "next/head";
import { AnimatePresence, motion } from "framer-motion";
import { micromark } from "micromark";
import { gfm, gfmHtml } from "micromark-extension-gfm";
import { frontmatter, frontmatterHtml } from "micromark-extension-frontmatter";

import { getAllIssues } from "@lib/octokit";
import Layout from "@components/Layout";

import type {
  GetStaticPropsContext,
  InferGetStaticPropsType,
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

const extractFrontMatter = (content: string) => {
  const extract = (re: RegExp, str: string) => {
    const match = str.match(re);
    if (match) {
      return match[0].replace(re, "").trim();
    }
    return "";
  };

  return {
    title: extract(/title:\s(.*)/gi, content),
    date: extract(/date:\s(.*)/gi, content),
    category: extract(/category:\s(.*)/gi, content),
  };
};

const extractIssueID = (text: string) => {
  const titleMatch = /title:\s(.*)/gi.exec(text);

  if (titleMatch) {
    const title = titleMatch[1].toLowerCase();

    const id = title.split(" ").pop() || "0";
    return id;
  }

  return "0";
};

async function avoidRateLimit() {
  if (process.env.NODE_ENV === "production") {
    await sleep();
  }
}

function sleep(ms = 500) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function getStaticPaths() {
  const issues = await getAllIssues();
  const paths = issues.map((issue: any) => ({
    params: { id: issue.id },
  }));
  return {
    paths: paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
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

    const frontmatter = extractFrontMatter(issue ? issue.text : "");

    // insert frontmatter
    const withFrontmatter = insertFrontMatter(issue ? issue.text : "");

    // remove comment
    const withoutComment = removeMoreComment(withFrontmatter);

    // micromark the content
    const parsedContent = parse(withoutComment);

    return {
      props: { parsedContent, frontmatter, navIssues },
      // Next.js will attempt to re-generate the page:
      // - When a request comes in
      // - At most once every day
      revalidate: DAY_IN_SECONDS,
    };
  }
  const frontmatter = { title: "TWIR.IO", date: "", category: "" };
  return {
    props: { parsedContent: parse("# Content not found"), frontmatter },
  };
}

export default function Issue({
  parsedContent,
  frontmatter,
  navIssues,
}: GetStaticPropsResult) {
  return (
    <React.Fragment>
      <Head>
        <title>{frontmatter.title}</title>
      </Head>
      {/* @ts-ignore */}
      <Layout allIssues={navIssues || []}>
        <AnimatePresence exitBeforeEnter>
          <motion.div
            className="prose prose-stone max-w-none bg-stone-50 p-10 text-left prose-a:text-amber-500 hover:prose-a:text-amber-500 dark:prose-invert dark:bg-stone-800 dark:prose-a:text-amber-500/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key={frontmatter.title}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            dangerouslySetInnerHTML={{ __html: String(parsedContent) }}
          />
        </AnimatePresence>
      </Layout>
    </React.Fragment>
  );
}
