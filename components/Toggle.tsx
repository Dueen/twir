import * as React from "react";
import cx from "classnames";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { useIssues } from "@providers/IssuesProvider";

const itemClasses = cx(
  "group radix-state-on:bg-stone-100 dark:radix-state-on:bg-stone-700 radix-state-on:border radix-state-on:border-amber-500",
  "w-full rounded-xl py-2.5 text-sm font-medium leading-5 text-amber-500",
  "ring-white ring-opacity-60 ring-offset-1 ring-offset-amber-400 focus:outline-none focus:ring-1"
);

const Toggle = () => {
  const { sortBy, setSortBy } = useIssues();

  return (
    <div className="sticky top-0 flex w-56 items-center justify-center bg-transparent px-2 py-3 backdrop-blur-sm dark:bg-stone-800/90">
      <ToggleGroupPrimitive.Root
        type="single"
        value={sortBy}
        aria-label="Text alignment"
        className="flex w-full rounded-xl border border-stone-200 bg-white/90 dark:border-stone-500 dark:bg-stone-800"
        onValueChange={(value) => setSortBy(value as typeof sortBy)}
      >
        <ToggleGroupPrimitive.Item
          value="newest"
          aria-label="Newest"
          className={itemClasses}
        >
          Newest
        </ToggleGroupPrimitive.Item>
        <ToggleGroupPrimitive.Item
          value="oldest"
          aria-label="Oldest"
          className={itemClasses}
        >
          Oldest
        </ToggleGroupPrimitive.Item>
      </ToggleGroupPrimitive.Root>
    </div>
  );
};

export default Toggle;
