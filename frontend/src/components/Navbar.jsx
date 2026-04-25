import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUserId } from "../hooks/useUserId";

/**
 * Navbar — Refactored for Campus One integration (no logout).
 */
function Navbar() {
  const { user } = useAuth();
  const userId = useUserId();

  return (
    <nav className="sticky top-0 z-50 bg-black border-b-2 border-border h-16 flex items-center px-6">
      <div className="flex items-center justify-between w-full">
        
        {/* ── Logo ── */}
        <Link to={`/home/${userId}`} className="flex items-center gap-3 no-underline group">
          <div className="bg-accent text-black p-1.5 font-black text-lg transition-transform group-hover:scale-110">
            {">_"}
          </div>
          <span className="text-white font-black text-xl tracking-tighter uppercase">
            CODESTAGE
          </span>
        </Link>

        {/* ── Nav Links ── */}
        <div className="flex items-center gap-8">
          <NavLink to={`/home/${userId}`} label="HOME" />
          <NavLink to={`/problems/${userId}`} label="PROBLEMS" />
          <NavLink to={`/profile/${userId}`} label="PROFILE" />
        </div>

        {/* ── User Display ── */}
        <div className="flex items-center gap-6">
          {user && (
            <div className="flex items-center gap-2 border border-border px-3 py-1.5 bg-surface text-[10px] font-black">
              <span className="text-text-dim uppercase tracking-widest">USER:</span>
              <span className="text-accent">{user.name}</span>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}

function NavLink({ to, label }) {
  return (
    <Link
      to={to}
      className="text-text-dim hover:text-accent font-black text-[11px] uppercase tracking-widest transition-colors flex items-center gap-2 group"
    >
      <span className="opacity-0 group-hover:opacity-100 text-accent transition-opacity">[</span>
      {label}
      <span className="opacity-0 group-hover:opacity-100 text-accent transition-opacity">]</span>
    </Link>
  );
}

export default Navbar;
