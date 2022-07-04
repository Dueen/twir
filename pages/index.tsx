import * as React from "react";
import Head from "next/head";
import Link from "next/link";

import { isSameYear } from "date-fns";
import { atom, ExtractAtomValue, useAtomValue } from "jotai";
import { useHydrateAtoms } from "jotai/utils";

import { Container } from "@/components/Container";
import { IndexLayout } from "@/components/IndexLayout";
import { sortByAtom, ToolBar, yearsAtom } from "@/components/Toolbar";
import { getAllIssues } from "@/lib/octokit";

type Issues = Awaited<ReturnType<typeof getAllIssues>>;
type Issue = Pick<Issues[number], "date" | "id" | "title">;
type Years = ExtractAtomValue<typeof yearsAtom>;

// prettier-ignore
const sortByNewest = (a: Issue, b: Issue) => new Date(b.date).getTime() - new Date(a.date).getTime();
// prettier-ignore
const sortByOldest = (a: Issue, b: Issue) => new Date(a.date).getTime() - new Date(b.date).getTime();

const filterYears = (issue: Issue, years: Years) =>
  years.some((year) =>
    isSameYear(new Date(Number(year), 0, 1), new Date(issue.date))
  );

const allIssuesAtom = atom<Issues>([]);
const issuesAtom = atom<Array<any>>((get) => {
  const issues = get(allIssuesAtom);
  const sortedIssues =
    get(sortByAtom) === "newest"
      ? issues.sort(sortByNewest)
      : issues.sort(sortByOldest);

  const years = get(yearsAtom);
  const filteredIssues = sortedIssues.filter((issues) =>
    filterYears(issues, years)
  );
  return filteredIssues;
});

export default function Home({ allIssues }: { allIssues: Issues }) {
  //@ts-ignore
  useHydrateAtoms([[allIssuesAtom, allIssues]]);

  const sortBy = useAtomValue(sortByAtom);
  React.useEffect(() => {}, [sortBy]);

  const issues = useAtomValue(issuesAtom);

  return (
    <React.Fragment>
      <Head>
        <title>TWIR</title>
        <meta
          name="description"
          content="An unofficial alternative This Week In Rust interface."
        />
      </Head>
      <IndexLayout>
        <div className="pt-8 pb-12 sm:pb-4">
          <Container>
            <ToolBar />
          </Container>
          <div className="relative divide-y divide-stone-200 dark:divide-stone-600 sm:mt-4 lg:mt-8 lg:border-t lg:border-stone-200 dark:lg:border-stone-600">
            {issues.map((issue: any) => (
              <IssueEntry key={issue.id} issue={issue} />
            ))}
          </div>
        </div>
      </IndexLayout>
    </React.Fragment>
  );
}

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);

const IssueEntry = ({ issue }: any) => {
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
};

const DAY_IN_SECONDS = 24 * 60 * 60;

export const getStaticProps = async () => {
  const allIssues = await getAllIssues();

  const issues = allIssues.map((issue) => ({
    date: issue.date.toISOString(),
    id: issue.id,
    title: issue.title,
  }));

  return {
    props: {
      allIssues: issues,
    },
    revalidate: DAY_IN_SECONDS,
  };
};
