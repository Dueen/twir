import * as React from "react";
import { useRouter } from "next/router";

import meta from "@/content/meta.json";

type Navigator = {
  hasNext: boolean;
  prefetchNext: () => void;
  goToNext: () => void;
  hasPrev: boolean;
  prefetchPrev: () => void;
  goToPrev: () => void;
};

const issues = Object.entries(meta).reduce(
  (acc, [key, value]) => [...acc, value.id],
  [] as string[]
);

const noop = () => {};

const NavigationContext = React.createContext<Navigator | null>(null);

export const NavigationProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter();

  const navigator: Navigator = React.useMemo(() => {
    // TODO: validate router path
    const idx = issues.indexOf(router.asPath.split("/").pop() ?? "");
    const hasNext = idx + 1 < issues.length;
    const hasPrev = idx > 0 && idx < issues.length;
    return {
      hasNext,
      prefetchNext: hasNext
        ? () => router.prefetch(`/${issues[idx + 1]}`)
        : noop,
      goToNext() {
        if (hasNext) {
          router.push(`/${issues[idx + 1]}`);
        }
      },
      hasPrev,
      prefetchPrev: hasPrev
        ? () => router.prefetch(`/${issues[idx - 1]}`)
        : noop,
      goToPrev() {
        if (hasPrev) {
          router.push(`/${issues[idx - 1]}`);
        }
      },
    };
  }, [router.asPath]);

  return (
    <NavigationContext.Provider value={navigator}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = React.useContext(NavigationContext);
  if (context === null) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};

export default NavigationProvider;
