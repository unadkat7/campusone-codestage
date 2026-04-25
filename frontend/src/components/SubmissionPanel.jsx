/**
 * SubmissionPanel — Terminal-style result display refactored with Scanning Animations.
 */
function SubmissionPanel({ submission, isPolling, isRunning }) {

  // ── Not yet submitted ──────────────────────────────────────────
  if (!submission) {
    return (
      <div className="border border-dashed border-border p-8 text-center font-mono text-[11px]">
        <div className="text-text-muted font-black tracking-widest">// NO_OUTPUT_RECORDED</div>
        <div className="mt-1 text-text-dim opacity-50 uppercase">awaiting run or submit command...</div>
      </div>
    );
  }

  // ── Polling / Running / Pending (Animated) ──────────────────────
  if (isPolling || isRunning || submission.status === "Pending") {
    return (
      <div className="relative border-2 border-accent bg-accent/5 p-6 border-l-[6px] overflow-hidden">
        {/* Scanning Line Animation */}
        <div className="absolute left-0 w-full h-[2px] bg-accent/30 animate-[scan-line_2s_linear_infinite] pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-4 h-4 border-2 border-black border-t-accent animate-spin shrink-0" />
          <div className="space-y-1">
            <div className="font-black text-sm text-accent uppercase tracking-tighter">
              {isRunning ? "EXEC_IN_PROGRESS" : "JUDGING_IN_PROGRESS"}
              <span className="ml-1 animate-[flicker_0.8s_step-end_infinite]">_</span>
            </div>
            <div className="text-[10px] text-text-dim font-bold tracking-widest uppercase">
              // EVALUATING_SYSTEM_RESPONSE...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Result display ────────────────────────────────────────────
  const status = submission.status;
  const isAccepted = status === "Accepted";
  const isCompileError = status === "Compilation Error";
  const isRuntimeError = status === "Runtime Error";

  const statusColorClass = isAccepted ? "text-success border-success" : "text-error border-error";
  const statusBgClass = isAccepted ? "bg-success/10" : "bg-error/10";

  return (
    <div className={`border-2 border-border bg-black overflow-hidden border-l-[6px] ${isAccepted ? 'border-l-success' : 'border-l-error'}`}>
      {/* ── Status header ── */}
      <div className={`px-4 py-2.5 border-b border-border flex items-center justify-between ${statusBgClass}`}>
        <div className={`font-black text-base uppercase tracking-tighter ${isAccepted ? 'text-success' : 'text-error'}`}>
          [{status}]
        </div>
        {submission._id && (
          <div className="text-[9px] text-text-dim font-black opacity-60 uppercase tracking-widest">
            RECORD_ID: {submission._id.slice(-8).toUpperCase()}
          </div>
        )}
      </div>

      {/* ── Stats ── */}
      {(submission.executionTime || submission.memoryUsed !== undefined || submission.language) && (
        <div className="flex flex-wrap border-b border-border bg-border/20">
          {submission.executionTime && (
            <StatCell label="RUNTIME" value={submission.executionTime} />
          )}
          {submission.memoryUsed !== undefined && submission.memoryUsed !== null && (
            <StatCell label="MEMORY" value={`${submission.memoryUsed} KB`} />
          )}
          {submission.language && (
            <StatCell label="LANG" value={submission.language.toUpperCase()} />
          )}
          {submission.failedTestCase !== undefined && submission.failedTestCase !== null && (
            <StatCell label="FAILED_ON" value={`UNIT_#${submission.failedTestCase}`} colorClass="text-error" />
          )}
        </div>
      )}

      {/* ── Output / Error ── */}
      {submission.output && (
        <div className="p-4">
          <div className="text-[9px] font-black text-text-muted mb-2 uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-text-muted"></span>
            {isCompileError ? "COMPILER_LOG" : isRuntimeError ? "RUNTIME_LOG" : "STDOUT_REPORT"}
          </div>
          <pre className={`bg-[#050505] border border-border p-4 text-[13px] font-mono whitespace-pre-wrap break-all max-h-[300px] overflow-y-auto leading-relaxed custom-scrollbar ${isAccepted ? 'text-success' : 'text-error'}`}>
            {submission.output}
          </pre>
        </div>
      )}
    </div>
  );
}

function StatCell({ label, value, colorClass = "text-white" }) {
  return (
    <div className="bg-black px-4 py-2.5 flex-1 border-r border-border last:border-r-0">
      <div className="text-[9px] text-text-dim font-black uppercase tracking-tight mb-0.5">
        {label}
      </div>
      <div className={`text-xs font-black tracking-tighter ${colorClass}`}>
        {value}
      </div>
    </div>
  );
}

export default SubmissionPanel;
