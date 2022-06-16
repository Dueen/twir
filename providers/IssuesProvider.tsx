import * as React from "react";

type IssuesProviderProps = React.PropsWithChildren<{ initialIssues: any[] }>;

const IssuesContext = React.createContext<any[]>([]);

const IssuesProvider: React.FC<IssuesProviderProps> = ({
  children,
  initialIssues = [],
}) => {
  const [issues, setIssues] = React.useState(initialIssues);

  React.useEffect(() => {}, [issues]);

  return (
    <IssuesContext.Provider value={issues}>{children}</IssuesContext.Provider>
  );
};

const useIssues = () => {
  const context = React.useContext(IssuesContext);
  if (context === undefined) {
    throw new Error("useIssues must be used within a IssuesProvider");
  }
  return context;
};

export { IssuesContext, IssuesProvider, useIssues };
