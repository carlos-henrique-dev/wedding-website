import { RoseImage } from "@/components";
import Head from "next/head";
import Image from "next/image";

const content = {
  title: `Casamento Alan e Francislaine`,
  subtitle:
    "Vamos casar! E você está convidado para testemunhar nossa união. Clique para saber mais.",
};

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

      <main className="flex w-screen h-screen justify-center items-center relative overflow-hidden">
        <section className='max-w-lg relative w-full h-full'>
          <RoseImage className="absolute -top-[10%] -left-[40%]" />

          <h1 className="font-callem-script text-5xl text-center flex flex-col text-primary absolute left-10 bottom-1/4">
            <span>Alan</span>
            <span>e</span>
            <span>Francislaine</span>
          </h1>

          <Image
            src="/images/bride_and_groom.png"
            alt="background-rose"
            width="860"
            height="910"
            className="absolute -bottom-[15%] -right-10 w-4/5"
          />
        </section>
      </main>
    </>
  );
}
