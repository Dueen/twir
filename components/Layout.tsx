import * as React from "react";

import Header from "./Header";
import SideNav from "./SideNav";
import Main from "./Main";
import Footer from "./Footer";

type LayoutProps = React.PropsWithChildren<{}>;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex min-h-screen flex-1 flex-row overflow-y-hidden">
        <Main>{children}</Main>
        <SideNav />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
