import * as React from "react";
import Link from "next/link";
import cx from "classnames";

type IssueCardProps = React.PropsWithChildren<{
  title: string;
  description: string;
  id: string;
}>;

const IssueCard: React.FC<IssueCardProps> = ({ title, description, id }) => {
  return (
    <Link key={id} href={`/issue/${id}`}>
      <a
        className={cx(
          "m-2 rounded-md bg-stone-200 p-2",
          "text-black shadow-stone-500 transition duration-200",
          "hover:bg-slate-300 hover:text-amber-500/90 hover:no-underline hover:shadow-sm",
          "dark:bg-stone-700 dark:text-white dark:hover:bg-stone-600"
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
