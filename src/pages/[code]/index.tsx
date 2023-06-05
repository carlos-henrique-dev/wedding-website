import { GetServerSideProps, GetStaticPaths, GetStaticProps, GetStaticPropsResult } from 'next'
import Head from 'next/head'
import { IGuest, IServerSideReturn } from '@/interfaces'
import { RoseImage } from '@/components'
import Image from 'next/image'
import { useEffect, useState } from 'react'

// export const getServerSideProps: GetServerSideProps = async ({ params }): IServerSideReturn<{ guests: IGuest }> => {
//   const { FireStoreAdapter } = await import('@/infra')
//   const database = new FireStoreAdapter()

//   const code = params?.code
//   const guests = await database.getOne(code as string)

//   return { props: { guests } }
// }

export const getStaticPaths: GetStaticPaths = async () => {
  const { FireStoreAdapter } = await import('@/infra')
  const database = new FireStoreAdapter()

  const guestsList = await database.getCodes()

  const paths = guestsList.map(({ code }) => ({ params: { code } }))
  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }): Promise<GetStaticPropsResult<{ guests: IGuest }>> => {
  const { FireStoreAdapter } = await import('@/infra')
  const database = new FireStoreAdapter()

  const code = params?.code
  const guests = await database.getOne(code as string)

  return {
    props: {
      guests,
    },
    revalidate: 60 * 60, // 1 hour
  }
}

interface Props {
  guests: IGuest
}

