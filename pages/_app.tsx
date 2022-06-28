import "@/styles/globals.css";
import { IndexLayout } from "@/components/IndexLayout";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <IndexLayout>
      <Component {...pageProps} />
    </IndexLayout>
  );
}
