import { IGuest, IGuestList, IStaticProps } from '@/interfaces'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
// import { environment } from '../../config'

// const { apiUrl } = environment

interface Props {
  guests: IGuest
}

export default function Home({ guests }: Props) {
  return (
    <>
      <Head>
        <title>{guests.family}</title>
      </Head>

      <main>{guests.family}</main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { FireStoreAdapter } = await import('@/infra')
  const database = new FireStoreAdapter()

  const guestsList = await database.getCodes()

  //   const response = await fetch(`${apiUrl}/guest-list`)
  //   const guest_list = (await response.json()) as IGuestList
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

  //   const res = await fetch(`${apiUrl}/guests?code=${code}`)
  //   const guests = (await res.json()) as IGuest
  return {
    props: {
      guests,
    },
  }
}
