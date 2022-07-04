import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import * as ToolbarPrimitive from "@radix-ui/react-toolbar";
import cx from "classnames";
import {
  useSetAtom,
  atom,
  useAtom,
  useAtomValue,
  ExtractAtomValue,
} from "jotai";
import { atomWithStorage, useHydrateAtoms } from "jotai/utils";
import { isSameYear } from "date-fns";

import { getAllIssues } from "@/lib/octokit";
import { Container } from "@/components/Container";
import { IndexLayout } from "@/components/IndexLayout";
import ChevronUp from "@/components/icons/ChevronUp";
import ChevronDown from "@/components/icons/ChevronDown";
import { YearPicker } from "@/components/YearPicker";

// import type { Years } from "@/components/YearPicker";
type SortValues = "newest" | "oldest";
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

const allAvailableYears = [
  "2022",
  "2021",
  "2020",
  "2019",
  "2018",
  "2017",
  "2016",
  "2015",
  "2014",
  "2013",
] as const;

const yearsAtom = atomWithStorage("yearsFilter", allAvailableYears);

const sortByAtom = atomWithStorage<SortValues>("sortByFilter", "newest");
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

const itemClasses = cx(
  "mx-px inline-block uppercase rounded-sm border border-stone-500/40 bg-stone-50 px-2 text-sm dark:bg-stone-900/50 transition-colors duration-200 motion-reduce:transition-none",
  "radix-state-on:bg-orange-500/60 dark:radix-state-on:bg-orange-500/80",
  "border-stone-500 radix-state-on:border-transparent dark:border-stone-900 dark:radix-state-on:border-transparent",
  "focus:relative focus:outline-none focus-visible:z-20 focus-visible:ring focus-visible:ring-amber-500 focus-visible:ring-opacity-75",
  "hover:radix-state-off:bg-orange-200/80 dark:hover:radix-state-off:bg-orange-400/80"
);

const ToolBar = () => {
  const [sortBy, setSortBy] = useAtom(sortByAtom);
  const [years, setYears] = useAtom(yearsAtom);

  const displayYears = React.useMemo(
    () => years.map(Number).sort().reverse().map(String),
    [years]
  );

  return (
    <ToolbarPrimitive.Toolbar className="flex w-full flex-col items-center justify-center space-y-2 rounded-md border border-stone-200 bg-stone-100 p-2 text-stone-900 shadow-sm shadow-stone-100 dark:border-stone-600 dark:bg-stone-600 dark:text-stone-50 dark:shadow-stone-900">
      <div className="flex w-full items-center rounded-md border border-stone-300 bg-white dark:border-stone-500 dark:bg-stone-700">
        <label
          htmlFor="sortByFilter"
          className="block min-w-[96px] px-5 text-center text-sm font-medium text-stone-700 dark:text-stone-100"
        >
          Sort By
        </label>

        <ToolbarPrimitive.ToggleGroup
          id="sortByFilter"
          type="single"
          className="group flex w-full cursor-default flex-wrap space-x-2 rounded-r-md border-l border-stone-300 py-2 pl-3 pr-10 text-left shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-stone-500 sm:text-sm"
          defaultValue="newest"
          value={sortBy}
        >
          <ToolbarPrimitive.ToggleItem
            value="newest"
            aria-label="Newest"
            className={itemClasses + " before:radix-state-on:content-['↓']"}
            name="sortby-newest"
            onClick={() => setSortBy("newest")}
          >
            &nbsp;newest&nbsp;
          </ToolbarPrimitive.ToggleItem>
          <ToolbarPrimitive.ToggleItem
            value="oldest"
            aria-label="Oldest"
            className={itemClasses + " before:radix-state-on:content-['↑']"}
            name="sortby-oldest"
            onClick={() => setSortBy("oldest")}
          >
            &nbsp;oldest&nbsp;
          </ToolbarPrimitive.ToggleItem>
        </ToolbarPrimitive.ToggleGroup>
      </div>

      <ToolbarPrimitive.ToolbarSeparator className="mx-2 w-px bg-stone-300 dark:bg-stone-900" />
      <div className="flex w-full items-center rounded-md border border-stone-300 bg-white dark:border-stone-500 dark:bg-stone-700">
        <label
          htmlFor="yearsFilter"
          className="block min-w-[96px] px-5 text-center text-sm font-medium text-stone-700 dark:text-stone-100"
        >
          Years
        </label>

        <ToolbarPrimitive.ToggleGroup
          id="yearsFilter"
          type="multiple"
          className="group grid w-full grid-cols-[repeat(auto-fit,_minmax(64px,_1fr))] gap-x-1 gap-y-1 rounded-r-md border-l border-stone-300 py-2 pl-3 pr-10 text-left shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-stone-500 sm:text-sm"
          defaultValue={displayYears}
          value={years.map(String)}
          onValueChange={(newYears) => setYears(newYears as unknown as Years)}
        >
          {allAvailableYears.map((year) => (
            <ToolbarPrimitive.ToggleItem
              key={year}
              value={year}
              aria-label={year}
              className="inline-block w-[64px] rounded-sm border border-stone-500/40 bg-stone-50 px-1 text-center text-sm transition-colors duration-200 radix-state-on:bg-orange-500/60 before:radix-state-on:content-['✓'] hover:radix-state-off:bg-orange-200/80 motion-reduce:transition-none dark:bg-stone-900/50 dark:radix-state-on:bg-orange-500/80 dark:hover:radix-state-off:bg-orange-400/80 md:text-sm"
            >
              <span className="">&nbsp;{year}&nbsp;</span>
            </ToolbarPrimitive.ToggleItem>
          ))}
        </ToolbarPrimitive.ToggleGroup>
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
