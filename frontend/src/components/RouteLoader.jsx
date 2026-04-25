import { useState, useEffect } from "react";

const MESSAGES = [
  "INITIALIZING_SYSTEM_CORE...",
  "DECRYPTING_NEURAL_PATHWAYS...",
  "ESTABLISHING_QUANTUM_HANDSHAKE...",
  "SYNCING_DATABASE_CLUSTERS...",
  "ALLOCATING_VIRTUAL_MEMORY...",
  "OPTIMIZING_RENDER_PIPELINE...",
  "BRUTE_FORCING_ACCESS_CORES...",
  "SCAVENGING_MEMORY_LEAKS...",
  "INJECTING_NEURAL_ROUTING...",
  "BYPASSING_FIREWALL_LAYERS..."
];

/**
 * RouteLoader — A full-screen Brutalist transition loader.
 */
function RouteLoader() {
  const [message, setMessage] = useState(MESSAGES[0]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Randomize message once per load
    setMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 100;
        const jump = Math.floor(Math.random() * 15) + 5;
        return Math.min(p + jump, 100);
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-mesh-brutal flex flex-col items-center justify-center font-mono overflow-hidden">
      
      {/* ── Scanning Line ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 right-0 h-[2px] bg-accent/20 blur-[1px] shadow-[0_0_10px_var(--color-accent)] animate-[scan-line_4s_linear_infinite]" />
      </div>

      <div className="w-full max-w-sm px-6">
        
        {/* ── Terminal Block ── */}
        <div className="card-brutal-accent bg-black p-6 relative overflow-hidden">
          
          <div className="terminal-header border-b border-accent/30 mb-4 px-0 pb-2">
            SYSTEM_TRANSITION_IN_PROGRESS
          </div>

          <div className="flex flex-col gap-6">
            
            {/* Glitch Message */}
            <div className="h-10 flex items-center">
              <span className="text-accent text-xs font-black uppercase tracking-tighter glitch-active whitespace-nowrap overflow-hidden">
                {message}
              </span>
            </div>

            {/* Progress Bar Container */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end border-b border-border pb-1">
                <span className="text-[9px] font-black text-text-dim uppercase tracking-widest">
                  LOAD_STATUS
                </span>
                <span className="text-xl font-black text-white">{progress}%</span>
              </div>
              
              <div className="h-4 bg-surface border border-border overflow-hidden p-[2px]">
                <div 
                  className="h-full bg-accent transition-all duration-300 ease-out flex items-center justify-end px-1"
                  style={{ width: `${progress}%` }}
                >
                  <div className="w-1 h-3 bg-black/50" />
                </div>
              </div>
            </div>

            <div className="text-[10px] text-text-muted font-bold tracking-tight italic">
              "NEURAL_LINK_STABILITY: OPTIMAL"
            </div>
            
          </div>
        </div>

        {/* ── Bottom Tags ── */}
        <div className="mt-8 flex justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-black text-text-dim uppercase tracking-[0.3em]">ENCRYPTION</span>
            <span className="text-[10px] font-black text-accent uppercase tracking-widest">AES_256_ACTIVE</span>
          </div>
          <div className="flex flex-col gap-1 items-end text-right">
            <span className="text-[8px] font-black text-text-dim uppercase tracking-[0.3em]">SECURE_NODE</span>
            <span className="text-[10px] font-black text-accent uppercase tracking-widest">CODESTAGE_V4</span>
          </div>
        </div>

      </div>

      {/* ── Decorative Borders ── */}
      <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-accent/30" />
      <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-accent/30" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-accent/30" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-accent/30" />

    </div>
  );
}

export default RouteLoader;
