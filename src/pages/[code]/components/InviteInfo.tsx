import { BouncingArrowDown, RoseImage } from "@/components";
import { IGuest } from "@/interfaces";

interface Props {
  guestData: IGuest;
}

export default function InviteInfo({ guestData }: Props) {
  return (
    <section className="relative overflow-hidden w-full h-full flex justify-center items-center">
      <RoseImage className="absolute -top-[10%] -left-[40%] z-10" />

      <section className="w-[90%] h-[90%] flex justify-evenly items-center flex-col z-20 bg-white-90">
        <h2 className="font-callem-script text-7xl flex-wrap text-primary text-center">
          {guestData.family}
        </h2>

        <p className="w-full text-center font-eb-garamond italic text-xl text-primary-dark">
          Com a benção de Deus e nossos pais
          <br /> convidamos você para celebrar conosco o nosso casamento
        </p>

        <section className="w-full flex flex-col items-center justify-center gap-2">
          <div className="relative w-full flex items-center justify-center h-5">
            <p className="absolute bg-white z-20 font-eb-garamond text-primary-dark text-center text-xl px-2">
              Sábado, às 16h30
            </p>

            <hr className="bg-primary-dark h-1 w-3/4 absolute z-10" />
          </div>

          <p className="text-primary-dark w-full text-center space-x-1 text-2xl">
            <span className="font-arapey">02</span>
            <span className="text-primary-light">♥</span>
            <span className="font-arapey">Março</span>
            <span className="text-primary-light">♥</span>
            <span className="font-arapey">2024</span>
          </p>

          <hr className="bg-primary-dark h-1 w-3/4" />

          <p className="mt-5 font-eb-garamond text-primary-dark">
            Espaço dos Buritis, Dourados-MS
          </p>
          <p className="font-eb-garamond text-primary-dark">
            Encerramento às 0h
          </p>
        </section>
      </section>

      <div className="mt-5 absolute bottom-10 z-30 transform translate-x-1/2">
        <a href="#rsvp">
          <BouncingArrowDown />
        </a>
      </div>

      <RoseImage className="absolute z-10 w-8/12 -bottom-[10%] -right-[30%]" />
    </section>
  );
}
