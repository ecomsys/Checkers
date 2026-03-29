import { type FC, useEffect, useState } from "react";
import Confetti from "react-confetti";
import type { CheckersState } from "@/types/types";

interface ModalProps {
  state: CheckersState;
  onRestart: () => void;
  onLeave: () => void;
}

const Modal: FC<ModalProps> = ({ state, onRestart, onLeave }) => {
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setConfetti(true));

    const audio = new Audio("/games/checkers/sounds/win.mp3");
    audio.play().catch(() => { });
  }, []);

  if (!state.completed || !state.winner) return null;

  // --- overlay click ---
  const handleOverlayClick = () => {
    onRestart();
  };

  // --- stop propagation ---
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center z-50 min-w-[20rem]
                   bg-black/40 backdrop-blur-sm p-4"
        onClick={handleOverlayClick}
      >
        <div
          className="bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700
                     rounded-3xl
                     shadow-[0_0.625rem_1.875rem_rgba(0,0,0,0.25),0_0.25rem_0.375rem_rgba(0,0,0,0.15)]
                     w-full max-w-[26.25rem] p-8 flex flex-col items-center gap-6 animate-fadeIn"
          onClick={handleContentClick}
        >
          {/* Заголовок */}
          <div className="flex flex-col items-center gap-3">
            <svg className="w-[3.75rem] h-[3.75rem]">
              <use xlinkHref={`${import.meta.env.BASE_URL}/icons/sprite/sprite.svg#trophy`} />
            </svg>

            <span className="text-4xl md:text-5xl font-extrabold text-white text-center drop-shadow-lg">
              Игра окончена
            </span>
          </div>

          {/* Победитель */}
          <p className="text-2xl text-white font-bold text-center drop-shadow-md">
            Победили: {state.winner === "w" ? "Белые" : "Чёрные"}
          </p>

          {/* Статистика */}
          <div className="flex flex-col gap-3 text-white text-xl md:text-2xl font-semibold text-center">
            <p>
              Ходы: <span className="font-bold">{state.movesCount}</span>
            </p>
          </div>

          {/* Кнопки */}
          <div className="flex gap-3 w-full justify-center">
            <button
              className="bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700
                       text-white font-bold text-xl px-6 py-4 rounded-2xl leading-[1]
                       shadow-[0_0.25rem_0.75rem_rgba(0,0,0,0.25),0_0.125rem_0.375rem_rgba(0,0,0,0.15)]
                       hover:scale-105 transition-transform duration-200 
                         px-6 py-3 rounded-xl w-full max-w-[12rem] cursor-pointer"
              onClick={onLeave}
            >
              <span>Меню</span>
            </button>

            <button
              className="bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700
                       text-white font-bold text-xl px-6 py-4 rounded-2xl leading-[1]
                       shadow-[0_0.25rem_0.75rem_rgba(0,0,0,0.25),0_0.125rem_0.375rem_rgba(0,0,0,0.15)]
                       hover:scale-105 transition-transform duration-200
                         px-6 py-3 rounded-xl w-full max-w-[12rem] cursor-pointer"
              onClick={onRestart}
            >
             <span>Заново</span>
            </button>
          </div>
        </div>
      </div>

      {confetti && (
        <Confetti
          numberOfPieces={150}
          recycle={false}
          gravity={0.3}
          tweenDuration={5000}
          initialVelocityX={{ min: -10, max: 10 }}
          initialVelocityY={{ min: -10, max: 10 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 9999,
          }}
        />
      )}
    </>
  );
};

export default Modal;