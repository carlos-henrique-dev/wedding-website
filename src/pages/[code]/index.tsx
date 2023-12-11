import { GetStaticPaths, GetStaticProps, GetStaticPropsResult } from "next";
import Head from "next/head";
import { IGuest } from "@/interfaces";
import { useEffect, useState } from "react";
import Home from "./components/Home";
import InviteInfo from "./components/InviteInfo";
import { BouncingArrowDown } from "@/components";
import RSVP from "./components/RSVP";
import MoreInfo from "./components/MoreInfo";

export const getStaticPaths: GetStaticPaths = async () => {
  const { FireStoreAdapter } = await import("@/infra");
  const database = new FireStoreAdapter();

  const guestsList = await database.getCodes();

  const paths = guestsList.map(({ code }) => ({ params: { code } }));
  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({
  params,
}): Promise<GetStaticPropsResult<{ guest: IGuest }>> => {
  const { FireStoreAdapter } = await import("@/infra");
  const database = new FireStoreAdapter();

  const code = params?.code;
  const guest = await database.getOne(code as string);

  if (!guest) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      guest,
    },
    revalidate: 60 * 60, // 1 hour
  };
};

interface Props {
  guest: IGuest;
}

export default function InvitePage({ guest: guestsProps }: Props) {
  const [loading, setLoading] = useState(false);
  const [guests, setGuests] = useState<IGuest>(guestsProps);

  async function markAsSeen() {
    await fetch("/api/mark-as-seen", {
      method: "POST",
      body: JSON.stringify({ code: guests.code }),
    });
  }

  async function getGuestDetails() {
    const url = "/api/guest-details?code=" + guests.code;
    const response = await fetch(url, {
      method: "GET",
    });

    const data: IGuest = await response.json();

    setGuests(data);
  }

  useEffect(() => {
    markAsSeen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <title>{`Convite ${guests.family}`}</title>
        <meta
          name="description"
          content="Vamos casar e sua presença será uma bênção para nós!"
        />
      </Head>

      <main className="w-screen h-screen flex overflow-y-scroll flex-col relative">
        <section className="fixed top-0 w-full h-screen">
          <Home />
        </section>

        <section className="absolute top-0 w-screen h-screen z-10">
          <div className="relative flex w-full h-full items-center justify-center">
            <div className="absolute bottom-5 left-1/2 right-1/2 z-30 transform translate-x-1/2">
              <a href="#informacoes-convite">
                <BouncingArrowDown />
              </a>
            </div>
          </div>
        </section>

        <section
          className="absolute top-full w-full h-screen bg-green-100 shadow-sm"
          id="informacoes-convite"
        >
          <div className="relative w-full h-full">
            <div className="w-full h-full bg-white">
              <InviteInfo guestData={guests} />
            </div>

            <div className="w-full h-full bg-white" id="rsvp">
              <RSVP
                guestData={guests}
                loading={loading}
                refreshData={getGuestDetails}
                toggleLoading={setLoading}
              />
            </div>

            <div className="w-full h-full bg-white" id="mais-informacoes">
              <MoreInfo />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
