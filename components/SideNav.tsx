import * as React from "react";
import { useRouter } from "next/router";
import { format } from "date-fns";

import IssueCard from "./IssueCard";
import Toggle from "./Toggle";
import { useIssues } from "@providers/IssuesProvider";

const SideNav = () => {
  const { issues } = useIssues();
  const router = useRouter();
  const [currentIssue, setCurrentIssue] = React.useState("");

  React.useEffect(() => {
    if (router.query.id) {
      setCurrentIssue(String(router.query.id));
    }
  }, [router.query.id]);

  return (
    <nav className="no-scrollbar relative order-first h-full max-h-screen w-full overflow-y-auto overflow-x-hidden border-r border-stone-200 dark:border-stone-600 sm:w-56">
      <ClientOnly>
        <Toggle />
        <ul className="mt-4 flex h-full flex-col">
          {issues.map((issue: any) => (
            <IssueCard
              key={issue.name}
              title={issue.title}
              description={format(new Date(issue.date), "MMM dd, yyyy")}
              id={issue.id}
              active={issue.id === currentIssue}
            />
          ))}
        </ul>
      </ClientOnly>
    </nav>
  );
};

// https://jotai.org/docs/utils/atom-with-storage#server-side-rendering
const ClientOnly: React.FC<React.PropsWithChildren> = ({
  children,
  ...delegated
}: any) => {
  const [hasMounted, setHasMounted] = React.useState(false);
  React.useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }
  return <React.Fragment {...delegated}>{children}</React.Fragment>;
};

export default SideNav;
