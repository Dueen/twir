import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import ChevronLeft from "@/components/icons/ChevronLeft";
import ChevronRight from "@/components/icons/ChevronRight";
import Logo from "@/components/Logo";

import type { Meta } from "@/types";
type IssueLayoutProps = React.PropsWithChildren<{
  meta: Meta;
}>;

const IssueLayout: React.FC<IssueLayoutProps> = ({ children, meta }) => {
  const router = useRouter();

  return (
    <React.Fragment>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content="This Week in Rust" />
        <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
      </Head>
      <div className="flex h-screen w-screen overflow-x-hidden">
        <div className="flex h-screen max-h-screen w-16 flex-col justify-between border-r bg-stone-200 dark:bg-stone-900">
          <div>
            <div className="inline-block h-16 w-16 items-center justify-center p-2">
              <Link href="/">
                <a>
                  <Logo />
                </a>
              </Link>
            </div>
            <div>
              <nav className="flex flex-col p-2">
                <ul className="space-y-1 border-t border-stone-400 pt-4 dark:border-stone-600">
                  {Boolean(meta.hasNext) === false ? (
                    <li>
                      <Link href={`/issue/${Number(router.query.id) - 1}`}>
                        <a
                          className="group relative box-border flex justify-center rounded-md border-transparent stroke-orange-500 px-2 py-1.5 text-orange-500 hover:border-orange-400 hover:bg-orange-500 hover:stroke-white"
                          title="Previous issue"
                        >
                          <ChevronLeft className="h-6 w-6" />
                        </a>
                      </Link>
                    </li>
                  ) : null}
                  {Boolean(meta.hasPrev) === false ? (
                    <li>
                      <Link href={`/issue/${Number(router.query.id) + 1}`}>
                        <a
                          className="group relative box-border flex justify-center rounded-md border border-transparent stroke-orange-500 px-2 py-1.5 text-orange-500 hover:border-orange-400 hover:bg-orange-500 hover:stroke-white"
                          title="Next issue"
                        >
                          <ChevronRight className="h-6 w-6" />
                        </a>
                      </Link>
                    </li>
                  ) : null}
                </ul>
              </nav>
            </div>
          </div>
        </div>
        <div className="max-h-screen flex-1 overflow-y-auto">
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
        </div>
      </div>
    </React.Fragment>
  );
};

export default IssueLayout;
