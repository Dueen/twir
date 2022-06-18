import Layout from "@components/Layout";
import { IssuesProvider } from "@providers/IssuesProvider";
import "../styles/globals.css";

import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <IssuesProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </IssuesProvider>
  );
}

export default MyApp;
