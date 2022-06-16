import * as React from "react";

type Props = React.PropsWithChildren<{}>;

const Main: React.FC<Props> = ({ children }) => {
  return (
    <main className="no-scrollbar col-span-full col-start-2 max-h-screen min-h-screen overflow-y-auto xl:col-start-3">
      {children}
    </main>
  );
};

export default Main;
