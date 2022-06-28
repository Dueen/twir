import * as React from "react";
import Head from "next/head";
import Link from "next/link";

import { getAllIssues } from "@/lib/octokit";
import { Container } from "@/components/Container";

export default function Home({ issues }: any) {
  return (
    <>
      <Head>
        <title>TWIR</title>
        <meta
          name="description"
          content="An unofficial alternative This Week In Rust interface."
        />
      </Head>
      <div className="pt-16 pb-12 sm:pb-4 lg:pt-12">
        <Container>
          <h1 className="text-2xl font-bold leading-7 text-stone-900 dark:text-stone-50">
            Issues
          </h1>
        </Container>
        <div className="relative divide-y divide-stone-200 dark:divide-stone-600 sm:mt-4 lg:mt-8 lg:border-t lg:border-stone-200 dark:lg:border-stone-600">
          {issues.map((issue: any) => (
            <IssueEntry key={issue.id} issue={issue} />
          ))}
        </div>
      </div>
    </>
  );
}

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);

function IssueEntry({ issue }: any) {
  const date = new Date(issue.date);

  return (
    <article
      aria-labelledby={`issue-${issue.id}-title`}
      className={"py-10 sm:py-12"}
    >
      <Container>
        <div className="flex flex-col items-start">
          <time
            dateTime={date.toISOString()}
            className="-order-1 font-mono text-sm leading-7 text-stone-500 dark:text-stone-300"
          >
            {formatDate(date)}
          </time>
          <h2
            id={`issue-${issue.id}-title`}
            className="mt-2 text-lg font-bold text-stone-900"
          >
            <Link href={`/${issue.id}`}>
              <a>{issue.title}</a>
            </Link>
          </h2>
        </div>
      </Container>
    </article>
  );
}

export async function getStaticProps() {
  const allIssues = await getAllIssues();

  const issues = allIssues.map((issue) => ({
    date: issue.date.toISOString(),
    id: issue.id,
    title: issue.title,
  }));

  return {
    props: {
      issues,
    },
    revalidate: 10,
  };
}
