import React from "react";
import { AppButton } from "@/components/appButton";
import { useNavigate } from "react-router-dom";
import { Checker } from "./Checker";
import { PlayerCard } from "./PlayerCard";
import Timer from "@/components/timer";

import type { Game, CheckersState } from "@/types/types";

interface GameHeaderProps {
  game: Game<CheckersState>,
  onRestart?: () => void;
  toggleSounds: () => void;
  sounds: boolean;
}

export function GameHeader({ game, onRestart, toggleSounds , sounds }: GameHeaderProps) {
  const navigate = useNavigate();
  const state = game.state;

  // const mode = game.mode;

  // ------------------- УБИТЫЕ -------------------
  const killed = React.useMemo(() => {
    if (!state) return { w: 0, b: 0 };

    // считаем по доске (у тебя нет killed в state)
    let w = 0;
    let b = 0;

    state.board.forEach(row => {
      row.forEach(cell => {
        if (cell === "w") w++;
        if (cell === "b") b++;
      });
    });

    // стандарт: 12 шашек
    return {
      w: 12 - w,
      b: 12 - b,
    };
  }, [state]);

  // ------------------- КТО ЕСТЬ КТО -------------------
  const whitePlayer = game.players[0];
  const blackPlayer = game.players[1];

  return (
    <div className="bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 border border-teal-600/40 shadow-[0_0.625rem_1.25rem_rgba(0,0,0,0.25),0_0.25rem_0.375rem_rgba(0,0,0,0.15)] 
    px-2 sm:px-5 md:px-10 py-2 md:py-4 rounded-[2.5rem] gap-2.5 md:gap-6 w-full max-w-3xl mx-auto 
    flex items-center justify-center xs:justify-evenly flex-wrap md:flex-nowrap">

      {/* КНОПКА */}
      <AppButton
        variant="none"
        title="На главную"
        className="cursor-pointer"
        onClick={() => navigate("/home")}
      >
        <svg className="w-10 h-10 text-white hover:text-amber-300 transition duration-300">
          <use xlinkHref={`${import.meta.env.BASE_URL}/icons/sprite/sprite.svg#home`} />
        </svg>
      </AppButton>

      {/* звуки  */}
      <AppButton
        variant="none"
        title="Переключить звуки"
        className="cursor-pointer"
        onClick={toggleSounds}
      >
        <svg className={`w-10 h-10 ${sounds ? "text-amber-500" : "text-white"} hover:text-amber-300 transition duration-300`}>
          <use xlinkHref={`${import.meta.env.BASE_URL}/icons/sprite/sprite.svg#sounds`} />
        </svg>
      </AppButton>

       {/* Заново */}
      <AppButton
        variant="none"
        title="Начать заново"
        className="cursor-pointer hover:scale-110 transition-transform duration-300"
        onClick={onRestart}
      >
        <svg className="w-10 h-10 text-white hover:text-amber-300 transition duration-300">
          <use xlinkHref={`${import.meta.env.BASE_URL}/icons/sprite/sprite.svg#refresh`} />
        </svg>
      </AppButton>

      <Timer time={game.state?.time ?? 0} />

      {/* ХОД */}
      <div className="flex items-center gap-3 px-4 py-2 rounded-3xl bg-blue-800/40 shadow-inner border border-blue-600/30">
        <svg className="w-[2.5rem] h-[2.5rem] text-white">
          <use xlinkHref={`${import.meta.env.BASE_URL}/icons/sprite/sprite.svg#footprints`} />
        </svg>
        {state?.currentPlayer === "w" ? (
          <Checker color="white" className="h-6 w-6 sm:h-10 sm:w-10" />
        ) : (
          <Checker color="black" className="h-6 w-6 sm:h-10 sm:w-10" />
        )}
      </div>

      {/* ПРАВЫЙ ИНФО-БЛОК */}
      <div className="flex flex-col items-end gap-2">

        {/* ИГРОКИ */}
        <div className="flex items-center gap-0 sm:gap-2">

          {/* БЕЛЫЙ */}
          {whitePlayer && (
            <PlayerCard
              player={whitePlayer}
              active={state?.currentPlayer === "w"}
              killed={killed.b}
              color="w"
            />
          )}

          <span className="text-white font-bold text-lg opacity-80">VS</span>

          {/* ЧЁРНЫЙ */}
          {blackPlayer && (
            <PlayerCard
              player={blackPlayer}
              active={state?.currentPlayer === "b"}
              killed={killed.w}
              color="b"
            />
          )}
        </div>

      </div>




    </div>

  );
}