export default function Invite({ guests }: Props) {
  const [confirmed, setConfirmed] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  async function markAsSeen() {
    await fetch('/api/mark-as-seen', {
      method: 'POST',
      body: JSON.stringify({ code: guests.code }),
    })
  }

  async function confirmPresence() {
    setLoading(true)

    const members = confirmed.map((name) => name.split('guest-')[1])
    await fetch('/api/confirm-presence', {
      method: 'POST',
      body: JSON.stringify({ code: guests.code, members }),
    })

    setLoading(false)
  }

  async function confirmAbsence() {
    setLoading(true)

    await fetch('/api/confirm-absence', {
      method: 'POST',
      body: JSON.stringify({ code: guests.code }),
    })

    setLoading(false)
  }

  useEffect(() => {
    markAsSeen()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCheckConfirmed = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, name } = event.target

    if (!checked) {
      setConfirmed(confirmed.filter((item) => item !== name))
      return
    }

    if (confirmed.includes(name)) {
      setConfirmed(confirmed.filter((item) => item === name))
      return
    }

    setConfirmed([...confirmed, name])
  }

  const isConfirmed = (name: string) => guests.members.some((member) => member.name === name && member.is_coming)

  const confirmedCount = () => {
    let count = 0
    const mountMessage = (total: number) => `${total} de ${guests.members.length} convidados confirmados`

    if (guests.absent) return mountMessage(count)

    if (guests.confirmed) {
      count = guests.members.filter((member) => member.is_coming).length
      return mountMessage(count)
    }

    count = confirmed.length

    return mountMessage(count)
  }

  const confirmPresenceButtonLabel = () => {
    if (loading) return 'Confirmando...'

    if (guests.absent) return 'Ausência confirmada'

    if (guests.confirmed) return 'Presença confirmada'

    return 'Confirmar presença'
  }

  const confirmAbsenceButtonLabel = () => {
    if (loading) return 'Confirmando...'

    if (guests.absent) return 'Você confirmou ausência'

    return 'Confirmar ausência'
  }

  return (
    <>
      <Head>
        <title>{`Convite ${guests.family}`}</title>
        <meta name="description" content="Vamos casar e sua presença será uma bênção para nós!" />
      </Head>

      <main className="invite">
        <div className="paper">
          <svg>
            <filter id="roughpaper">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" result="noise" numOctaves="5" />

              <feDiffuseLighting in="noise" lightingColor="#fff" surfaceScale="2">
                <feDistantLight azimuth="45" elevation="60" />
              </feDiffuseLighting>
            </filter>
          </svg>
        </div>

        <RoseImage className="first_rose_background" />

        <section className="cover" id="cover">
          <h1 className="title">
            <span>Henrique</span>
            <span>e</span>
            <span>Thaysa</span>
          </h1>

          <p className="subtitle">
            <span className="verse">
              <span>&quot;Grandes coisas fez o Senhor por nós.</span>
              <span>Por isso estamos alegres.&quot;</span>
            </span>

            <span>Salmos 126:3</span>
          </p>

          <p className="date">
            <span>15 - 07 - 2023</span>
          </p>

          <a href="#details" className="arrow_down">
            <div className="arrow_down_container">
              <div className="arrow_down_chevron"></div>
              <div className="arrow_down_chevron"></div>
              <div className="arrow_down_chevron"></div>
            </div>
          </a>
        </section>

        <RoseImage className="second_rose_background" />

        <section className="details" id="details">
          <div className="background-overlay" />

          <Image src="/images/mini_rose.png" alt="mini_rose_background" width={60} height={60} className="mini_rose" />

          <h2 className="family-name">{guests.family}</h2>

          <span className="invitation">COM A BÊNÇÃO DE DEUS E NOSSOS PAIS</span>

          <p className="parents">
            <span>Luciana Fernandes</span>
            <span>Marluci Tobias</span>
            <span>João Carlos</span>
            <span>Elio Joaquim</span>
          </p>

          <span className="invitation">
            CONVIDAMOS VOCÊS PARA A CELEBRAÇÃO DO NOSSO
            <br />
            CASAMENTO A SER REALIZADO NO DIA
          </span>

          <div className="date_place">
            <span className="date">SÁBADO</span>

            <div className="date-divider" />

            <span className="date">
              <span>JULHO</span>
              <span className="day">15</span>
              <span className="year">2023</span>
            </span>

            <div className="date-divider" />

            <span className="time-place">
              <span className="time">ÀS 18h</span>

              <span className="place">
                <span>PALLADIUM</span>
                <span>BUFFET</span>
              </span>
            </span>
          </div>

          <a href="#rsvp" className="arrow_down">
            <div className="arrow_down_container">
              <div className="arrow_down_chevron"></div>
              <div className="arrow_down_chevron"></div>
              <div className="arrow_down_chevron"></div>
            </div>
          </a>
        </section>

        <RoseImage className="third_rose_background" />

        <section className="rsvp" id="rsvp">
          <div className="background-overlay" />

          <Image src="/images/mini_rose.png" alt="mini_rose" width={60} height={60} className="mini_rose" />

          <span className="information">
            PEDIMOS QUE CONFIRMEM SUA
            <br /> PRESENÇA ATÉ O DIA <b>20-05-2023</b>
          </span>

          <span className="information">Selecione na lista abaixo as pessoas que estarão presentes.</span>

          <div className="guest-list">
            {guests.members.map((member, index) => (
              <div className="guest" key={index}>
                <input
                  disabled={guests.confirmed || guests.absent}
                  defaultChecked={isConfirmed(member.name)}
                  className="checkbox"
                  type="checkbox"
                  id={`guest-${index}`}
                  name={`guest-${member.name}`}
                  onChange={handleCheckConfirmed}
                />

                <label htmlFor={`guest-${index}`}>
                  <span className="name">{member.name}</span>
                </label>
              </div>
            ))}
          </div>

          <p className="confirmed-count">{confirmedCount()}</p>

          <div className="actions">
            {guests.absent ? null : (
              <button className="confirm-button" type="button" disabled={guests.absent || guests.confirmed || confirmed.length === 0} onClick={() => confirmPresence()}>
                {confirmPresenceButtonLabel()}
              </button>
            )}

            {guests.confirmed ? null : (
              <button className="cancel-button" type="button" disabled={guests.absent} onClick={() => confirmAbsence()}>
                {confirmAbsenceButtonLabel()}
              </button>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
