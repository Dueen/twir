import Document, { Html, Head, Main, NextScript } from "next/document";

import type { DocumentContext } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin=""
          />
          <link
            href={
              "https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap"
            }
            rel="stylesheet"
          />
        </Head>
        <body className="bg-stone-50 dark:bg-stone-800">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
