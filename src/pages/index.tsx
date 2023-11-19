import Head from 'next/head'

const content = {
  title: `Alão vai Casar`,
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
        <section className="content">
          <h1 className="title">
            <span>Alan</span>
            <span> - e - </span>
            <span>Fran</span>
          </h1>
        </section>

        <h1>Em desenvolvimento</h1>
      </main>
    </>
  )
}
