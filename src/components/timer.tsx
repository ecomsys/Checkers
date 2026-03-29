// src/components/Timer.tsx
import { type FC } from "react";

interface TimerProps {
  /** Время в секундах */
  time: number;

}

const Timer: FC<TimerProps> = ({ time }) => {
  const minutes = Math.floor(time / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (time % 60).toString().padStart(2, "0");

  return (
    <div className="flex items-center gap-3 text-white" title="Время игры">
      <svg className="w-[2.5rem] h-[2.5rem]">
        <use xlinkHref={`${import.meta.env.BASE_URL}/icons/sprite/sprite.svg#clock`} />
      </svg>
      <span className="min-w-[3.625rem] font-bold text-[2.1875rem] ">{minutes}:{seconds}</span>
    </div>
  );
};

export default Timer;
