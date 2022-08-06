import { readFile } from "fs/promises";
import path from "path";

import * as React from "react";
import { isSameYear } from "date-fns";
import { atom, ExtractAtomValue, useAtomValue } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import Head from "next/head";
import Link from "next/link";

import { Container } from "@/components/Container";
import { IndexLayout } from "@/components/IndexLayout";
import { sortByAtom, ToolBar, yearsAtom } from "@/components/Toolbar";

import type { Issues } from "@/scripts/prebuild.mjs";
import type {
  NextPage,
  InferGetStaticPropsType,
  GetStaticProps,
} from "next/types";
type Issue = Pick<Issues[number], "date" | "id" | "title">;
type Years = ExtractAtomValue<typeof yearsAtom>;

// prettier-ignore
const sortByNewest = (a: Issue, b: Issue) => b.date.getTime() - a.date.getTime();
// prettier-ignore
const sortByOldest = (a: Issue, b: Issue) => a.date.getTime() - b.date.getTime();

const filterYears = (issue: Issue, years: Years) =>
  years.some((year) => isSameYear(new Date(Number(year), 0, 1), issue.date));

const allIssuesAtom = atom<Issues>([]);
const issuesAtom = atom<Issues>((get) => {
  const issues = get(allIssuesAtom);
  const sortedIssues = issues.sort(
    get(sortByAtom) === "newest" ? sortByNewest : sortByOldest
  );

  const years = get(yearsAtom);
  const filteredIssues = sortedIssues.filter((issues) =>
    filterYears(issues, years)
  );
  return filteredIssues;
});

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);

const DAY_IN_SECONDS = 24 * 60 * 60;

export const getStaticProps: GetStaticProps = async () => {
  const filePath = path.join(process.cwd(), "content", "meta.json");
  const allIssues: Issues = JSON.parse(await readFile(filePath, "utf8"));

  const allAvailableYears = [
    ...new Set(
      allIssues.map((issue) => new Date(issue.date).getFullYear().toString())
    ),
  ];

  return {
    props: {
      allIssues,
      allAvailableYears,
    },
    revalidate: DAY_IN_SECONDS,
  };
};

const IssueEntry = ({ issue }: { issue: Issues[number] }) => {
  return (
    <article
      aria-labelledby={`issue-${issue.id}-title`}
      className="py-10 sm:py-12"
      id={`issue-${issue.id}`}
    >
      <Container>
        <div className="flex flex-col items-start">
          <time
            dateTime={issue.date.toISOString()}
            className="-order-1 font-mono text-sm leading-7 text-stone-500 dark:text-stone-300"
          >
            {formatDate(issue.date)}
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

type IndexPageProps = InferGetStaticPropsType<typeof getStaticProps>;

const IndexPage: NextPage<IndexPageProps> = ({
  allIssues,
  allAvailableYears,
}) => {
  useHydrateAtoms([
    [
      allIssuesAtom,
      allIssues.map((issue: Issue) => ({
        ...issue,
        date: new Date(issue.date),
      })),
    ],
  ]);
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
          <div className="sticky top-0 z-10 flex w-full justify-start bg-stone-50/90 py-4 px-4  backdrop-blur-md  dark:bg-stone-800/80 sm:px-6 md:px-8 lg:px-20">
            <ToolBar allAvailableYears={allAvailableYears} />
          </div>
          <div
            id="issues-container"
            className="relative divide-y divide-stone-200 dark:divide-stone-600 sm:mt-4 lg:mt-8 lg:border-t lg:border-stone-200 dark:lg:border-stone-600"
          >
            {issues.map((issue) => (
              <IssueEntry key={issue.id} issue={issue} />
            ))}
          </div>
        </div>
      </IndexLayout>
    </React.Fragment>
  );
};

export default IndexPage;
