import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import * as ToolbarPrimitive from "@radix-ui/react-toolbar";
import cx from "classnames";
import { useSetAtom, atom, useAtom, useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils";

import { getAllIssues } from "@/lib/octokit";
import { Container } from "@/components/Container";
import ChevronUp from "@/components/icons/ChevronUp";
import ChevronDown from "@/components/icons/ChevronDown";

type SortValues = "newest" | "oldest";
type Issues = Awaited<ReturnType<typeof getAllIssues>>;
type Issue = Pick<Issues[number], "date" | "id" | "title">;

// prettier-ignore
const sortByNewest = (a: Issue, b: Issue) => new Date(b.date).getTime() - new Date(a.date).getTime();
// prettier-ignore
const sortByOldest = (a: Issue, b: Issue) => new Date(a.date).getTime() - new Date(b.date).getTime();

const sortByAtom = atomWithStorage<SortValues>("sortBy", "newest");
const allIssuesAtom = atom<Issues>([]);
const issuesAtom = atom<Array<any>>((get) => {
  const issues = get(allIssuesAtom);
  return issues.sort(
    get(sortByAtom) === "newest" ? sortByNewest : sortByOldest
  );
});

export default function Home({ allIssues }: { allIssues: Array<any> }) {
  const setAllIssues = useSetAtom(allIssuesAtom);
  setAllIssues(allIssues);

  const sortBy = useAtomValue(sortByAtom);
  React.useEffect(() => {}, [sortBy]);

  const issues = useAtomValue(issuesAtom);

  return (
    <>
      <Head>
        <title>TWIR</title>
        <meta
          name="description"
          content="An unofficial alternative This Week In Rust interface."
        />
      </Head>
      {/* <Provider initialValues={[]}> */}
      <div className="pt-16 pb-12 sm:pb-4 lg:pt-12">
        <Container>
          <h1 className="mb-2 text-2xl font-bold leading-7 text-stone-900 dark:text-stone-50">
            Issues
          </h1>
          <ToolBar />
        </Container>
        <div className="relative divide-y divide-stone-200 dark:divide-stone-600 sm:mt-4 lg:mt-8 lg:border-t lg:border-stone-200 dark:lg:border-stone-600">
          {issues.map((issue: any) => (
            <IssueEntry key={issue.id} issue={issue} />
          ))}
        </div>
      </div>
      {/* </Provider> */}
    </>
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
  "radix-state-on:bg-lightorange-400/70 dark:radix-state-on:bg-lightorange-600/70 flex items-center justify-center",
  "inline-flex items-center justify-center bg-stone-200 dark:bg-stone-600",
  "border-y p-2 first:rounded-l-md first:border-x last:rounded-r-md last:border-x",
  "border-stone-900 radix-state-on:border-transparent dark:border-stone-800 dark:radix-state-on:border-transparent",
  "focus:relative focus:outline-none focus-visible:z-20 focus-visible:ring focus-visible:ring-amber-500 focus-visible:ring-opacity-75"
);

const ToolBar = () => {
  const [sortBy, setSortBy] = useAtom(sortByAtom);

  return (
    <ToolbarPrimitive.Toolbar className="flex w-full rounded-md border border-stone-200 bg-stone-100 p-2 text-stone-900 shadow-sm shadow-stone-100 dark:border-stone-600 dark:bg-stone-600 dark:text-stone-50 dark:shadow-stone-900">
      <ToolbarPrimitive.ToggleGroup
        type="single"
        className="flex"
        defaultValue="newest"
        value={sortBy}
      >
        <ToolbarPrimitive.ToggleItem
          value="newest"
          aria-label="Newest"
          className={itemClasses}
          onClick={() => setSortBy("newest")}
        >
          <ChevronDown className="h-4 w-4 text-stone-900" />
        </ToolbarPrimitive.ToggleItem>
        <ToolbarPrimitive.ToggleItem
          value="oldest"
          aria-label="Oldest"
          className={itemClasses}
          onClick={() => setSortBy("oldest")}
        >
          <ChevronUp className="h-4 w-4 text-stone-900" />
        </ToolbarPrimitive.ToggleItem>
      </ToolbarPrimitive.ToggleGroup>
      <ToolbarPrimitive.ToolbarSeparator className="mx-2 w-px bg-stone-300 dark:bg-stone-900" />
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
