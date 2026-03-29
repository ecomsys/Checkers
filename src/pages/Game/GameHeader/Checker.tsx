export function Checker({
  color,
  className = "",
}: {
  color: "white" | "black";
  className?: string;
}) {
  const isWhite = color === "white";

  return (
    <div
      className={`
        relative rounded-full flex items-center justify-center shadow-lg
        ${isWhite
          ? "bg-gradient-to-br from-white to-gray-300 border border-gray-400"
          : "bg-gradient-to-br from-gray-800 to-black border border-gray-600"}
        ${className}
      `}
    >
      {/* ВНУТРЕННЕЕ КОЛЬЦО */}
      <div
        className={`
          w-[70%] h-[70%] rounded-full border
          ${isWhite ? "border-gray-400" : "border-gray-500"}
        `}
      />

      {/* БЛИК */}
      <div
        className={`
          absolute top-[15%] left-[20%]
          w-[30%] h-[20%]
          rounded-full blur-[0.0625rem] opacity-70
          ${isWhite ? "bg-white" : "bg-white/30"}
        `}
      />
    </div>
  );
}