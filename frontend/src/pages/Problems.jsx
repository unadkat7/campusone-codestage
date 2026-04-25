import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { problemsAPI } from "../services/api";
import ProblemCard from "../components/ProblemCard";
import Navbar from "../components/Navbar";

/**
 * Problems — Brutalist Problem Explorer refactored to clean Tailwind.
 */
function Problems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await problemsAPI.getAll();
        setProblems(res.data);
      } catch (err) {
        setError("CRITICAL_ERROR: DATA_LOAD_FAILED");
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  const filtered = problems.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchDiff = diffFilter === "all" || p.difficulty?.toLowerCase() === diffFilter;
    return matchSearch && matchDiff;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortConfig.key === "id")
      return sortConfig.direction === "asc" ? a._id.localeCompare(b._id) : b._id.localeCompare(a._id);
    if (sortConfig.key === "title")
      return sortConfig.direction === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
    if (sortConfig.key === "difficulty") {
      const order = { easy: 1, medium: 2, hard: 3 };
      const va = order[a.difficulty?.toLowerCase()] || 0;
      const vb = order[b.difficulty?.toLowerCase()] || 0;
      return sortConfig.direction === "asc" ? va - vb : vb - va;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const sortArrow = (key) => {
    if (sortConfig.key !== key) return "[_]";
    return sortConfig.direction === "asc" ? "[▲]" : "[▼]";
  };

  const counts = {
    easy:   problems.filter((p) => p.difficulty?.toLowerCase() === "easy").length,
    medium: problems.filter((p) => p.difficulty?.toLowerCase() === "medium").length,
    hard:   problems.filter((p) => p.difficulty?.toLowerCase() === "hard").length,
    solved: problems.filter((p) => p.isSolved).length,
  };

  return (
    <div className="min-h-screen bg-mesh-brutal flex flex-col font-mono text-white">
      <Navbar />

      <main className="flex-1 p-8 max-w-5xl mx-auto w-full">

        {/* ── Page Header ── */}
        <section className="mb-10">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
            [ PROBLEM_SET ]
          </h1>
          <div className="text-[10px] text-text-dim font-black uppercase tracking-widest leading-loose">
            SCANNING_DIRECTORY... {problems.length} ENTRIES_DETECTED // STATUS: NOMINAL
          </div>
        </section>

        {/* ── Global Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-8">
          <StatBox label="TOTAL_SOLVED" value={counts.solved} colorClass="text-accent" />
          <StatBox label="EASY_LEVEL" value={counts.easy} colorClass="text-success" />
          <StatBox label="MEDIUM_LEVEL" value={counts.medium} colorClass="text-yellow-500" />
          <StatBox label="HARD_LEVEL" value={counts.hard} colorClass="text-error" />
        </div>

        {/* ── Controls ── */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
             <input
              type="text"
              placeholder="SEARCH_BY_OBJECTIVE..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-brutal border-2 h-11"
            />
          </div>

          <div className="flex bg-border p-0.5 gap-0.5 self-start md:self-stretch">
            {["all", "easy", "medium", "hard"].map((d) => (
              <button
                key={d}
                onClick={() => setDiffFilter(d)}
                className={`px-4 h-10 text-[10px] font-black uppercase transition-all duration-75 ${
                  diffFilter === d ? "bg-accent text-black" : "bg-black text-text-muted hover:text-white"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* ── Dataset ── */}
        <div className="border-2 border-border bg-black">
          {loading ? (
            <div className="p-20 text-center text-text-dim text-xs font-black animate-pulse">
               FETCHING_DATA_STREAM...
            </div>
          ) : error ? (
            <div className="p-20 text-center text-error text-xs font-black">
              {error}
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead className="border-b-2 border-border bg-surface">
                <tr>
                  <th className="th-brutal" onClick={() => requestSort("id")}>
                    #ID {sortArrow("id")}
                  </th>
                  <th className="th-brutal text-left" onClick={() => requestSort("title")}>
                    SYSTEM_TITLE {sortArrow("title")}
                  </th>
                  <th className="th-brutal text-center" onClick={() => requestSort("difficulty")}>
                    COMPLEXITY {sortArrow("difficulty")}
                  </th>
                  <th className="th-brutal"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sorted.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-20 text-center text-text-dim text-xs font-black uppercase tracking-widest">
                      // NO_MATCHING_OBJECTIVES_FOUND
                    </td>
                  </tr>
                ) : (
                  sorted.map((p, i) => (
                    <ProblemCard key={p._id} problem={p} index={i} />
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer Info */}
        {!loading && (
          <div className="mt-4 text-[9px] text-text-dim text-right font-black tracking-widest">
            DISPLAYING {sorted.length} / {problems.length} ENTRIES
          </div>
        )}
      </main>
    </div>
  );
}

function StatBox({ label, value, colorClass }) {
  return (
    <div className="border border-border bg-[#050505] p-4 flex flex-col gap-1 transition-colors hover:border-accent/30">
      <div className="text-[9px] font-black text-text-dim tracking-tight">{label}</div>
      <div className={`text-2xl font-black ${colorClass}`}>{value}</div>
    </div>
  );
}

// Add th-brutal to @layer components in index.css if needed, or use inline classes.
// I'll use a local constant for now since I didn't add th-brutal to index.css yet.
const thStyle = "px-4 py-3 text-[10px] font-black text-text-dim uppercase tracking-widest cursor-pointer select-none hover:text-white transition-colors duration-75";

export default Problems;
