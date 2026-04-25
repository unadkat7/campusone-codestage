import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { problemsAPI, submissionsAPI } from "../services/api";
import CodeEditor, { LANGUAGES, STARTER_CODE } from "../components/CodeEditor";
import SubmissionPanel from "../components/SubmissionPanel";
import Navbar from "../components/Navbar";
import { DifficultyBadge } from "../components/ProblemCard";
import { useToast } from "../context/ToastContext";

const POLL_INTERVAL = 2000;
const DRAFT_KEY_PREFIX = "codestage_draft_";

/**
 * ProblemDetails — Brutalist Coding Workspace with Terminal-Stage Returns.
 * This architecture ensures 100% stable hook ordering across all loading/error states.
 */
function ProblemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  // 1. DATA STATE
  const [problem, setProblem] = useState(null);
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. EDITOR STATE — Restore draft from localStorage if available
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY_PREFIX + id);
      if (saved) return JSON.parse(saved).language || LANGUAGES[0].id;
    } catch {}
    return LANGUAGES[0].id;
  });
  const [code, setCode] = useState(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY_PREFIX + id);
      if (saved) return JSON.parse(saved).code || STARTER_CODE[LANGUAGES[0].id];
    } catch {}
    return STARTER_CODE[LANGUAGES[0].id];
  });
  const [draftSaved, setDraftSaved] = useState(false);

  // 3. SUBMISSION / EXECUTION STATE
  const [submission, setSubmission] = useState(null);
  const [isPolling, setIsPolling] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // 4. UI / LAYOUT STATE
  const [activeTab, setActiveTab] = useState("description");
  const [leftWidth, setLeftWidth] = useState(38);
  const [topHeight, setTopHeight] = useState(62);
  const [isResizingH, setIsResizingH] = useState(false);
  const [isResizingV, setIsResizingV] = useState(false);
  const [spinnerIdx, setSpinnerIdx] = useState(0);

  // 5. REFS
  const pollRef = useRef(null);
  const containerRef = useRef(null);
  const rightPanelRef = useRef(null);

  // 6. DERIVED STATE
  const isAnyBusy = submitting || isPolling || isRunning;

  // 7. EFFECTS
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [probRes, statsRes, histRes] = await Promise.allSettled([
          problemsAPI.getById(id),
          problemsAPI.getStats(id),
          submissionsAPI.getHistory(id),
        ]);
        if (probRes.status === "fulfilled") setProblem(probRes.value.data);
        if (statsRes.status === "fulfilled") setStats(statsRes.value.data);
        if (histRes.status === "fulfilled") setHistory(histRes.value.data);
      } catch (_) {}
      finally { setLoading(false); }
    };
    fetchAll();
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [id]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey && e.key === "'") {
        e.preventDefault();
        handleRun();
      } else if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [code, language]);

  useEffect(() => {
    if (isResizingH || isResizingV) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
    } else {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    }
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizingH, isResizingV]);

  useEffect(() => {
    let interval;
    if (isAnyBusy) {
      interval = setInterval(() => setSpinnerIdx((s) => (s + 1) % 4), 100);
    } else {
      setSpinnerIdx(0);
    }
    return () => clearInterval(interval);
  }, [isAnyBusy]);

  // 7b. AUTO-SAVE DRAFT — persist code to localStorage on every change
  useEffect(() => {
    // Only save if the user has actually typed something different from the starter code
    const draft = JSON.stringify({ code, language });
    localStorage.setItem(DRAFT_KEY_PREFIX + id, draft);
    setDraftSaved(true);
    const timer = setTimeout(() => setDraftSaved(false), 1500);
    return () => clearTimeout(timer);
  }, [code, language, id]);

  // 8. CALLBACKS
  const handleLanguageChange = useCallback((newLang) => {
    setLanguage(newLang);
    setCode(STARTER_CODE[newLang] || "");
    // Clear draft when switching language so the new starter code takes effect
    localStorage.removeItem(DRAFT_KEY_PREFIX + id);
  }, [id]);

  const handleResetCode = useCallback(() => {
    setCode(STARTER_CODE[language] || "");
    localStorage.removeItem(DRAFT_KEY_PREFIX + id);
    addToast("Code reset to default template", "info");
  }, [language, id, addToast]);

  const startPolling = useCallback((submissionId) => {
    setIsPolling(true);
    pollRef.current = setInterval(async () => {
      try {
        const res = await submissionsAPI.getById(submissionId);
        const data = res.data;
        if (data.status !== "Pending") {
          clearInterval(pollRef.current);
          setIsPolling(false);
          setSubmission(data);
          if (data.status === "Accepted") setSubmitSuccess(true);
          const [histRes, statsRes] = await Promise.allSettled([
            submissionsAPI.getHistory(id),
            problemsAPI.getStats(id),
          ]);
          if (histRes.status === "fulfilled") setHistory(histRes.value.data);
          if (statsRes.status === "fulfilled") setStats(statsRes.value.data);
        }
      } catch {
        clearInterval(pollRef.current);
        setIsPolling(false);
      }
    }, POLL_INTERVAL);
  }, [id]);

  const handleSubmit = useCallback(async () => {
    if (!code.trim()) { setSubmitError("ERROR: EMPTY_CODE_BLOCK"); return; }
    setSubmitError("");
    setSubmitting(true);
    setSubmission(null);
    setSubmitSuccess(false);
    try {
      const res = await submissionsAPI.create({ problemId: id, code, language });
      setSubmission({ status: "Pending", _id: res.data.submissionId });
      startPolling(res.data.submissionId);
    } catch (err) {
      setSubmitError(err.response?.data?.message || "SUBMISSION_FAILED");
    } finally { setSubmitting(false); }
  }, [code, id, language, startPolling]);

  const handleRun = useCallback(async () => {
    if (!code.trim()) { setSubmitError("ERROR: EMPTY_CODE_BLOCK"); return; }
    setSubmitError("");
    setIsRunning(true);
    setSubmission(null);
    setSubmitSuccess(false);
    try {
      const res = await submissionsAPI.runCode({ problemId: id, code, language });
      setSubmission(res.data);
    } catch (err) {
      setSubmitError(err.response?.data?.message || "EXEC_FAILURE");
    } finally { setIsRunning(false); }
  }, [code, id, language]);

  const startResizingH = useCallback(() => setIsResizingH(true), []);
  const startResizingV = useCallback(() => setIsResizingV(true), []);
  const stopResizing = useCallback(() => { setIsResizingH(false); setIsResizingV(false); }, []);

  const resize = useCallback((e) => {
    if (isResizingH && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const newW = ((e.clientX - rect.left) / rect.width) * 100;
      if (newW > 20 && newW < 80) setLeftWidth(newW);
    }
    if (isResizingV && rightPanelRef.current) {
      const rect = rightPanelRef.current.getBoundingClientRect();
      const newH = ((e.clientY - rect.top) / rect.height) * 100;
      if (newH > 15 && newH < 85) setTopHeight(newH);
    }
  }, [isResizingH, isResizingV]);

  // ── 9. TERMINAL-STAGE RETURNS ──
  // These must stay below ALL hook calls to prevent "Rule of Hooks" violations.
  if (loading) return <div className="h-screen bg-black text-accent p-8 font-mono text-xs animate-pulse tracking-widest">SCANNING_VIRTUAL_MACHINE...</div>;
  if (!problem) return <div className="h-screen bg-black text-error p-8 font-mono text-xs tracking-widest border-l-4 border-error">404_OBJECT_NOT_FOUND</div>;

  const spinnerFrame = ["/", "-", "\\", "|"][spinnerIdx];

  return (
    <div className="h-screen bg-mesh-brutal flex flex-col overflow-hidden font-mono text-white">
      <Navbar />

      <div
        ref={containerRef}
        className={`flex-1 flex overflow-hidden ${isResizingH || isResizingV ? 'select-none' : 'select-auto'}`}
      >
        {/* ── LEFT: PROBLEM PANEL ── */}
        <div
          className="flex flex-col border-r-2 border-border bg-black min-w-[300px]"
          style={{ width: `${leftWidth}%` }}
        >
          {/* Header */}
          <div className="p-4 border-b-2 border-border">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-xl font-black uppercase tracking-tighter line-clamp-1">{problem.title}</h1>
              <DifficultyBadge difficulty={problem.difficulty} />
            </div>
            {stats && (
              <div className="flex gap-3 text-[10px] text-text-dim font-black uppercase tracking-tight">
                <span>SOLVED: {stats.acceptedSubmissions}</span>
                <span>ATTEMPTS: {stats.totalSubmissions}</span>
                <span className="text-accent underline decoration-accent/30 decoration-2 underline-offset-4">RATE: {stats.acceptanceRate}</span>
              </div>
            )}
          </div>

          {/* Tab Bar */}
          <div className="flex bg-surface border-b border-border">
            {["description", "testcases", "history"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-[10px] font-black uppercase border-r border-border cursor-pointer transition-colors ${
                  activeTab === tab ? "bg-black text-accent border-b border-b-accent" : "text-text-muted hover:bg-black/40"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-5 custom-scrollbar">
            {activeTab === "description" && <DescriptionTab problem={problem} />}
            {activeTab === "testcases"   && <TestCasesTab testCases={problem.testCases} />}
            {activeTab === "history"     && <HistoryTab history={history} />}
          </div>
        </div>

        {/* Resizer H */}
        <div 
          onMouseDown={startResizingH} 
          className="w-1 cursor-col-resize hover:bg-accent transition-colors active:bg-accent h-full"
        />

        {/* ── RIGHT: EDITOR + OUTPUT ── */}
        <div
          ref={rightPanelRef}
          className="flex-1 flex flex-col min-w-0"
        >
          {/* Top Panel: Editor */}
          <div 
            className="flex flex-col min-h-[100px]"
            style={{ height: `${topHeight}%` }}
          >
            <div className="px-4 py-1.5 bg-surface border-b border-border flex justify-between items-center z-10">
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-black text-accent border border-border text-[10px] font-black px-2 py-0.5 outline-none focus:border-accent appearance-none cursor-pointer hover:bg-border/20 transition-colors"
                style={{ backgroundImage: 'linear-gradient(45deg, transparent 50%, var(--color-accent) 50%), linear-gradient(135deg, var(--color-accent) 50%, transparent 50%)', backgroundPosition: 'calc(100% - 15px) calc(1em + 2px), calc(100% - 10px) calc(1em + 2px)', backgroundSize: '5px 5px, 5px 5px', backgroundRepeat: 'no-repeat' }}
              >
                {LANGUAGES.map((l) => <option key={l.id} value={l.id} className="bg-black">{l.label.toUpperCase()}</option>)}
              </select>
              
              <div className="flex items-center gap-2.5">
                {draftSaved && (
                  <span className="text-[9px] font-black text-success/60 tracking-widest animate-pulse">
                    [DRAFT_SAVED]
                  </span>
                )}
                <button
                  onClick={handleResetCode}
                  disabled={isAnyBusy}
                  className="btn-brutal-secondary h-7 px-3 text-[9px]"
                  title="Reset code to default template"
                >
                  RESET_CODE
                </button>
                <button 
                  onClick={handleRun} 
                  disabled={isAnyBusy}
                  className="btn-brutal-secondary h-7 px-3 text-[9px]"
                >
                  {isRunning ? `[ ${spinnerFrame} ] RUNNING...` : "RUN_CODE"}
                </button>
                <button 
                  onClick={handleSubmit} 
                  disabled={isAnyBusy}
                  className="btn-brutal h-7 px-3 text-[9px]"
                >
                  {submitting || isPolling ? `[ ${spinnerFrame} ] JUDGING...` : submitSuccess ? "[ACCEPTED]" : "SUBMIT_UNIT"}
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <CodeEditor code={code} setCode={setCode} language={language} height="100%" />
            </div>
          </div>

          {/* Resizer V */}
          <div 
            onMouseDown={startResizingV} 
            className="h-1 cursor-row-resize hover:bg-accent transition-colors active:bg-accent border-y border-border"
          />

          {/* Bottom Panel: Output */}
          <div className="flex-1 bg-black overflow-hidden flex flex-col">
            <div className="terminal-header">
              STDOUT // TERMINAL_OUTPUT
            </div>
            <div className="flex-1 overflow-auto p-4 custom-scrollbar">
              {submitError && (
                <div className="text-error font-black text-xs mb-3 border border-error p-3 bg-error/10 uppercase tracking-tighter">
                  ERROR: {submitError}
                </div>
              )}
              <SubmissionPanel submission={submission} isPolling={isPolling} isRunning={isRunning} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Tabs ──

function DescriptionTab({ problem }) {
  return (
    <div className="font-mono text-xs leading-relaxed text-text-muted space-y-6">
      <div className="whitespace-pre-wrap">{problem.description}</div>
      
      {problem.sampleInput && (
        <section>
          <div className="text-[10px] font-black text-accent mb-1.5 tracking-widest">// SAMPLE_INPUT</div>
          <pre className="bg-[#050505] border border-border p-3 text-xs text-text overflow-auto select-all">{problem.sampleInput}</pre>
        </section>
      )}
      
      {problem.sampleOutput && (
        <section>
          <div className="text-[10px] font-black text-success mb-1.5 tracking-widest">// SAMPLE_OUTPUT</div>
          <pre className="bg-[#050505] border border-border p-3 text-xs text-success overflow-auto select-all">{problem.sampleOutput}</pre>
        </section>
      )}
      
      {problem.constraints && (
        <section className="bg-surface/30 p-3 border-l-2 border-border">
          <div className="text-[10px] font-black text-text-dim mb-1.5 tracking-widest uppercase">// CONSTRAINTS</div>
          <p className="whitespace-pre-wrap text-[11px] text-text-dim font-bold">{problem.constraints}</p>
        </section>
      )}
    </div>
  );
}

function TestCasesTab({ testCases }) {
  if (!testCases || testCases.length === 0) return <div className="text-text-dim text-xs font-black">// NO_VISUAL_TEST_CASES_FOUND</div>;
  return (
    <div className="space-y-4">
      {testCases.map((tc, i) => (
        <div key={i} className="border border-border p-3 group hover:border-accent/40 transition-colors">
          <div className="text-[9px] font-black text-text-dim mb-2 uppercase tracking-widest">TEST_CASE_{i + 1}</div>
          <div className="grid grid-cols-2 gap-3 mt-1">
            <div className="space-y-1">
              <div className="text-[8px] font-black text-text-muted flex items-center gap-1.5"><span className="w-1 h-1 bg-text-muted"></span> INPUT</div>
              <pre className="bg-[#080808] p-2 text-[11px] border border-border overflow-auto max-h-32 select-all">{tc.input}</pre>
            </div>
            <div className="space-y-1">
              <div className="text-[8px] font-black text-success flex items-center gap-1.5"><span className="w-1 h-1 bg-success"></span> EXPECTED</div>
              <pre className="bg-[#080808] p-2 text-[11px] border border-border text-success overflow-auto max-h-32 select-all">{tc.output}</pre>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function HistoryTab({ history }) {
  if (!history || history.length === 0) return <div className="text-text-dim text-xs font-black">// NO_SUBMISSION_HISTORY_FOUND</div>;
  return (
    <div className="space-y-2">
      {history.map((sub, i) => (
        <div key={i} className="border border-border px-4 py-2.5 flex justify-between items-center hover:bg-surface/20 transition-colors cursor-pointer group">
          <span className={`text-[11px] font-black uppercase tracking-tight ${sub.status === "Accepted" ? "text-success" : "text-error"}`}>
            [{sub.status}]
          </span>
          <div className="flex items-center gap-4">
             <span className="text-[10px] text-text-dim group-hover:text-text transition-colors">
               {sub.executionTime || "0ms"} / {(sub.memoryUsed / 1024).toFixed(1)}MB
             </span>
             <span className="text-[9px] text-text-dim opacity-40">
               {new Date(sub.createdAt).toLocaleDateString()}
             </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProblemDetails;
