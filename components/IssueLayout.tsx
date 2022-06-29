import * as React from "react";
import * as ToolbarPrimitive from "@radix-ui/react-toolbar";
import Link from "next/link";
import { useRouter } from "next/router";

import ChevronLeft from "@/components/icons/ChevronLeft";
import ChevronRight from "@/components/icons/ChevronRight";
import Logo from "@/components/Logo";

type IssueLayoutProps = React.PropsWithChildren<{
  isFirst: boolean;
  isLast: boolean;
  title: string;
}>;

const buttonClasses =
  "group-hover:bg-lightorange-400 text-stone-900/80 bg-stone-200 dark:bg-stone-600 font-bold p-2 rounded-full items-center group-hover:text-orange-600 dark:text-stone-900 flex";

const IssueLayout: React.FC<IssueLayoutProps> = ({
  children,
  isFirst,
  isLast,
  title,
}) => {
  const router = useRouter();

  return (
    <React.Fragment>
      <div className="sticky top-0 bg-stone-50/60 p-5 backdrop-blur-lg dark:bg-stone-700/60">
        <ToolbarPrimitive.Root
          aria-label="navigation options"
          className="relative mx-auto flex max-w-6xl items-center justify-between"
        >
          {Boolean(isFirst) === false ? (
            <Link href={`/${Number(router.query.id) - 1}`}>
              <a className="group justify-self-start no-underline transition-colors duration-200 hover:no-underline">
                <ToolbarPrimitive.Button className={buttonClasses}>
                  <ChevronLeft className="order-first h-5 w-5 fill-stone-500 group-hover:fill-orange-600 dark:fill-stone-900 md:h-6 md:w-6" />
                  <span className="mx-2 hidden md:inline-block">
                    Prev
                    <span className="hidden xl:inline-block">
                      ious&nbsp;Issue
                    </span>
                  </span>
                </ToolbarPrimitive.Button>
              </a>
            </Link>
          ) : (
            <div className="h-5 w-5">
              <Logo />
            </div>
          )}
          <h1 className="absolute left-1/2 -translate-x-1/2 font-alfa text-sm font-black text-stone-900 dark:text-stone-100 sm:text-lg md:text-2xl">
            {title}
          </h1>
          {Boolean(isLast) === false ? (
            <Link href={`/${Number(router.query.id) + 1}`}>
              <a className="group justify-self-end no-underline transition-colors duration-200 hover:no-underline">
                <ToolbarPrimitive.Button className={buttonClasses}>
                  <ChevronRight className="order-last h-5 w-5 fill-stone-500 group-hover:fill-orange-600 dark:fill-stone-900 md:h-6 md:w-6" />
                  <span className="mx-2 hidden md:inline-block">
                    Next&nbsp;
                    <span className="hidden xl:inline-block">Issue</span>
                  </span>
                </ToolbarPrimitive.Button>
              </a>
            </Link>
          ) : (
            <div className="h-8 w-8 md:h-10 md:w-10">
              <Logo />
            </div>
          )}
        </ToolbarPrimitive.Root>
      </div>
      <div className="mx-auto max-w-6xl pb-10">{children}</div>
    </React.Fragment>
  );
};

export default IssueLayout;
