import { useEffect, useRef } from "react";
import { useSound } from "@/hooks/useSound";
import { useNavigate } from "react-router-dom";

import { useGameStore } from "@/store/useGameStore";
import { useSearchParams } from "react-router-dom";

import { GameHeader } from "@/pages/Game/GameHeader/Header";
import { BoardCanvas } from "@/pages/Game/BoardCanvas/BoardCanvas";

import type { CheckersState, Position, GameMode } from "@/types/types";
import Modal from "@/components/modal";

export default function Game() {
  const {
    connect,
    initPlayer,
    game,
    player,
    sounds,
    toggleSounds,
    selectPiece,
    makeMove,
    restartGame
  } = useGameStore();

  const navigate = useNavigate();
  const prevMovesRef = useRef(0);

  const [searchParams] = useSearchParams();
  const modeParams = searchParams.get("mode") as GameMode; // "pve" | "eve"

  const mode = modeParams || "pve";
  const playMoveSound = useSound("/games/checkers/sounds/move.mp3");

  useEffect(() => {
    initPlayer();
    connect(mode);
  }, [mode]);

  useEffect(() => {
    const { resumeGame } = useGameStore.getState();
    resumeGame();

    return () => {
      const { pauseGame } = useGameStore.getState();
      pauseGame();
    };
  }, []);

  useEffect(() => {
    if (!game?.history) return;

    const currentMoves = game.history.length;  

    // если появился новый ход → играем звук
    if (currentMoves > prevMovesRef.current && sounds) {
      playMoveSound();
    }

    prevMovesRef.current = currentMoves;
  }, [game?.history]);


  const leave = () => {
    navigate("/home");
  }

  if (!game) {
    return null
  }

  const checkersState = game.state as CheckersState | undefined;

  if (!checkersState) {
    return (
      <h1 className="text-3xl p-10 text-center text-red-500">
        Состояние игры не загружено
      </h1>
    );
  }

  /* ------------------- клики ------------------- */
  const handleCellClick = (row: number, col: number) => {
    if (mode === "eve") return; // 

    if (!player) return;

    const currentPlayerColor =
      game.players[0]?.id === player.id ? "w" : "b";

    if (currentPlayerColor !== checkersState.currentPlayer) return;

    const cell = checkersState.board[row][col];
    const pos: Position = { row, col };

    if (cell === checkersState.currentPlayer) {
      selectPiece(pos);
      return;
    }

    if (
      checkersState.availableMoves?.some(
        (m) => m.row === row && m.col === col
      )
    ) {
      if (!checkersState.selected) return;

      makeMove({
        playerId: player.id,
        payload: {
          from: checkersState.selected,
          to: pos,
        },
      });
    }
  };

  let playerColor: "w" | "b" = "w";

  if (mode === "pve" && player && game.players.length > 0) {
    playerColor =
      game.players[0].id === player.id ? "w" : "b";
  }

  if (mode === "eve") {
    playerColor = "w"; // белые снизу всегда
  }

  return (
    <div className="flex flex-col py-4 gap-4 px-2.5 sm:px-[1.25rem] min-w-[20rem]">
      <GameHeader game={game} onRestart={restartGame} toggleSounds={toggleSounds} sounds={sounds} />

      <BoardCanvas
        board={checkersState.board}
        selected={checkersState.selected ?? null}
        availableMoves={checkersState.availableMoves ?? []}
        onCellClick={handleCellClick}
        playerColor={playerColor}
        mandatoryPieces={checkersState.mandatoryPieces ?? []}
      />

      {checkersState.completed && checkersState.winner && (
        <Modal state={checkersState} onRestart={restartGame} onLeave={leave} />
      )}
    </div>
  );
}