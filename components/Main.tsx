import * as React from "react";

type MainProps = React.PropsWithChildren<{}>;

const Main: React.FC<MainProps> = ({ children }) => {
  return (
    <main className="no-scrollbar max-h-screen min-h-[900px] flex-1 overflow-y-auto">
      {children}
    </main>
  );
};

export default Main;
