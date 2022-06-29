import * as React from "react";
import Link from "next/link";

import Logo from "@/components/Logo";

export default function Error404Page() {
  return (
    <div className="flex h-screen w-screen items-center justify-center py-6 sm:py-8 lg:py-12">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <div className="flex flex-col items-center">
          <Link href="/">
            <a
              className="text-black-800 mb-8 inline-flex flex-col items-center gap-2.5 text-2xl font-bold md:text-3xl"
              aria-label="logo"
            >
              <div className="h-20 w-20">
                <Logo />
              </div>
              TWIR
            </a>
          </Link>
          <h1 className="mb-2 text-center text-2xl font-bold text-stone-800 dark:text-stone-100 md:text-3xl">
            Page not found
          </h1>

          <p className="mb-12 max-w-screen-md text-center text-stone-500 md:text-lg">
            The page you're looking for doesn't exist.
          </p>
          <Link href="/">
            <a
              href="#"
              className="inline-block rounded-lg bg-stone-200 px-8 py-3 text-center text-sm font-semibold text-stone-500 outline-none ring-orange-300 transition duration-100 hover:bg-stone-300 focus-visible:ring active:text-stone-700 md:text-base"
            >
              Go home
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
