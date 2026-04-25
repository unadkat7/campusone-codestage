import React from "react";

/**
 * ConfirmModal — Brutalist system override dialog refactored to clean Tailwind.
 */
function ConfirmModal({ 
  isOpen, 
  onCancel, 
  onConfirm, 
  title = "[ SYSTEM_OVERRIDE ]", 
  message = "Awaiting confirmation for critical action...", 
  confirmText = "EXECUTE", 
  variant = "primary" 
}) {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onCancel();
  };

  const isDanger = variant === "danger";

  return (
    <div 
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/95 flex items-center justify-center z-[2000] p-5 font-mono"
    >
      <div 
        className={`w-full max-w-[420px] bg-black p-8 shadow-[10px_10px_0_0] ${
          isDanger ? "border-2 border-error shadow-error" : "border-2 border-accent shadow-accent"
        }`}
      >
        {/* Header */}
        <div className="mb-4">
          <h3 className={`m-0 text-base font-black uppercase tracking-widest ${isDanger ? "text-error" : "text-accent"}`}>
            {title}
          </h3>
        </div>

        {/* Content */}
        <div className="mb-8 text-[13px] text-white leading-relaxed font-bold">
          {message}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button 
            onClick={onCancel}
            className="bg-transparent border border-border text-text-muted px-4 py-2 text-[11px] font-black uppercase cursor-pointer hover:text-white transition-colors"
          >
            [ CANCEL ]
          </button>
          <button 
            onClick={onConfirm}
            className={`px-6 py-2 text-[11px] font-black uppercase cursor-pointer border-none ${
              isDanger ? "bg-error text-black" : "bg-accent text-black"
            }`}
          >
            {confirmText.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
