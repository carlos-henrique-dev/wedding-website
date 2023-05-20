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
        <RoseImage className="rose-top-left" />

        <section className="content">
          <h1 className="title">
            <span>Henrique</span>
            <span>e</span>
            <span>Thaysa</span>
          </h1>

          <section className="subtitle">
            <div className="sentence">
              <span>&quot;Grandes coisas fez o Senhor por nós.</span>
              <span>Por isso estamos alegres.&quot;</span>
            </div>

            <span>Salmos 126:3</span>
          </section>

          <section className="date">
            <span>15 - 07 - 2023</span>
          </section>
        </section>

        <RoseImage className="rose-middle-right" />
      </main>
    </>
  )
}
