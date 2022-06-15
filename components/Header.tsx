import * as React from "react";

import Github from "@components/icons/Github";

const Header = () => {
  return (
    <header className="col-span-full border-b border-stone-100 bg-stone-50 py-8 px-4 dark:border-stone-600 dark:bg-stone-800 lg:px-10">
      <div className="relative flex items-center justify-between">
        <h2 className="flex flex-col text-lg font-bold text-black dark:text-white md:text-2xl">
          TWIR &#40; This Week In Rust &#41;
          <span className="text-sm text-stone-500">
            An unofficial alternative&nbsp;
            <a href="https://this-week-in-rust.org/">This Week In Rust </a>
            &nbsp;interface.
          </span>
        </h2>
        <a href="https://www.github.com/dueen/twir.io">
          <Github className="h-8 w-8 fill-current text-black dark:text-white" />
        </a>
      </div>
    </header>
  );
};

export default Header;
