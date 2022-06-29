import * as React from "react";
import Image from "next/image";

import logoLight from "@/images/twir-logo-white.png";
import logoDark from "@/images/twir-logo-black.png";

const Logo = () => {
  const [logo, setLogo] = React.useState(logoLight);

  React.useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");

    if (mql.matches) {
      setLogo(logoDark);
    }

    mql.onchange = (e: MediaQueryListEvent) =>
      e.matches ? setLogo(logoDark) : setLogo(logoLight);
  }, []);

  return (
    <Image
      src={logo}
      alt="logo"
      layout="responsive"
      sizes="(min-width: 1024px) 18rem, (min-width: 640px) 14rem, 10rem"
      loading="lazy"
      placeholder="blur"
    />
  );
};

export default Logo;
