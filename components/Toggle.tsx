import * as React from "react";
import cx from "classnames";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";

import type { SortValues } from "./SideNav";

const itemClasses = cx(
  "group radix-state-on:bg-stone-100 dark:radix-state-on:bg-stone-700 radix-state-on:border radix-state-on:border-amber-500",
  "w-full rounded-xl py-2.5 text-sm font-medium leading-5 text-amber-500",
  "ring-white ring-opacity-60 ring-offset-1 ring-offset-amber-400 focus:outline-none focus:ring-1"
);

type ToggleProps = React.PropsWithChildren<{
  sortBy: SortValues;
  setSortBy: (value: SortValues) => void;
}>;

const Toggle: React.FC<ToggleProps> = ({ sortBy, setSortBy }) => {
  return (
    <div className="sticky top-0 flex w-56 items-center justify-center bg-transparent px-2 py-3 backdrop-blur-sm dark:bg-stone-800/90">
      <ToggleGroupPrimitive.Root
        type="single"
        value={sortBy}
        aria-label="Text alignment"
        className="flex w-full rounded-xl border border-stone-200 bg-white/90 dark:border-stone-500 dark:bg-stone-800"
      >
        <ToggleGroupPrimitive.Item
          value="newest"
          aria-label="Newest"
          className={itemClasses}
          onClick={() => setSortBy("newest")}
        >
          Newest
        </ToggleGroupPrimitive.Item>
        <ToggleGroupPrimitive.Item
          value="oldest"
          aria-label="Oldest"
          className={itemClasses}
          onClick={() => setSortBy("oldest")}
        >
          Oldest
        </ToggleGroupPrimitive.Item>
      </ToggleGroupPrimitive.Root>
    </div>
  );
};

export default Toggle;
