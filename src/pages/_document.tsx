import { Html, Head, Main, NextScript } from "next/document";

const OG_IMAGE =
  "https://drive.google.com/file/d/1RoG_1XOZj1gdOH5glt58FWQFJcj5cYha/view?usp=share_link";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="shortcut icon" href="/images/flower.ico" />

        {/* <!-- Open Graph / Facebook --> */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://henriquethaysa-wedding.com/" />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:secure_url" content={OG_IMAGE} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="300" />
        <meta property="og:image:height" content="300" />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
