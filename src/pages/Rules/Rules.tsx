import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "@/store/useGameStore";

export default function Rules() {
  const navigate = useNavigate();
  const { game } = useGameStore();


  const rulesList = [
    "Цель игры — захватить все шашки соперника или заблокировать их.",
    "Игрок делает один ход за раз, двигая шашку по диагонали только вперёд.",
    "Если есть возможность побить шашку соперника — ход обязателен.",
    "За один ход можно совершать несколько взятий подряд.",
    "Бить шашки можно в любом направлении (вперёд и назад), но обычные ходы выполняются только вперёд.",
    "Если шашка оказалась заблокирована и не может двигаться — она остаётся на доске.",
    "Игра заканчивается, когда у одного игрока не остаётся шашек или нет возможных ходов."
  ];

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  const mode = game?.mode === "pve" ? "pve" : "eve"; // default to "eve" if game or mode is undefined

  const buttonBase =
    "font-[Montserrat] font-bold text-xl md:text-2xl px-6 py-3 rounded-2xl transition-all duration-200 shadow-md w-full max-w-xs";

  const buttonTeal =
    "bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 text-white hover:scale-105 active:translate-y-[0.0625rem]";

  return (
    <div className="flex flex-col gap-8 px-4 py-8 bg-teal-50/10 items-center w-full min-w-[20rem]">

      {/* Кнопка назад */}
      <button
        className={`${buttonBase} ${buttonTeal} cursor-pointer`}
        onClick={() => navigate(`/game?mode=${mode}`)}
      >
        Назад
      </button>

      {/* Заголовок */}
      <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent 
                     bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 text-center">
        Правила игры
      </h1>

      {/* Вступление */}
      <p
        className={`text-xl md:text-2xl max-w-2xl text-teal-900 text-center transition-all duration-500 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        Добро пожаловать в русские шашки без дамок! Ниже описаны основные правила игры:
      </p>

      {/* Список правил */}
      <ul className="flex flex-col gap-4 max-w-3xl w-full">
        {rulesList.map((rule, index) => (
          <li
            key={index}
            className="bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600 
                       rounded-2xl p-4 shadow-[0_0.375rem_0.625rem_rgba(0,0,0,0.2),0_0.125rem_0.25rem_rgba(0,0,0,0.1)]
                       text-white font-semibold text-lg transition-all transform duration-500 ease-out"
            style={{
              transitionDelay: `${index * 150}ms`,
              transitionProperty: "opacity, transform",
              transitionDuration: "500ms",
              transitionTimingFunction: "ease-out",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(1rem)"
            }}
          >
            <span className="font-bold mr-2">{index + 1}.</span>
            {rule}
          </li>
        ))}
      </ul>
    </div>
  );
}