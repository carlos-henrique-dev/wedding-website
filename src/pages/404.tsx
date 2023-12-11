import Head from "next/head";

import { RoseImage } from "@/components";

export default function NotFoundPage() {
  return (
    <>
      <Head>
        <title>Convite não encontrado</title>
      </Head>

      <section className="not_found">
        <RoseImage className="rose-top-left" />

        <RoseImage className="rose-middle-right" />

        <h1 className="title">404</h1>

        <p className="message">
          <span>Hmmm...</span>
          <br />
          <span>Parece que este convite foi extraviado</span>
        </p>
      </section>
    </>
  );
}
