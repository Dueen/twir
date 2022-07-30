import * as React from "react";
import Link from "next/link";
import Head from "next/head";

import ArrowUp from "@/components/icons/ArrowUp";
import Logo from "@/components/Logo";

const links = [
  {
    href: "https://this-week-in-rust.org",
    label: "This Week In Rust",
  },
  {
    href: "https://github.com/dueen/twir",
    label: "This project on Github",
  },
  {
    href: "https://github.com/rust-lang/this-week-in-rust",
    label: "This Week In Rust on GitHub",
  },
];

export const IndexLayout: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  return (
    <React.Fragment>
      <Head>
        <title>TWIR.US</title>
        <meta
          name="description"
          content="An unofficial, alternative This Week in Rust interface"
        />
        <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#f46623" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-TileImage" content="/mstile-144x144.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <nav className="text-stone-700 dark:text-stone-50 lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-112 lg:items-start lg:overflow-y-auto xl:w-120">
        <div className="relative z-10 mx-auto px-4 pb-4 pt-10 sm:px-6 md:max-w-2xl md:px-4 lg:min-h-full lg:flex-auto lg:border-r lg:border-stone-200 lg:py-12 lg:px-8 dark:lg:border-stone-600 xl:px-12">
          <Link href="/">
            <a
              className="relative mx-auto block w-48 overflow-hidden shadow-xl shadow-stone-200 dark:shadow-stone-800 sm:w-48 lg:mx-0 lg:w-60"
              aria-label="Homepage"
            >
              <Logo />
              <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-black/10 sm:rounded-xl lg:rounded-2xl" />
            </a>
          </Link>
          <div className="mt-10 text-center lg:mt-12 lg:text-left">
            <h1 className="text-xl font-bold">TWIR</h1>
            <p className="mt-3 text-lg font-medium leading-8">
              An unofficial, alternative&nbsp;
              <a href="https://this-week-in-rust.org/">This Week In Rust </a>
              &nbsp;interface.
            </p>
          </div>
          <section className="mt-10 lg:mt-12">
            <h2 className="sr-only flex items-center font-mono text-sm font-medium leading-7 lg:not-sr-only">
              🔗
              <span className="ml-2.5">Links</span>
            </h2>
            <div className="dark:from-ston-600 h-px bg-gradient-to-r from-stone-200 to-stone-200/0 dark:to-stone-600/0 sm:from-stone-200/0 sm:via-stone-200 dark:sm:from-stone-600/0 dark:sm:via-stone-600 lg:hidden" />
            <ul className="mt-4 flex flex-col items-start justify-center space-y-2 text-xs font-medium leading-7 sm:flex-row sm:space-y-0 sm:space-x-4 sm:text-sm lg:block lg:space-x-0 lg:space-y-4">
              {links.map(({ href, label }) => (
                <li key={href} className="">
                  <a className="flex items-center" href={href}>
                    {label}
                    <ArrowUp className="ml-2 h-3 w-3 fill-orange-500 sm:h-4 sm:w-4" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </nav>
      <main className="border-t border-stone-200 dark:border-stone-600 lg:relative lg:ml-112 lg:mb-28 lg:border-t-0 xl:ml-120">
        <div className="relative">{children}</div>
      </main>
    </React.Fragment>
  );
};
