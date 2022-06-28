import * as React from "react";

import Header from "./Header";
import SideNav from "./SideNav";
import Main from "./Main";
import Footer from "./Footer";

import { getAllIssues } from "@/lib/octokit";

type LayoutProps = React.PropsWithChildren<{
  allIssues: Awaited<ReturnType<typeof getAllIssues>>;
}>;

const Layout: React.FC<LayoutProps> = ({ children, allIssues }) => {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex min-h-screen flex-1 flex-row overflow-y-hidden">
        <Main>{children}</Main>
        <SideNav allIssues={allIssues} />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
