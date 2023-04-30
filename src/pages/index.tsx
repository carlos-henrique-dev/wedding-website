import { RoseImage } from '@/components'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Henrique e Thaysa&apos;s Wedding</title>
      </Head>

      <main className="home">
        <RoseImage className="home-img-top" />
        <RoseImage className="home-img-bottom" />

        <div className="home-content">
          <h1 className="home-title">
            <span>Henrique</span>
            <span>e</span>
            <span>Thaysa</span>
          </h1>

          <p className="home-subtitle">
            <div className="home-subtitle-main">
              <span>&quot;Grandes coisas fez o Senhor por nós.</span>
              <span>Por isso estamos alegres.&quot;</span>
            </div>

            <span>Salmos 126:3</span>
          </p>

          <p className="home-date">
            <span>15 - 07 - 2023</span>
          </p>
        </div>
      </main>
    </>
  )
}
