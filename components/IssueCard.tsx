import * as React from "react";
import Link from "next/link";
import cx from "classnames";

type IssueCardProps = React.PropsWithChildren<{
  title: string;
  description: string;
  id: string;
  active?: boolean;
}>;

const IssueCard: React.FC<IssueCardProps> = ({
  title,
  description,
  id,
  active,
}) => {
  return (
    <Link key={id} href={`/issue/${id}`}>
      <a
        className={cx(
          active
            ? "bg-amber-500 text-black"
            : "bg-stone-200 text-stone-900/80 hover:bg-amber-500/40 hover:text-amber-600 dark:bg-stone-700  dark:text-white dark:hover:text-black/80",
          "m-2 rounded-md p-2",
          "shadow-stone-500 transition duration-200",
          "hover:no-underline hover:shadow-sm"
        )}
      >
        <div className="flex max-w-sm flex-wrap items-center text-left">
          <div className="w-full">
            <h3 className="font-heading md:text-md mb-2 text-base font-medium lg:text-lg">
              {title}
            </h3>
            <pre className="text-xs">{description}</pre>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default IssueCard;
