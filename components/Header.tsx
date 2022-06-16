import * as React from "react";
import GitHubButton from "react-github-btn";

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
        <div className="flex items-center justify-center space-x-2 pt-3">
          {/* TODO: Pay respects to the Original Github (OG) */}
          {/* <GitHubButton
            href="https://github.com/rust-lang/this-week-in-rust"
            data-color-scheme="no-preference: light; light: light; dark: dark_dimmed;"
            data-icon="octicon-star"
            data-size="large"
            data-show-count="true"
            aria-label="Star rust-lang/this-week-in-rust on GitHub"
          >
            Star on Github
          </GitHubButton> */}
          <GitHubButton
            href="https://github.com/dueen/twir.io"
            data-color-scheme="no-preference: light; light: light; dark: dark_dimmed;"
            data-icon="octicon-star"
            data-size="large"
            data-show-count="true"
            aria-label="Star twir.io on GitHub"
          >
            Star on Github
          </GitHubButton>
        </div>
      </div>
    </header>
  );
};

export default Header;
