import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import RouteLoader from "../components/RouteLoader";

/**
 * Login Page — Brutalist Sign-In refactored to clean Tailwind.
 */
function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authAPI.login(formData);
      login(res.data.token, res.data.user);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message?.toUpperCase() || "LOGIN_FAILED");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh-brutal flex items-center justify-center p-6 font-mono text-white">
      {loading && <RouteLoader />}
      <div className="w-full max-w-[380px]">
        
        {/* ── Logo + Header ── */}
        <div className="text-center mb-10">
           <div className="bg-accent text-black px-3 py-1 font-black text-lg inline-block mb-4">
            {">_ CODESTAGE"}
          </div>
          <h1 className="text-sm font-black text-white uppercase tracking-widest">
            [ SYSTEM_AUTHENTICATION ]
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

          <div className="mb-5">
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

          <div className="mb-6">
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

          <button
            type="submit"
            disabled={loading}
            className="btn-brutal w-full justify-center h-12"
          >
            {loading ? "INITIALIZING..." : "LOGIN_TO_SYSTEM"}
          </button>
        </form>

        <p className="text-center mt-6 text-[11px] text-text-dim font-bold uppercase tracking-widest">
          NEW_OPERATOR?{" "}
          <Link to="/signup" className="text-accent underline decoration-accent/30 decoration-2 underline-offset-4 hover:text-white transition-colors">
            [ CREATE_ACCOUNT ]
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
