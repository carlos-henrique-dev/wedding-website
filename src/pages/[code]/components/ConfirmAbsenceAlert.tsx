import { useRef, useEffect } from "react";

interface Props {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmAbsenceAlert({
  isOpen,
  onConfirm,
  onCancel,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onCancel();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onCancel]);

  return (
    <div
      ref={ref}
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 shadow-2xl w-full"
      style={{
        display: isOpen ? "block" : "none",
      }}
    >
      <div className="bg-white rounded-lg p-2 flex flex-col items-center justify-center z-100">
        <h3 className="text-red-500 my2 text-2xl">Confirmar ausência</h3>

        <p className="w-full text-center text-black my-3">
          Confirma que não poderá comparecer? Esta ação não poderá ser desfeita
        </p>

        <div className="flex flex-col w-3/4 gap-2 mt-2">
          <button
            className="bg-teal-400 text-white rounded-lg p-2"
            type="button"
            onClick={onConfirm}
          >
            Confirmar
          </button>

          <button
            className="bg-red-400 text-white rounded-lg p-2"
            type="button"
            onClick={onCancel}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
