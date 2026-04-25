import { useNavigate } from "react-router-dom";

/**
 * DifficultyBadge — Refactored to Tailwind.
 */
export function DifficultyBadge({ difficulty }) {
  const d = difficulty?.toLowerCase();
  const colorClass = 
    d === "easy" ? "border-success text-success" : 
    d === "medium" ? "border-yellow-500 text-yellow-500" : 
    "border-error text-error";

  return (
    <span className={`badge-brutal ${colorClass}`}>
      {difficulty?.toUpperCase()}
    </span>
  );
}

/**
 * ProblemCard — Table row refactored to clean Tailwind.
 */
function ProblemCard({ problem, index }) {
  const navigate = useNavigate();
  const handleClick = () => navigate(`/problems/${problem._id}`);

  return (
    <tr
      onClick={handleClick}
      className="group cursor-pointer border-b border-border bg-black hover:bg-surface transition-colors"
    >
      {/* Index */}
      <td className="px-4 py-2.5 text-[11px] font-mono text-text-dim border-r border-border w-12 select-none group-hover:text-accent">
        {String(index + 1).padStart(2, "0")}
      </td>

      {/* Status + Title */}
      <td className="px-4 py-2.5">
        <div className="flex items-center gap-3">
          {/* Solved indicator — Sharp Square */}
          <div
            className={`w-3.5 h-3.5 border flex items-center justify-center shrink-0 ${
              problem.isSolved ? "bg-success border-success" : "bg-transparent border-border"
            }`}
          >
            {problem.isSolved && (
              <svg width="8" height="8" viewBox="0 0 24 24" fill="black">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
            )}
          </div>

          <span className={`text-[13px] font-mono uppercase tracking-tighter transition-colors group-hover:text-accent ${
            problem.isSolved ? "font-normal" : "font-black"
          }`}>
            {problem.title}
          </span>
        </div>
      </td>

      {/* Difficulty */}
      <td className="px-4 py-2.5 w-24 text-center">
        <DifficultyBadge difficulty={problem.difficulty} />
      </td>

      {/* Action Hint */}
      <td className="px-4 py-2.5 text-right w-20">
        <span className="text-[10px] font-black text-text-dim opacity-0 group-hover:opacity-100 transition-opacity">
          OPEN_
        </span>
      </td>
    </tr>
  );
}

export default ProblemCard;
