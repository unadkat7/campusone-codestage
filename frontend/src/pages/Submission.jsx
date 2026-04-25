import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { submissionsAPI } from "../services/api";

/**
 * Submission — Brutalist Record View refactored to clean Tailwind.
 */
function Submission() {
  const { submissionId } = useParams();
  const navigate = useNavigate();

  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await submissionsAPI.getById(submissionId);
        setSubmission(res.data);
      } catch (err) {
        setError("ERROR: ACCESS_DENIED // RECORD_NOT_FOUND");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [submissionId]);

  const statusColorClass = (s) => {
    if (s === "Accepted") return "text-success border-success";
    if (s === "Pending")  return "text-accent border-accent";
    return "text-error border-error";
  };

  const statusTextColor = (s) => {
    if (s === "Accepted") return "text-success";
    if (s === "Pending")  return "text-accent";
    return "text-error";
  };

  return (
    <div className="min-h-screen bg-black font-mono text-white">
      <Navbar />

      <main className="max-w-3xl mx-auto p-10">
        {/* ── Control Header ── */}
        <div className="mb-10 flex justify-between items-end border-b-2 border-border pb-3">
          <div>
            <div className="text-[10px] font-black text-text-dim mb-1 uppercase tracking-widest">
              SYSTEM_REPORT // SUBMISSION_ID: {submissionId?.toUpperCase()}
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">
              [ VIEW_RECORD ]
            </h1>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="btn-brutal-secondary h-8"
          >
            [ GO_BACK ]
          </button>
        </div>

        {loading ? (
          <div className="text-accent p-10 text-center text-xs font-black animate-pulse tracking-widest">
            RETRIEVING_DATA_STREAM...
          </div>
        ) : error ? (
          <div className="border-2 border-error p-5 text-error font-black bg-error/10 uppercase tracking-tighter">
            {error}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            
            {/* ── Status Banner ── */}
            <div className={`bg-black border-2 border-border border-l-8 p-6 ${statusColorClass(submission.status).split(' ')[1]}`}>
              <div className="text-[11px] font-black text-text-dim mb-2 uppercase tracking-widest">
                EXECUTION_STATUS:
              </div>
              <div className={`text-4xl font-black uppercase tracking-tighter ${statusTextColor(submission.status)}`}>
                [{submission.status}]
              </div>
              {submission.createdAt && (
                <div className="text-[10px] text-text-muted mt-3 font-bold tracking-widest">
                  TIMESTAMP: {new Date(submission.createdAt).toISOString().replace("T", " ").split(".")[0]}
                </div>
              )}
            </div>

            {/* ── Metrics Grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <MetricBox label="LANGUAGE" value={submission.language?.toUpperCase()} />
              <MetricBox label="EXEC_TIME" value={submission.executionTime || "N/A"} />
              <MetricBox label="MEM_USAGE" value={submission.memoryUsed != null ? `${submission.memoryUsed} KB` : "N/A"} />
              {submission.failedTestCase != null && (
                <MetricBox label="FAILED_UNIT" value={`TEST_#${submission.failedTestCase}`} colorClass="text-error" />
              )}
            </div>

            {/* ── Log / Stdout ── */}
            {submission.output && (
              <div className="border-2 border-border bg-black group">
                <div className="terminal-header">
                  LOG_OUTPUT // STDOUT_STDERR
                </div>
                <pre className={`p-5 text-sm m-0 overflow-auto whitespace-pre-wrap break-all bg-[#050505] leading-relaxed custom-scrollbar max-h-[400px] ${submission.status === "Accepted" ? "text-success" : "text-error"}`}>
                  {submission.output}
                </pre>
              </div>
            )}

            <div className="border border-border p-4 text-center text-[10px] text-text-dim font-black uppercase tracking-[0.3em]">
              END_OF_REPORT // CodeStage Systems Engineering
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function MetricBox({ label, value, colorClass = "text-white" }) {
  return (
    <div className="border-2 border-border p-4 bg-surface hover:border-accent/40 transition-colors">
      <div className="text-[9px] text-text-dim font-black mb-1 tracking-widest">{label}</div>
      <div className={`text-base font-black ${colorClass} tracking-tight`}>{value}</div>
    </div>
  );
}

export default Submission;
