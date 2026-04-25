import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { problemsAPI } from "../services/api";
import ProblemCard from "../components/ProblemCard";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

/**
 * Home — Brutalist Developer Dashboard refactored to clean Tailwind.
 */
function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await problemsAPI.getAll();
        setProblems(res.data);
      } catch (_) {}
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const stats = (() => {
    const total  = problems.length;
    const solved = problems.filter((p) => p.isSolved).length;
    const easy   = problems.filter((p) => p.difficulty?.toLowerCase() === "easy" && p.isSolved).length;
    const medium = problems.filter((p) => p.difficulty?.toLowerCase() === "medium" && p.isSolved).length;
    const hard   = problems.filter((p) => p.difficulty?.toLowerCase() === "hard" && p.isSolved).length;
    return { total, solved, remaining: total - solved, rate: total > 0 ? Math.round((solved / total) * 100) : 0, easy, medium, hard };
  })();

  const curated = problems.slice(0, 6);

  return (
    <div className="min-h-screen bg-mesh-brutal flex flex-col font-mono text-white">
      <Navbar />

      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        
        {/* ── Header ── */}
        <header className="mb-10 border-l-4 border-accent pl-5">
          <div className="text-[10px] text-text-dim font-black mb-1 uppercase tracking-widest">
            SYSTEM_ACCESS_GRANTED // SESSION_ACTIVE
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
            WELCOME_BACK, <span className="text-accent">{user?.name?.toUpperCase()}</span>
          </h1>
          <div className="mt-2 text-xs text-text-muted font-bold tracking-tight">
            STATUS: [SOLVED: {stats.solved}] [REMAINING: {stats.remaining}] [EFFICIENCY: {stats.rate}%]
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ── Left Column: Challenges ── */}
          <section className="lg:col-span-2">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-black uppercase tracking-widest">
                AVAILABLE_CHALLENGES
              </h2>
              <Link to="/problems" className="text-accent text-[10px] font-black hover:underline">
                [ VIEW_ALL_SYSTEMS ]
              </Link>
            </div>

            <div className="border-2 border-border bg-black overflow-hidden">
              {loading ? (
                <div className="p-10 text-center text-text-dim text-xs font-black animate-pulse">
                  LOADING_DATA_STREAM...
                </div>
              ) : (
                <table className="w-full border-collapse">
                   <thead className="border-b-2 border-border bg-surface">
                    <tr>
                      <th className="px-4 py-2.5 text-[10px] font-black text-text-dim uppercase text-left border-r border-border w-12">#ID</th>
                      <th className="px-4 py-2.5 text-[10px] font-black text-text-dim uppercase text-left">SYSTEM_OBJECTIVE</th>
                      <th className="px-4 py-2.5 text-[10px] font-black text-text-dim uppercase text-center w-24">COMPLEXITY</th>
                      <th className="px-4 py-2.5 text-[10px] font-black text-text-dim uppercase text-right w-20"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {curated.map((p, i) => (
                      <ProblemCard key={p._id} problem={p} index={i} />
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          {/* ── Right Column: Stats ── */}
          <aside className="flex flex-col gap-6">
            
            <div className="card-brutal p-5">
              <h3 className="text-[11px] font-black mb-4 border-b border-border pb-2 text-text-muted tracking-widest">
                CORE_METRICS
              </h3>
              <div className="flex flex-col gap-4">
                <MetricRow label="TOTAL_SOLVED" value={stats.solved} colorClass="text-success" />
                <MetricRow label="COMPLETION" value={`${stats.rate}%`} colorClass="text-accent" />
                <div className="h-1 bg-border mt-1">
                  <div className="h-full bg-accent transition-all duration-500" style={{ width: `${stats.rate}%` }} />
                </div>
              </div>
            </div>

            <div className="card-brutal p-5">
              <h3 className="text-[11px] font-black mb-4 border-b border-border pb-2 text-text-muted tracking-widest">
                DIFFICULTY_BREAKDOWN
              </h3>
              <div className="flex flex-col gap-2.5">
                <SmallMetric label="EASY" count={stats.easy} colorClass="text-success" borderColorClass="border-success/30" />
                <SmallMetric label="MEDIUM" count={stats.medium} colorClass="text-yellow-500" borderColorClass="border-yellow-500/30" />
                <SmallMetric label="HARD" count={stats.hard} colorClass="text-error" borderColorClass="border-error/30" />
              </div>
            </div>

            <button 
              className="card-brutal-accent p-5 text-left group hover:bg-accent transition-colors duration-100"
              onClick={() => navigate("/problems")}
            >
              <div className="font-black text-sm group-hover:text-black tracking-tighter">EXECUTE_NEURAL_DRILL</div>
              <div className="text-[10px] mt-1 text-text-muted group-hover:text-black/80 font-bold uppercase tracking-tight">
                Initiate next unsolved algorithm challenge.
              </div>
            </button>

          </aside>
        </div>
      </main>

      <footer className="p-6 border-t border-border text-center text-[10px] text-text-dim font-black tracking-[0.2em]">
        CODESTAGE_V4.0 // AGGRESSIVE_INTERRUPT // © 2026
      </footer>
    </div>
  );
}

function MetricRow({ label, value, colorClass }) {
  return (
    <div className="flex justify-between items-end">
      <span className="text-[10px] font-black text-text-dim tracking-widest">{label}</span>
      <span className={`text-2xl font-black leading-none ${colorClass}`}>{value}</span>
    </div>
  );
}

function SmallMetric({ label, count, colorClass, borderColorClass }) {
  return (
    <div className={`flex justify-between items-center border border-border px-3 py-2 bg-black hover:${borderColorClass} transition-colors group`}>
      <span className="text-[9px] font-black text-text-muted group-hover:text-white transition-colors">{label}</span>
      <span className={`text-xs font-black ${colorClass}`}>{count}</span>
    </div>
  );
}

export default Home;
