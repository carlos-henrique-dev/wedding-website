import { IGuest, IGuestList, IStaticProps } from '@/interfaces'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { environment } from '../../config'

const { apiUrl } = environment

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
  const response = await fetch(`${apiUrl}/guest-list`)
  const guest_list = (await response.json()) as IGuestList
  const paths = guest_list.map(({ code }) => ({ params: { code } }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }): IStaticProps<{ guests: IGuest }> => {
  const code = params?.code
  const res = await fetch(`${apiUrl}/guests?code=${code}`)
  const guests = (await res.json()) as IGuest

  return {
    props: {
      guests,
    },
  }
}
