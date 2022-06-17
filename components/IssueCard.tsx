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
            ? "bg-amber-500 text-black hover:bg-amber-600"
            : "bg-stone-200 hover:bg-amber-500/40 hover:text-amber-600 dark:bg-stone-700  dark:text-white dark:hover:text-amber-600",
          "m-2 rounded-md p-2",
          "shadow-stone-500 transition duration-200",
          "hover:no-underline hover:shadow-sm"
        )}
      >
        <button className="flex max-w-sm flex-wrap items-center text-left">
          <div className="w-full">
            <h3 className="font-heading text-md mb-2 font-medium md:text-lg lg:text-xl ">
              {title}
            </h3>
            <p>{description}</p>
          </div>
        </button>
      </a>
    </Link>
  );
};

export default IssueCard;
