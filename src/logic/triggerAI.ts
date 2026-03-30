import type { Game, Move, CheckersMove, CheckersState } from "@/types/types";
import { pickAIMove } from "./ai";


export function triggerAIMoveIfNeeded(
  game: Game,
  doMove: (move: Move<CheckersMove>) => void,
  registerTimeout: (id: ReturnType<typeof setTimeout>) => void
) {
  if (!game.state) return;

  const state = game.state as CheckersState;

  if (state.completed) return;

  const isEve = game.mode === "eve";

  const isAITurn =
    isEve || state.currentPlayer === "b";

  if (!isAITurn) return;

  // проверяем есть ли обязательное взятие
  const hasForcedCapture =
    state.forcedPiece ||
    (state.mandatoryPieces && state.mandatoryPieces.length > 0);

  // если нужно бить — быстро
  let delay: number;

  if (hasForcedCapture) {
    delay = 650; // быстро, без раздумий
  } else {
    // обычный "thinking"
    delay = Math.random() * (2000 - 800) + 800;
  }

  const timeoutId = setTimeout(() => {
    const freshState = game.state as CheckersState;
    if (!freshState || freshState.completed) return;

    const payload = pickAIMove(freshState);
    if (!payload) return;

    const aiPlayer =
      freshState.currentPlayer === "w"
        ? game.players[0]
        : game.players[1];

    doMove({
      playerId: aiPlayer.id,
      payload,
    });
  }, delay);
  
  registerTimeout(timeoutId);
}