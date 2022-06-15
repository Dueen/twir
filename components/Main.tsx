import * as React from "react";

type Props = React.PropsWithChildren<{}>;

const Main: React.FC<Props> = ({ children }) => {
  return (
    <main className="prose col-span-full col-start-3 max-w-none overflow-y-auto text-center">
      {children}
    </main>
  );
};

export default Main;
