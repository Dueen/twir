import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import Head from "next/head";
import Link from "next/link";

import { NavigationProvider, useNavigation } from "@/providers";
import ChevronLeft from "@/components/icons/ChevronLeft";
import ChevronRight from "@/components/icons/ChevronRight";
import Logo from "@/components/Logo";

import type { Meta } from "@/types";
type IssueLayoutProps = React.PropsWithChildren<{
  meta: Meta;
}>;

const NavButton = ({ dir }: { dir: "next" | "prev" }) => {
  const { hasPrev, prefetchPrev, goToPrev } = useNavigation();
  const { hasNext, prefetchNext, goToNext } = useNavigation();
  const Icon = dir === "next" ? ChevronRight : ChevronLeft;

  if (dir == "next" && !hasNext) {
    return null;
  }

  if (dir == "prev" && !hasPrev) {
    return null;
  }

  return (
    <li>
      <button
        onClick={() => (dir === "next" ? goToNext() : goToPrev())}
        onPointerEnter={() =>
          dir === "next" ? prefetchNext() : prefetchPrev()
        }
        id={`nav-${dir}`}
      >
        <div
          className="group relative box-border flex justify-center rounded-md border-transparent stroke-orange-500 px-2 py-1.5 text-orange-500 hover:border-orange-400 hover:bg-orange-500 hover:stroke-white"
          title={dir == "next" ? "Next " : "Previous " + "issue"}
        >
          <Icon className="h-6 w-6" />
        </div>
      </button>
    </li>
  );
};

const IssueLayout: React.FC<IssueLayoutProps> = ({ children, meta }) => {
  return (
    <React.Fragment>
      <Head>
        <title>{meta.title}</title>
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
      <div className="flex h-screen w-screen overflow-x-hidden">
        <div className="max-h</meta>-screen flex h-screen w-16 flex-col justify-between border-r bg-stone-200 dark:bg-stone-900">
          <div>
            <div className="inline-block h-16 w-16 items-center justify-center p-2">
              <Link href="/">
                <a>
                  <Logo />
                </a>
              </Link>
            </div>
            <NavigationProvider>
              <nav id="nav" className="flex flex-col p-2">
                <ul className="space-y-1 border-t border-stone-400 pt-4 dark:border-stone-600">
                  <NavButton dir="next" />
                  <NavButton dir="prev" />
                </ul>
              </nav>
            </NavigationProvider>
          </div>
        </div>
        <main
          id="main"
          className="max-h-screen flex-1 overflow-y-auto overflow-x-hidden"
        >
          <AnimatePresence exitBeforeEnter>
            <motion.div
              className="prose prose-sm prose-stone mx-auto max-w-none bg-stone-50 p-10 prose-a:text-orange-500 hover:prose-a:text-orange-500 dark:prose-invert dark:bg-stone-800 dark:prose-a:text-orange-500/80 md:prose-base lg:prose-lg xl:prose-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key={meta.title}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </React.Fragment>
  );
};

export default IssueLayout;
