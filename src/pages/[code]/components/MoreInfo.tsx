import { useState } from "react";

const PIX_KEY = "alan.kr.ro.ko@gmail.com";

export default function MoreInfo() {
  const [pixKeyCopied, setPixKeyCopied] = useState(false);

  const copyPixKey = () => {
    navigator.clipboard.writeText(PIX_KEY);
    setPixKeyCopied(true);
  };

  return (
    <section className="relative w-full h-full py-5 flex items-center justify-center flex-col">
      <h3 className="font-arapey text-2xl flex-wrap text-primary mt-5">
        Informações importantes
      </h3>

      <section className="w-full h-full flex flex-col justify-start items-center">
        <details className="w-full">
          <summary className="font-arapey text-lg text-primary-dark w-full p-3">
            <h4 className="font-arapey inline-block font-bold">
              Sobre os presentes
            </h4>
          </summary>

          <p className="text-primary-dark border-[1px] rounded-lg p-2 text-justify flex flex-col m-2">
            Optamos por não fazer lista de presentes!
            <br />
            <br />
            Receberemos com o maior carinho o que você sentir no coração!
            <br />
            <br />
            Se preferir contribuir com nossa lua de mel, segue abaixo nossa
            chave pix!
            <br />
            <br />E caso não possa, não há problemas, o nosso presente é ter a
            sua companhia!
            <br />
            <br />
            <span className="w-full text-center my-2">
              Chave: <span className="text-black">{PIX_KEY}</span>
            </span>
            <button
              className="w-full rounded-lg bg-teal-400 text-white p-2"
              onClick={() => copyPixKey()}
            >
              Copiar chave
            </button>
            <span
              className={`w-full text-center text-teal-700
              ${pixKeyCopied ? "block" : "hidden"}
            `}
            >
              Chave copiada!
            </span>
          </p>
        </details>

        <details className="w-full bg-white">
          <summary className="font-arapey text-lg text-primary-dark w-full p-3">
            <h4 className="font-arapey inline-block font-bold">Como chegar</h4>
          </summary>

          <div className="space-y-2 w-full">
            <p className="text-primary-dark border-[1px] rounded-lg text-justify flex flex-col p-3">
              O evento será realizado Em Dourados/MS no Espaço dos Buritis,
              localizado na
              <br />
              <span className="text-teal-700">
                BR-163 - São Pedro, Dourados - MS, 79804-970.
              </span>
            </p>

            <div className="h-[550px] w-full p-3">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3693.7640337575185!2d-54.71684822376246!3d-22.211072079750878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94890719c8232d09%3A0x84549dcf15d32f0f!2sEspa%C3%A7o%20dos%20Buritis%20-%20Restaurante%20%26%20Eventos!5e0!3m2!1sen!2sbr!4v1702237023383!5m2!1sen!2sbr"
                width="300"
                height="450"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full rounded-lg"
              ></iframe>
            </div>
          </div>
        </details>
      </section>
    </section>
  );
}
