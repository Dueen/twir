import * as React from "react";
import * as ToolbarPrimitive from "@radix-ui/react-toolbar";
import Link from "next/link";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import parseHTML from "html-react-parser";
import { MDXProvider } from "@mdx-js/react";
import Image from "next/image";

import ChevronLeft from "@/components/icons/ChevronLeft";
import ChevronRight from "@/components/icons/ChevronRight";
import Logo from "@/components/Logo";

type Meta = {
  title: string;
  isFirst: boolean;
  isLast: boolean;
};
type IssueLayoutProps = React.PropsWithChildren<{
  meta: Meta;
}>;

const buttonClasses =
  "group-hover:bg-lightorange-400 text-stone-900/80 bg-stone-200 dark:bg-stone-600 font-bold p-2 rounded-full items-center group-hover:text-orange-600 dark:text-stone-900 flex";

const ResponsiveImage = (props: any) => (
  <Image alt={props.alt} layout="responsive" {...props} />
);

const components = {
  img: ResponsiveImage,
  a: (props: any) => (
    <Link href={props.href}>
      <a className="text-stone-900 dark:text-stone-50">{props.children}</a>
    </Link>
  ),
};

const IssueLayout: React.FC<IssueLayoutProps> = ({ children, meta }) => {
  const router = useRouter();

  return (
    <MDXProvider components={components}>
      <div className="flex">
        <div className="flex h-screen w-16 flex-col justify-between border-r bg-stone-200 dark:bg-stone-900">
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
                <ul className="space-y-1 border-t border-gray pt-4">
                  {Boolean(meta.isFirst) === false ? (
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
                  {Boolean(meta.isLast) === false ? (
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
              // key={meta.title || ""}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </MDXProvider>
  );
};

export default IssueLayout;
