import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import * as ToolbarPrimitive from "@radix-ui/react-toolbar";
import cx from "classnames";
import { useSetAtom, atom, useAtom, useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { isSameYear } from "date-fns";

import { getAllIssues } from "@/lib/octokit";
import { Container } from "@/components/Container";
import { IndexLayout } from "@/components/IndexLayout";
import ChevronUp from "@/components/icons/ChevronUp";
import ChevronDown from "@/components/icons/ChevronDown";
import { YearPicker, yearsAtom } from "@/components/YearPicker";

import type { Years } from "@/components/YearPicker";
type SortValues = "newest" | "oldest";
type Issues = Awaited<ReturnType<typeof getAllIssues>>;
type Issue = Pick<Issues[number], "date" | "id" | "title">;

// prettier-ignore
const sortByNewest = (a: Issue, b: Issue) => new Date(b.date).getTime() - new Date(a.date).getTime();
// prettier-ignore
const sortByOldest = (a: Issue, b: Issue) => new Date(a.date).getTime() - new Date(b.date).getTime();

const filterYears = (issue: Issue, years: Years) =>
  years.some((year) =>
    isSameYear(new Date(Number(year), 0, 1), new Date(issue.date))
  );

const sortByAtom = atomWithStorage<SortValues>("sortBy", "newest");
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

export default function Home({ allIssues }: { allIssues: Array<any> }) {
  const setAllIssues = useSetAtom(allIssuesAtom);
  setAllIssues(allIssues);

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

const itemClasses = cx(
  "radix-state-on:bg-orange-500/80 radix-state-on:text-stone-900 flex items-center justify-center",
  "inline-flex items-center justify-center bg-stone-200 dark:bg-stone-600 text-stone-400 dark:text-stone-800 transition-colors duration-200",
  "border-y p-2 first:rounded-l-md first:border-x last:rounded-r-md last:border-x",
  "border-stone-500 dark:border-stone-900 radix-state-on:border-transparent dark:border-stone-800 dark:radix-state-on:border-transparent",
  "focus:relative focus:outline-none focus-visible:z-20 focus-visible:ring focus-visible:ring-amber-500 focus-visible:ring-opacity-75",
  "hover:radix-state-off:text-stone-600 hover:radix-state-off:bg-orange-400/80"
);

const ToolBar = () => {
  const [sortBy, setSortBy] = useAtom(sortByAtom);

  return (
    <ToolbarPrimitive.Toolbar className="flex w-full rounded-md border border-stone-200 bg-stone-100 p-2 text-stone-900 shadow-sm shadow-stone-100 dark:border-stone-600 dark:bg-stone-600 dark:text-stone-50 dark:shadow-stone-900">
      <ToolbarPrimitive.ToggleGroup
        type="single"
        className="group flex"
        defaultValue="newest"
        value={sortBy}
      >
        <ToolbarPrimitive.ToggleItem
          value="newest"
          aria-label="Newest"
          className={itemClasses}
          name="sortby-newest"
          onClick={() => setSortBy("newest")}
        >
          <ChevronDown className="h-4 w-4 fill-current" />
        </ToolbarPrimitive.ToggleItem>
        <ToolbarPrimitive.ToggleItem
          value="oldest"
          aria-label="Oldest"
          className={itemClasses}
          name="sortby-oldest"
          onClick={() => setSortBy("oldest")}
        >
          <ChevronUp className="h-4 w-4 fill-current" />
        </ToolbarPrimitive.ToggleItem>
      </ToolbarPrimitive.ToggleGroup>
      <ToolbarPrimitive.ToolbarSeparator className="mx-2 w-px bg-stone-300 dark:bg-stone-900" />
      <div className="flex justify-center px-2">
        <YearPicker />
      </div>
    </ToolbarPrimitive.Toolbar>
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
