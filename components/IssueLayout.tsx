import * as React from "react";
import * as ToolbarPrimitive from "@radix-ui/react-toolbar";
import Link from "next/link";
import { useRouter } from "next/router";

import ChevronLeft from "@components/icons/ChevronLeft";
import ChevronRight from "@components/icons/ChevronRight";

type IssueLayoutProps = React.PropsWithChildren<{
  isFirst: boolean;
  isLast: boolean;
}>;

const buttonClasses =
  "group-hover:bg-lightorange-400 text-stone-900/80 space-x-2 justify-between bg-stone-200 dark:bg-stone-600 font-bold p-2 rounded-full items-center group-hover:text-orange-600 dark:text-stone-900 flex";

const IssueLayout: React.FC<IssueLayoutProps> = ({
  children,
  isFirst,
  isLast,
}) => {
  const router = useRouter();
  return (
    <React.Fragment>
      <div className="sticky top-0 lg:max-w-4xl">
        <ToolbarPrimitive.Root
          aria-label="navigation options"
          className="mx-auto flex justify-between bg-stone-50/60 p-5 backdrop-blur-lg dark:bg-stone-800/60"
        >
          {Boolean(isFirst) === false ? (
            <Link href={`/${Number(router.query.id) - 1}`}>
              <a className="group no-underline transition-colors duration-200 hover:no-underline">
                <ToolbarPrimitive.Button className={buttonClasses}>
                  <ChevronLeft className="order-first h-4 w-4 fill-stone-500 group-hover:fill-orange-600 dark:fill-stone-900 md:h-6 md:w-6" />
                  <span>Previous Issue</span>
                </ToolbarPrimitive.Button>
              </a>
            </Link>
          ) : null}
          {Boolean(isLast) === false ? (
            <Link href={`/${Number(router.query.id) + 1}`}>
              <a className="group no-underline transition-colors duration-200 hover:no-underline">
                <ToolbarPrimitive.Button className={buttonClasses}>
                  <span>Next Issue</span>
                  <ChevronRight className="order-last h-4 w-4 fill-stone-500 group-hover:fill-orange-600 dark:fill-stone-900 md:h-6 md:w-6" />
                </ToolbarPrimitive.Button>
              </a>
            </Link>
          ) : null}
        </ToolbarPrimitive.Root>
      </div>
      {children}
    </React.Fragment>
  );
};

export default IssueLayout;
