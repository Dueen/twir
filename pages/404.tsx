import * as React from "react";
import Link from "next/link";

import Logo from "@/components/Logo";

const Error404 = () => (
  <React.Fragment>
    <div className="h-screen w-screen bg-gradient-to-bl from-white via-stone-100 to-orange-300">
      <div className="prose flex h-screen max-w-none flex-col items-center justify-center space-y-20">
        <div className="h-40 w-40">
          <Link href="/">
            <a>
              <Logo />
            </a>
          </Link>
        </div>
        <h1>Not Found</h1>
        <Link href="/">
          <a className="flex h-20 w-36 items-center justify-center rounded-md bg-orange-500 px-10 text-xl uppercase text-stone-50 no-underline shadow-md shadow-orange-300 lg:w-96">
            Go to Home
          </a>
        </Link>
      </div>
    </div>
  </React.Fragment>
);

export default Error404;
