import { RoseImage } from '@/components'
import Head from 'next/head'

const content = {
  title: `Henrique e Thaysa\'s Wedding`,
  subtitle: 'Vamos casar! E você está convidado para testemunhar nossa união. Clique para saber mais.',
}

export default function Home() {
  return (
    <>
      <Head>
        <title>{content.title}</title>
        <meta name="description" content={content.subtitle} />

        {/* <!-- Open Graph / Facebook --> */}
        <meta property="og:title" content={content.title} />
        <meta property="og:description" content={content.subtitle} />
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
            <span className="home-subtitle-main">
              <span>&quot;Grandes coisas fez o Senhor por nós.</span>
              <span>Por isso estamos alegres.&quot;</span>
            </span>

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
