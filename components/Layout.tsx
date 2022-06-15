import * as React from "react";

import Header from "./Header";
import SideNav from "./SideNav";
import Main from "./Main";
import Footer from "./Footer";

type Props = React.PropsWithChildren<{}>;

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="grid grid-flow-row grid-cols-12">
      <Header />
      <SideNav />
      <Main>{children}</Main>
      <Footer />
    </div>
  );
};

export default Layout;
