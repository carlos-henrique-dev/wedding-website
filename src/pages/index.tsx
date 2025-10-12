import { RoseImage } from '@/components'
import Head from 'next/head'

const content = {
  title: `Casamento de Márcia & Maicon`,
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
        <RoseImage className="rose-top-left" />

        <section className="content">
          <h1 className="title">
            <span>Márcia</span>
            <span className="and-sign">&</span>
            <span>Maicon</span>
          </h1>

          <section className="subtitle">
            <div className="sentence">
              <span>&quot;Assim, permanecem agora estes três: a fé, a esperança e o amor.</span>
              <br />
              <span>O maior deles porém é o amor.&quot;</span>
            </div>

            <span>Coríntios 13:13</span>
          </section>

          <section className="date">
            <span>29 - 11 - 2025</span>
          </section>
        </section>

        <RoseImage className="rose-middle-right" />
      </main>
    </>
  )
}
