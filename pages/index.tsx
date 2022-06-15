import * as React from "react";
import Head from "next/head";

import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <React.Fragment>
      <Head>
        <title>TWIR</title>
        <meta
          name="description"
          content="An unofficial alternative This Week In Rust interface."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-screen min-h-[100px] w-full"></div>
    </React.Fragment>
  );
};

export default Home;
