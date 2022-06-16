import * as React from "react";

import GithubIcon from "@components/icons/Github";

const Header = () => {
  return (
    <header className="col-span-full border-b border-stone-200 py-8 px-4 dark:border-stone-600 lg:px-10">
      <div className="relative flex items-center justify-between">
        <h2 className="flex flex-col text-lg font-bold text-black dark:text-white md:text-2xl">
          TWIR.IO
          <span className="text-sm text-stone-500">
            An unofficial alternative&nbsp;
            <a href="https://this-week-in-rust.org/">This Week In Rust </a>
            &nbsp;interface.
          </span>
        </h2>
        <a href="https://www.github.com/dueen/twir.io">
          <GithubIcon className="h-8 w-8 fill-current text-black dark:text-white" />
        </a>
      </div>
    </header>
  );
};

export default Header;
