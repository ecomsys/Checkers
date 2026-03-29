
import type { Player } from "@/types/types";
import { Checker } from "./Checker";
// ------------------- КАРТОЧКА ИГРОКА -------------------
export function PlayerCard({
  player,
  active,
  killed,
  color
}: {
  player: Player;
  active?: boolean;
  killed: number;
  color: "w" | "b";
}) {
  return (
    <div className="flex flex-col items-center gap-1 min-w-[4.375rem]">

      <img
        src={player.photo_url}
        className={`
          w-8 h-8 sm:w-10 sm:h-10
          rounded-full object-cover
          outline-2
          ${active ? "outline-green-400 scale-110" : "outline-white/40"}
          transition
        `}
      />

      {/* СЧЁТ */}
      <div className="flex items-center gap-1.5">
        <Checker
          color={color === "w" ? "black" : "white"}
          className="w-5 h-5"
        />
        <span className="text-white text-[1rem] sm:text-[1.125rem] font-bold leading-[1]">{killed}</span>
      </div>
    </div>
  );
}