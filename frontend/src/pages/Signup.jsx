import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import RouteLoader from "../components/RouteLoader";

/**
 * Signup Page — Brutalist Operator Registration refactored to clean Tailwind.
 */
function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password.length < 6) {
      setError("SECURITY_BREACH: PASSWORD_TOO_SHORT_MIN_6_CHAR");
      setLoading(false);
      return;
    }

    try {
      await authAPI.register(formData);
      navigate("/login?registered=1");
    } catch (err) {
      setError(err.response?.data?.message?.toUpperCase() || "REGISTRATION_FAILURE");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh-brutal flex items-center justify-center p-6 font-mono text-white">
      {loading && <RouteLoader />}
      <div className="w-full max-w-[400px]">
        
        {/* ── Logo + Header ── */}
        <div className="text-center mb-10">
           <div className="bg-accent text-black px-3 py-1 font-black text-lg inline-block mb-4">
            {">_ CODESTAGE"}
          </div>
          <h1 className="text-sm font-black text-white uppercase tracking-widest">
            [ REGISTER_NEW_OPERATOR ]
          </h1>
        </div>

        {/* ── Form Card ── */}
        <form
          onSubmit={handleSubmit}
          className="card-brutal bg-black"
        >
          {error && (
            <div className="border border-error p-2.5 mb-5 text-error text-[11px] font-black bg-error/10 uppercase tracking-tight">
              ERROR: {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-[10px] font-black text-text-muted mb-2 uppercase tracking-wide">OPERATOR_NAME</label>
            <input
              type="text"
              name="name"
              placeholder="IDENTIFIER_NAME"
              value={formData.name}
              onChange={handleChange}
              required
              className="input-brutal h-11"
            />
          </div>

          <div className="mb-4">
            <label className="block text-[10px] font-black text-text-muted mb-2 uppercase tracking-wide">EMAIL_ADDRESS</label>
            <input
              type="email"
              name="email"
              placeholder="operator@codestage.sys"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-brutal h-11"
            />
          </div>

          <div className="mb-2">
            <label className="block text-[10px] font-black text-text-muted mb-2 uppercase tracking-wide">ACCESS_KEY</label>
            <input
              type="password"
              name="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              required
              className="input-brutal h-11"
            />
          </div>

          <PasswordStrength password={formData.password} />

          <button
            type="submit"
            disabled={loading}
            className="btn-brutal w-full justify-center h-12 mt-4"
          >
            {loading ? "PROCESSING..." : "COMMIT_REGISTRATION"}
          </button>
        </form>

        <p className="text-center mt-6 text-[11px] text-text-dim font-bold uppercase tracking-widest">
          ALREADY_REGISTERED?{" "}
          <Link to="/login" className="text-accent underline decoration-accent/30 decoration-2 underline-offset-4 hover:text-white transition-colors">
            [ SIGN_IN ]
          </Link>
        </p>
      </div>
    </div>
  );
}

function PasswordStrength({ password }) {
  if (!password) return null;
  const len = password.length;
  const score = (len >= 6 ? 1 : 0) + (len >= 10 ? 1 : 0) + (/[A-Z]/.test(password) ? 1 : 0) + (/\d/.test(password) ? 1 : 0);
  const colorClass = score < 2 ? "bg-error" : score < 4 ? "bg-accent" : "bg-success";
  
  return (
    <div className="flex gap-1 mt-1">
      {[...Array(4)].map((_, i) => (
        <div 
          key={i} 
          className={`h-1 flex-1 transition-all duration-200 ${i < score ? colorClass : "bg-border"}`} 
        />
      ))}
    </div>
  );
}

export default Signup;
