import * as React from "react";
import Link from "next/link";
import ArrowUp from "@components/icons/ArrowUp";

const links = [
  {
    href: "https://www.this-week-in-rust.org",
    label: "This Week In Rust",
  },
  {
    href: "https://www.github.com/dueen/twir.io",
    label: "This project on Github",
  },
  {
    href: "https://www.github.com/rust-lang/this-week-in-rust",
    label: "This Week In Rust on GitHub",
  },
];

const Footer = () => {
  return (
    <footer className="border-t border-stone-200 p-4 text-black dark:border-stone-600 dark:text-white">
      <div className="mx-auto lg:container">
        <div className="flex flex-col items-start justify-start lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-2 px-4 lg:mb-0">
            <Link href="/">
              <a className="text-2xl leading-none">TWIR.IO</a>
            </Link>
          </div>
          <div className="flex items-center px-4 lg:justify-end">
            <ul className="inline-flex w-full lg:mb-0 lg:w-auto">
              {links.map(({ href, label }) => (
                <li key={href} className="mr-6 mb-2 md:mb-0">
                  <a className="flex text-sm" href={href}>
                    {label}
                    <ArrowUp className="ml-2 h-4 w-4 fill-amber-500" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
