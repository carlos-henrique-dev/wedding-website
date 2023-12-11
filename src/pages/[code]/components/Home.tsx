import { BouncingArrowDown, RoseImage } from '@/components'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex w-screen h-screen justify-center items-center relative overflow-hidden">
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
        //
        className="absolute -bottom-[15%] -right-10 w-4/5"
      />
    </main>
  )
}
