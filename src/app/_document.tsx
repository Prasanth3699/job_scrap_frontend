import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta
            name="description"
            content="AI-powered job matching platform for freshers"
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          {/* Add other meta tags and preload critical resources */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
