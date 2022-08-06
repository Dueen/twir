import * as React from "react";
import * as ToolbarPrimitive from "@radix-ui/react-toolbar";
import cx from "classnames";
import { useAtom } from "jotai";
import {
  atomWithStorage,
  createJSONStorage,
  useHydrateAtoms,
} from "jotai/utils";

import { deleteCookie, getCookie, setCookie } from "@/lib/cookies";

import type { OptionsType } from "@/types";
type SortValues = "newest" | "oldest";
type Years = Array<string>;

const YEAR_IN_MILLSECONDS = 365 * 24 * 60 * 60 * 1000;
const cookieStorageOptions: OptionsType = {
  path: "/",
  expires: new Date(Date.now() + 2 * YEAR_IN_MILLSECONDS),
  sameSite: "strict",
  secure: true,
  priority: "high",
};

function createStorage<T>() {
  const storage = createJSONStorage<T>(() => ({
    getItem: (key) => {
      return getCookie(key, cookieStorageOptions)?.toString() || null;
    },
    setItem: (key, newValue) => {
      return setCookie(key, newValue, cookieStorageOptions);
    },
    removeItem: (key) => {
      return deleteCookie(key, cookieStorageOptions);
    },
  }));

  storage.delayInit = true;

  return storage;
}

export const yearsAtom = atomWithStorage<Years>(
  "yearsFilter",
  [],
  createStorage<Years>()
);

export const sortByAtom = atomWithStorage<SortValues>(
  "sortByFilter",
  "newest",
  createStorage<SortValues>()
);

const itemClasses = cx(
  "mx-px inline-block uppercase rounded-sm border border-stone-500/40 bg-stone-50 px-2 text-sm dark:bg-stone-900/50 transition-colors duration-200 motion-reduce:transition-none",
  "radix-state-on:bg-orange-500/60 dark:radix-state-on:bg-orange-500/80",
  "border-stone-500 radix-state-on:border-transparent dark:border-stone-900 dark:radix-state-on:border-transparent",
  "focus:relative focus:outline-none focus-visible:z-20 focus-visible:ring focus-visible:ring-amber-500 focus-visible:ring-opacity-75",
  "hover:radix-state-off:bg-orange-200/80 dark:hover:radix-state-off:bg-orange-400/80"
);

type ToolBarProps = React.PropsWithChildren<{
  allAvailableYears: Years;
}>;

export const ToolBar: React.FC<ToolBarProps> = ({ allAvailableYears }) => {
  useHydrateAtoms([
    [yearsAtom, allAvailableYears],
    [sortByAtom, "newest"],
  ]);

  const [sortBy, setSortBy] = useAtom(sortByAtom);
  const [years, setYears] = useAtom(yearsAtom);

  return (
    <ToolbarPrimitive.Toolbar
      id="toolbar"
      className="flex w-full max-w-4xl flex-col items-center justify-center space-y-2 rounded-md border border-stone-200 bg-stone-100 p-2 text-stone-900 shadow-sm shadow-stone-100 dark:border-stone-600 dark:bg-stone-600 dark:text-stone-50 dark:shadow-stone-900"
    >
      {/* Sort By Filter */}
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
          className="group flex w-full cursor-default flex-wrap space-x-2 rounded-r-md border-l border-stone-300 py-2 pl-3 pr-10 text-left font-semibold shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-stone-500 sm:text-sm"
          defaultValue="newest"
          value={sortBy}
        >
          <ToolbarPrimitive.ToggleItem
            aria-label="Newest"
            className={itemClasses + " before:radix-state-on:content-['↓']"}
            id="sort-by-newest"
            name="sort-by-newest"
            onClick={() => setSortBy("newest")}
            value="newest"
          >
            &nbsp;newest&nbsp;
          </ToolbarPrimitive.ToggleItem>
          <ToolbarPrimitive.ToggleItem
            aria-label="Oldest"
            className={itemClasses + " before:radix-state-on:content-['↑']"}
            id="sort-by-oldest"
            name="sort-by-oldest"
            onClick={() => setSortBy("oldest")}
            value="oldest"
          >
            &nbsp;oldest&nbsp;
          </ToolbarPrimitive.ToggleItem>
        </ToolbarPrimitive.ToggleGroup>
      </div>
      {/* Years Filter */}
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
          defaultValue={allAvailableYears}
          value={years}
          onValueChange={(newYears) => setYears(newYears)}
        >
          {allAvailableYears.map((year) => (
            <ToolbarPrimitive.ToggleItem
              id={`year-${year}`}
              key={year}
              value={year}
              aria-label={year}
              className="inline-block w-[64px] rounded-sm border border-stone-500/40 bg-stone-50 px-1 text-center text-sm font-semibold transition-colors duration-200 radix-state-on:bg-orange-500/60 before:radix-state-on:content-['✓'] hover:radix-state-off:bg-orange-200/80 motion-reduce:transition-none dark:bg-stone-900/50 dark:radix-state-on:bg-orange-500/80 dark:hover:radix-state-off:bg-orange-400/80 md:text-sm"
            >
              <span>&nbsp;{year}&nbsp;</span>
            </ToolbarPrimitive.ToggleItem>
          ))}
        </ToolbarPrimitive.ToggleGroup>
      </div>
    </ToolbarPrimitive.Toolbar>
  );
};
