import { IGuest, IStaticProps } from '@/interfaces'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { useMemo } from 'react'

interface Props {
  guests: IGuest
}

export default function Invite({ guests }: Props) {
  const invite = useMemo(() => {
    const isPlural = guests.members.length > 1

    return `Hey, ${guests.family} nós vamos casar! E gostaríamos que venha fazer parte deste maravilhoso momento em nossas vidas!`
  }, [guests.family, guests.members])

  return (
    <>
      <Head>
        <title>{`Convite ${guests.family}`}</title>
        <meta name="description" content={invite} />
      </Head>

      <main>{guests.family}</main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { FireStoreAdapter } = await import('@/infra')
  const database = new FireStoreAdapter()

  const guestsList = await database.getCodes()

  const paths = guestsList.map(({ code }) => ({ params: { code } }))
  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }): IStaticProps<{ guests: IGuest }> => {
  const { FireStoreAdapter } = await import('@/infra')
  const database = new FireStoreAdapter()

  const code = params?.code
  const guests = await database.getOne(code as string)

  return {
    props: {
      guests,
    },
  }
}
