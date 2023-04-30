import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="shortcut icon" href="/images/flower.ico" />

        {/* <!-- Open Graph / Facebook --> */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://henriquethaysa-wedding.com/" />
        <meta property="og:image" content="https://drive.google.com/file/d/1fxpTu0pw0nTGX_5tsQkIOOja8evBKHcW/view?usp=share_link" />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
