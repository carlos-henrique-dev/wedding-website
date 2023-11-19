import { GetStaticPaths, GetStaticProps, GetStaticPropsResult } from 'next'
import Head from 'next/head'
import { IGuest } from '@/interfaces'
import Image from 'next/image'
import { useEffect, useState } from 'react'

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

export const getStaticProps: GetStaticProps = async ({ params }): Promise<GetStaticPropsResult<{ guest: IGuest }>> => {
  const { FireStoreAdapter } = await import('@/infra')
  const database = new FireStoreAdapter()

  const code = params?.code
  const guest = await database.getOne(code as string)

  if (!guest) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      guest,
    },
    revalidate: 60 * 60, // 1 hour
  }
}

interface Props {
  guest: IGuest
}

export default function Invite({ guest: guestsProps }: Props) {
  const [confirmedGuests, setConfirmedGuests] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [showMaps, setShowMaps] = useState(false)
  const [showGiftsInfo, setGiftsInfo] = useState(false)
  const [showConfirmTip, setShowConfirmTip] = useState(false)
  const [showConfirmAbsence, setShowConfirmAbsence] = useState(false)
  const [pixKeyCopied, setPixKeyCopied] = useState(false)
  const [guests, setGuests] = useState<IGuest>(guestsProps)

  async function markAsSeen() {
    await fetch('/api/mark-as-seen', {
      method: 'POST',
      body: JSON.stringify({ code: guests.code }),
    })
  }

  async function getGuestDetails() {
    const url = '/api/guest-details?code=' + guests.code
    const response = await fetch(url, {
      method: 'GET',
    })

    const data: IGuest = await response.json()

    setGuests(data)
  }

  async function confirmPresence() {
    if (!confirmedGuests.length) {
      setShowConfirmTip(true)
      return
    }

    setLoading(true)

    const members = confirmedGuests.map((name) => name.split('guest-')[1])
    await fetch('/api/confirm-presence', {
      method: 'POST',
      body: JSON.stringify({ code: guests.code, members }),
    })

    await getGuestDetails()
    setLoading(false)
  }

  async function confirmAbsence() {
    setLoading(true)

    await fetch('/api/confirm-absence', {
      method: 'POST',
      body: JSON.stringify({ code: guests.code }),
    })

    await getGuestDetails()
    setLoading(false)
    setShowConfirmAbsence(false)
  }

  useEffect(() => {
    markAsSeen()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (showConfirmTip) {
      setTimeout(() => {
        setShowConfirmTip(false)
      }, 2000)
    }
  }, [showConfirmTip])

  const handleCheckConfirmed = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, name } = event.target

    if (!checked) {
      setConfirmedGuests(confirmedGuests.filter((item) => item !== name))
      return
    }

    if (confirmedGuests.includes(name)) {
      setConfirmedGuests(confirmedGuests.filter((item) => item === name))
      return
    }

    setConfirmedGuests([...confirmedGuests, name])
  }

  const isConfirmed = (name: string) => guests.members.some((member) => member.name === name && member.is_coming)

  const confirmedCount = () => {
    let count = 0
    const suffix = guests.members.length > 1 ? 'convidados confirmados' : 'convidado confirmado'
    const mountMessage = (total: number) => `${total} de ${guests.members.length} ${suffix}`

    if (guests.absent) return mountMessage(count)

    if (guests.confirmed) {
      count = guests.members.filter((member) => member.is_coming).length
      return mountMessage(count)
    }

    count = confirmedGuests.length

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

  const toggleMaps = () => setShowMaps(!showMaps)
  const toggleGiftsInfo = () => {
    setGiftsInfo(!showGiftsInfo)
    if (pixKeyCopied) {
      setPixKeyCopied(false)
    }
  }
  const copyPixKey = () => {
    navigator.clipboard.writeText('TODO VERIFICAR O EMAIL')
    setPixKeyCopied(true)
  }

  const isConfirmButtonDisabled = guests.absent || guests.confirmed

  const inviteText = guests.members.length > 1 ? 'CONVIDAMOS VOCÊS PARA A CELEBRAÇÃO DO NOSSO' : 'CONVIDAMOS VOCÊ PARA A CELEBRAÇÃO DO NOSSO'
  const confirmationText = guests.members.length > 1 ? 'PEDIMOS QUE CONFIRMEM SUA' : 'PEDIMOS QUE CONFIRME SUA'

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

        <section className="cover" id="cover">
          <h1 className="title">
            <span>Alan</span>
            <span>- e -</span>
            <span>Fran</span>
          </h1>

          <p className="subtitle">
            <span className="verse">
              <span>Texto aqui?</span>
            </span>

            <span>Texto aqui?</span>
          </p>

          <p className="date">
            <span>data a definir</span>
          </p>

          <a href="#details" className="arrow_down">
            <div className="arrow_down_container">
              <div className="arrow_down_chevron"></div>
              <div className="arrow_down_chevron"></div>
              <div className="arrow_down_chevron"></div>
            </div>
          </a>
        </section>

        <section className="details" id="details">
          <div className="background-overlay" />

          <Image src="/images/mini_rose.png" alt="mini_rose_background" width={60} height={60} className="mini_rose" />

          <h2 className="family-name">{guests.family}</h2>

          <span className="invitation">texto aqui?</span>

          <p className="parents">
            <span>vai</span>
            <span>listar algo</span>
            <span>aqui</span>
            <span>?</span>
          </p>

          <span className="invitation">
            {inviteText}
            <br />
            CASAMENTO A SER REALIZADO NO DIA
          </span>

          <div className="date_place">
            <span className="date">SÁBADO</span>

            <div className="date-divider" />

            <span className="date">
              <span>dia</span>
              <span className="day">a</span>
              <span className="year">definir</span>
            </span>

            <div className="date-divider" />

            <span className="time-place">
              <span className="time">horario a definir</span>

              <span className="place">
                <span>Local</span>
                <span>a definir</span>
              </span>
            </span>
          </div>

          <a href="#rsvp" className="arrow_down">
            <div className="arrow_down_container bottom_zero">
              <div className="arrow_down_chevron"></div>
              <div className="arrow_down_chevron"></div>
              <div className="arrow_down_chevron"></div>
            </div>
          </a>
        </section>

        <section className="rsvp" id="rsvp">
          <div className="background-overlay less_opacity" />

          <div className="wrapper">
            <div className="confirmation">
              <Image src="/images/mini_rose.png" alt="mini_rose" width={60} height={60} className="mini_rose" />

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
                {guests.confirmed ? null : (
                  <button className="cancel-button" type="button" disabled={guests.absent} onClick={() => setShowConfirmAbsence(!showConfirmAbsence)}>
                    {confirmAbsenceButtonLabel()}
                  </button>
                )}

                {guests.absent ? null : (
                  <button className={`confirm-button ${guests.confirmed ? 'confirmed' : ''}`} type="button" disabled={isConfirmButtonDisabled} onClick={() => confirmPresence()}>
                    {confirmPresenceButtonLabel()}
                  </button>
                )}

                {showConfirmTip && (
                  <div className="confirm-tip">
                    <span className="tip">Primeiro você precisa selecionar quem vai comparecer.</span>
                  </div>
                )}
              </div>
            </div>

            <div className="additional_information">
              <div className="gifts" onClick={toggleGiftsInfo}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="16" height="16" className="gifts_svg" viewBox="0 0 16 16">
                  <path d="M3 2.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0v.006c0 .07 0 .27-.038.494H15a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.038A2.968 2.968 0 0 1 3 2.506V2.5zm1.068.5H7v-.5a1.5 1.5 0 1 0-3 0c0 .085.002.274.045.43a.522.522 0 0 0 .023.07zM9 3h2.932a.56.56 0 0 0 .023-.07c.043-.156.045-.345.045-.43a1.5 1.5 0 0 0-3 0V3zm6 4v7.5a1.5 1.5 0 0 1-1.5 1.5H9V7h6zM2.5 16A1.5 1.5 0 0 1 1 14.5V7h6v9H2.5z" />
                </svg>
                <span>Presentes</span>
              </div>

              <div className="location" onClick={toggleMaps}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" fill="currentColor" height="16" className="location_svg" viewBox="0 0 16 16">
                  <path
                    fillRule="evenodd"
                    d="M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.319 1.319 0 0 0-.37.265.301.301 0 0 0-.057.09V14l.002.008a.147.147 0 0 0 .016.033.617.617 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.619.619 0 0 0 .146-.15.148.148 0 0 0 .015-.033L12 14v-.004a.301.301 0 0 0-.057-.09 1.318 1.318 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465-1.281 0-2.462-.172-3.34-.465-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411z"
                  />
                </svg>
                <span>Localização</span>
              </div>
            </div>
          </div>

          {showConfirmAbsence && (
            <div className="info-modal">
              <div className="info-modal-content normal-height half-width">
                <div className="info">
                  <h3>Confirmar ausência</h3>

                  <p className="content center">Confirma que não poderá comparecer?</p>

                  <div className="actions">
                    <button className="cancel-button" type="button" onClick={() => setShowConfirmAbsence(!showConfirmAbsence)}>
                      Cancelar
                    </button>

                    <button className="confirm-button" type="button" onClick={() => confirmAbsence()}>
                      Confirmar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showGiftsInfo && (
            <div className="info-modal">
              <div className="info-modal-content normal-height">
                <span className="close-button" onClick={toggleGiftsInfo}>
                  Fechar
                </span>

                <div className="info">
                  <h3>Sobre os presentes</h3>

                  <p className="content">
                    Definir o texto aqui
                    <span>
                      Chave: <strong>DEFINIR a chave</strong>
                    </span>
                    <button className="copy-pix" onClick={() => copyPixKey()}>
                      Copiar chave
                    </button>
                    {pixKeyCopied && <span className="pix-key-copied">Chave copiada!</span>}
                  </p>
                </div>
              </div>
            </div>
          )}

          {showMaps && (
            <div className="info-modal">
              <div className="info-modal-content">
                <span className="close-button" onClick={toggleMaps}>
                  Fechar
                </span>

                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3669.4112850366396!2d-55.22242031811882!3d-23.118637317134738!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x948a14066ab82db3%3A0xb94f8c9f31164de6!2sPalladium%20Buffet!5e0!3m2!1sen!2sbr!4v1685947028405!5m2!1sen!2sbr"
                  width="600"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="info"
                ></iframe>
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  )
}
