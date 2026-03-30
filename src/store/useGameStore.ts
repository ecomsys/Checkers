import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  Player,
  Game,
  GameMode,
  Move,
  CheckersMove,
  Position,
  CheckersState,
} from "../types/types";

import type { WorkerRequest, WorkerResponse } from "@/workers/types";
import { generateId } from "@/utils/generate";

interface GameStoreState {
  worker: Worker | null;
  player: Player | null;
  game: Game<CheckersState, CheckersMove> | null;

  sounds: boolean;
  toggleSounds: () => void;
  setSounds: (value: boolean) => void;


  connect: (mode: GameMode) => void;
  initPlayer: () => Player;

  pauseGame: () => void;
  resumeGame: () => void;
  restartGame: () => void;
  selectPiece: (pos: Position) => void;
  makeMove: (move: Move<CheckersMove>) => void;
}

export const useGameStore = create<GameStoreState>()(
  persist(
    (set, get) => ({
      worker: null,
      player: null,
      game: null,
      sounds: true,

      toggleSounds: () => {
        set((state) => ({
          sounds: !state.sounds,
        }));
      },

      setSounds: (value: boolean) => {
        set({ sounds: value });
      },

      /* ---------- player ---------- */
      initPlayer: () => {
        const existing = get().player;
        if (existing) return existing;

        const player: Player = {
          id: generateId(),
          username: "Player",
          photo_url: "/games/checkers/images/webp/avatar.webp",
          isAi: false
        };

        set({ player });
        return player;
      },

      /* ---------- connect worker ---------- */
      connect: (mode: GameMode) => {
        const prevWorker = get().worker;

        if (prevWorker) {
          prevWorker.terminate();
        }

        const worker = new Worker(
          new URL("@/workers/worker.ts", import.meta.url),
          { type: "module" }
        );

        set({ worker });

        worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
          const message = event.data;

          switch (message.type) {
            case "game_updated": {
              set({ game: message.payload });
              break;
            }

            case "game_finished": {
              set((state) => {
                if (!state.game) return state;

                return {
                  game: {
                    ...state.game,
                    status: "finished",
                    winner: message.payload.winnerId,
                  },
                };
              });
              break;
            }
          }
        };

        const player = get().initPlayer();

        worker.postMessage({
          type: "register_player",
          payload: player,
        } satisfies WorkerRequest);

        const existingGame = get().game;

        // КЛЮЧЕВАЯ ЛОГИКА
        if (existingGame) {
          if (existingGame.mode === mode) {
            // ЭТО RELOAD → ВОССТАНАВЛИВАЕМ
            worker.postMessage({
              type: "restore_game",
              payload: existingGame,
            } satisfies WorkerRequest);

            return; // ВАЖНО — не идти дальше
          } else {
            // СМЕНИЛСЯ РЕЖИМ → ЧИСТИМ
            set({ game: null });
          }
        }

        // СОЗДАЁМ НОВУЮ ИГРУ
        worker.postMessage({
          type: "create_game",
          payload: {
            creator: player,
            type: "checkers",
            mode: mode,
          },
        } satisfies WorkerRequest);
      },

      /* ---------- restart new worker ---------- */
      restartGame: () => {
        const { worker, player, game } = get();
        if (!player || !game) return;

        // УБИВАЕМ СТАРЫЙ WORKER
        if (worker) {
          worker.terminate();
        }

        // Чистим состояние
        set({ game: null, worker: null });

        // СОЗДАЁМ НОВЫЙ WORKER
        const newWorker = new Worker(
          new URL("@/workers/worker.ts", import.meta.url),
          { type: "module" }
        );

        set({ worker: newWorker });

        // подписка на сообщения
        newWorker.onmessage = (event: MessageEvent<WorkerResponse>) => {
          const message = event.data;

          switch (message.type) {
            case "game_updated":
              set({ game: message.payload });
              break;

            case "game_finished":
              set((state) => {
                if (!state.game) return state;

                return {
                  game: {
                    ...state.game,
                    status: "finished",
                    winner: message.payload.winnerId,
                  },
                };
              });
              break;
          }
        };

        // регистрируем игрока
        newWorker.postMessage({
          type: "register_player",
          payload: player,
        });

        // создаём новую игру
        newWorker.postMessage({
          type: "create_game",
          payload: {
            creator: player,
            type: "checkers",
            mode: game.mode,
          },
        });
      },

      pauseGame: () => {
        const { worker } = get();
        worker?.postMessage({ type: "pause_game" });
      },

      resumeGame: () => {
        const { worker } = get();
        worker?.postMessage({ type: "resume_game" });
      },

      /* ---------- checkers ---------- */

      selectPiece: (pos) => {
        const { worker, player } = get();
        if (!worker || !player) return;

        worker.postMessage({
          type: "select_piece",
          payload: {
            playerId: player.id,
            pos,
          },
        } satisfies WorkerRequest);
      },

      makeMove: (move) => {
        const { worker } = get();
        if (!worker) return;

        worker.postMessage({
          type: "make_move",
          payload: { move },
        } satisfies WorkerRequest);
      },
    }),
    {
      name: "checkers-storage",
      partialize: (state) => ({
        player: state.player,
        game: state.game,
        sounds: state.sounds,
      }),
    }
  )
);