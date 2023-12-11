import { BouncingArrowDown, RoseImage } from "@/components";
import { IGuest } from "@/interfaces";
import { useEffect, useState } from "react";
import ConfirmAbsenceAlert from "./ConfirmAbsenceAlert";

interface Props {
  guestData?: IGuest;
  loading: boolean;
  refreshData: () => Promise<void>;
  toggleLoading: (state: boolean) => void;
}

export default function RSVP({
  guestData,
  loading,
  refreshData,
  toggleLoading,
}: Props) {
  const [confirmedGuests, setConfirmedGuests] = useState<string[]>([]);
  const [showConfirmTip, setShowConfirmTip] = useState(false);
  const [showConfirmAbsence, setShowConfirmAbsence] = useState(false);

  useEffect(() => {
    if (showConfirmTip) {
      setTimeout(() => {
        setShowConfirmTip(false);
      }, 2000);
    }
  }, [showConfirmTip]);

  async function confirmPresence() {
    if (!confirmedGuests.length) {
      setShowConfirmTip(true);
      return;
    }

    toggleLoading(true);

    const members = confirmedGuests.map((name) => name.split("guest-")[1]);

    await fetch("/api/confirm-presence", {
      method: "POST",
      body: JSON.stringify({ code: guestData?.code, members }),
    });

    await refreshData();
    toggleLoading(false);
  }

  async function confirmAbsence() {
    if (!guestData) return;

    toggleLoading(true);

    await fetch("/api/confirm-absence", {
      method: "POST",
      body: JSON.stringify({ code: guestData.code }),
    });

    await refreshData();
    toggleLoading(false);
    setShowConfirmAbsence(false);
  }

  const confirmedCount = () => {
    if (!guestData) return null;

    let count = 0;
    const suffix =
      guestData.members.length > 1
        ? "convidados confirmados"
        : "convidado confirmado";
    const mountMessage = (total: number) =>
      `${total} de ${guestData.members.length} ${suffix}`;

    if (guestData.absent) return mountMessage(count);

    if (guestData.confirmed) {
      count = guestData.members.filter((member) => member.is_coming).length;
      return mountMessage(count);
    }

    count = confirmedGuests.length;

    return mountMessage(count);
  };

  const handleCheckConfirmed = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, name } = event.target;

    if (!checked) {
      setConfirmedGuests(confirmedGuests.filter((item) => item !== name));
      return;
    }

    if (confirmedGuests.includes(name)) {
      setConfirmedGuests(confirmedGuests.filter((item) => item === name));
      return;
    }

    setConfirmedGuests([...confirmedGuests, name]);
  };

  const isMemberConfirmed = (name: string) =>
    guestData?.members.some(
      (member) => member.name === name && member.is_coming,
    );

  const confirmPresenceButtonLabel = () => {
    if (loading) return "Confirmando...";

    if (guestData?.absent) return "Ausência confirmada";

    if (guestData?.confirmed) return "Presença confirmada";

    return "Confirmar";
  };

  const disableForm = guestData?.confirmed || guestData?.absent;

  if (!guestData) {
    return null;
  }

  return (
    <section className="relative overflow-hidden w-full h-full flex justify-center items-center">
      {/* a div with a spinner loading */}
      <div
        className={`absolute w-full h-full bg-white/60 z-40 flex justify-center items-center ${loading ? "block" : "hidden"
          }`}
      >
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>

      <RoseImage className="absolute -top-[10%] -left-[40%] z-10" />

      <section className="w-[90%] h-[90%] flex justify-evenly items-center flex-col z-20 bg-white-90">
        <h3 className="font-arapey text-2xl flex-wrap text-primary">
          Confirme sua presença
        </h3>

        <h4 className="font-arapey text-xl flex-wrap text-primary-dark text-center">
          Pedimos que confirme até <br />
          DATA LIMITE
        </h4>

        <div className="w-full bg-white flex flex-col items-center justify-center p-2">
          <span className="text-sm text-primary-dark w-full text-center mb-3">
            Selecione os convidados que irão participar
          </span>

          {guestData.members.map((member, index) => (
            <div
              key={index}
              className="flex w-full flex-row gap-2 p-1 items-center"
            >
              <input
                disabled={disableForm}
                defaultChecked={isMemberConfirmed(member.name)}
                className="appearance-none h-5 w-5 border border-gray-300 rounded checked:bg-teal-500 checked:border-transparent focus:outline-none flex items-center justify-center"
                type="checkbox"
                id={`guest-${index}`}
                name={`guest-${member.name}`}
                onChange={handleCheckConfirmed}
              />

              <label htmlFor={`guest-${index}`}>
                <span className="text-lg text-primary">{member.name}</span>
              </label>
            </div>
          ))}

          <p className="text-primary mt-3">{confirmedCount()}</p>
        </div>

        <div className="w-full flex flex-col gap-2 px-4">
          <div className="relative">
            {showConfirmTip && (
              <p className="w-full text-center text-primary absolute bottom-10">
                Você precisa selecionar pelo menos uma pessoa da lista!
              </p>
            )}

            <button
              disabled={disableForm}
              onClick={() => confirmPresence()}
              className="bg-teal-400 text-white rounded px-4 py-2 disabled:opacity-50 w-full"
            >
              {confirmPresenceButtonLabel()}
            </button>
          </div>

          <div className="relative w-full">
            <ConfirmAbsenceAlert
              isOpen={showConfirmAbsence}
              onConfirm={confirmAbsence}
              onCancel={() => setShowConfirmAbsence(false)}
            />

            <button
              disabled={disableForm}
              onClick={() => setShowConfirmAbsence(true)}
              className="bg-red-400 text-white rounded px-4 py-2 disabled:opacity-50 w-full"
            >
              Não poderei ir
            </button>
          </div>
        </div>

        <div className="mt-5 absolute bottom-5 z-30 transform translate-x-1/2">
          <a href="#mais-informacoes">
            <BouncingArrowDown />
          </a>
        </div>
      </section>

      <RoseImage className="absolute z-10 w-8/12 -bottom-[10%] -right-[30%]" />
    </section>
  );
}
