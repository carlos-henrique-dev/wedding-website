import Head from 'next/head'

import { RoseImage } from '@/components'

export default function NotFoundPage() {
  return (
    <>
      <Head>
        <title>Convite não encontrado</title>
      </Head>

      <main className="not_found">
        <div className="not_found-img-top">
          <RoseImage />
        </div>

        <div className="not_found-img-bottom">
          <RoseImage />
        </div>

        <h1 className="not_found-title">404</h1>

        <p className="not_found-message">
          <span>Hmmm...</span>
          <br />
          <span>Parece que este convite foi extraviado</span>
        </p>
      </main>
    </>
  )
}
