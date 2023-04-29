import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="shortcut icon" href="/images/flower.ico" />
        <meta name="description" content="A Next.js starter styled with Tailwind CSS." />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
