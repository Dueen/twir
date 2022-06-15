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
        <Head />
        <body className="no-scrollbar">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
