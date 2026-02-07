import { useEffect, useRef, useState } from "react";

const PRESETS = {
  "Bullet": 1 * 60 * 1000,
  "Rapid": 10 * 60 * 1000,
  "15 min": 15 * 60 * 1000,
};

export default function ChessClock() {
  const [time1, setTime1] = useState(PRESETS["Bullet"]);
  const [time2, setTime2] = useState(PRESETS["Bullet"]);
  const [activePlayer, setActivePlayer] = useState(null); // 1 | 2 | null
  const [gameOver, setGameOver] = useState(false);

  const intervalRef = useRef(null);

  // ⏱️ Timer effect
  useEffect(() => {
    if (!activePlayer || gameOver) return;

    intervalRef.current = setInterval(() => {
      if (activePlayer === 1) {
        setTime1((t) => {
          if (t <= 100) {
            endGame();
            return 0;
          }
          return t - 100;
        });
      } else {
        setTime2((t) => {
          if (t <= 100) {
            endGame();
            return 0;
          }
          return t - 100;
        });
      }
    }, 100);

    return () => clearInterval(intervalRef.current);
  }, [activePlayer, gameOver]);

  // ⌨️ Space key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code !== "Space") return;
      e.preventDefault();

      if (gameOver) return; // 🚫 stop switching after timeout

      setActivePlayer((prev) => {
        if (prev === 1) return 2;
        if (prev === 2) return 1;
        return 1; // first press starts game
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver]);

  const endGame = () => {
    clearInterval(intervalRef.current);
    setActivePlayer(null);
    setGameOver(true);
  };

  const reset = (preset) => {
    clearInterval(intervalRef.current);
    setTime1(preset);
    setTime2(preset);
    setActivePlayer(null);
    setGameOver(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-900 text-white gap-6">
      <h1 className="text-3xl font-bold">Chess Clock</h1>

      <div className="flex gap-6">
        <Clock label="Player 1" time={time1} active={activePlayer === 1} />
        <Clock label="Player 2" time={time2} active={activePlayer === 2} />
      </div>

      {gameOver && (
        <p className="text-red-400 text-lg font-semibold">
          ⛔ Time over
        </p>
      )}

      <div className="flex gap-4 mt-4">
        {Object.entries(PRESETS).map(([label, value]) => (
          <button
            key={label}
            onClick={() => reset(value)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            {label}
          </button>
        ))}

        <button
          onClick={() => reset(PRESETS["Bullet"])}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
        >
          Reset
        </button>
      </div>

      <p className="text-sm text-zinc-400 mt-2">
        Press <b>SPACE</b> to switch clocks
      </p>
    </div>
  );
}

function Clock({ label, time, active }) {
  return (
    <div
      className={`w-48 h-32 flex flex-col items-center justify-center rounded-xl border-4
      ${active ? "border-green-500 bg-zinc-800" : "border-zinc-600 bg-zinc-700"}`}
    >
      <div className="text-sm">{label}</div>
      <div className="text-4xl font-mono">{format(time)}</div>
    </div>
  );
}

function format(ms) {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
