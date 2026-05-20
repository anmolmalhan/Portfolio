import { CheckCircle, XCircle } from "lucide-react";

export function StatusBanner({
  status,
  mode,
  msg,
}: {
  status?: string | string[];
  mode?: string | string[];
  msg?: string | string[];
}) {
  const s = Array.isArray(status) ? status[0] : status;
  if (!s) return null;

  if (s === "ok") {
    const m = Array.isArray(mode) ? mode[0] : mode;
    return (
      <div
        role="status"
        className="mb-6 flex items-center gap-3 rounded-md border border-[var(--syntax-green)]/30 bg-[var(--syntax-green)]/10 px-4 py-3 font-mono text-sm text-[var(--syntax-green)]"
      >
        <CheckCircle className="w-4 h-4 shrink-0" />
        <span>
          [success] {m === "mailto" ? "Handed off to your mail client." : "Message transmitted."}
        </span>
      </div>
    );
  }

  if (s === "err") {
    const m = Array.isArray(msg) ? msg[0] : msg;
    return (
      <div
        role="alert"
        className="mb-6 flex items-center gap-3 rounded-md border border-[var(--syntax-magenta)]/30 bg-[var(--syntax-magenta)]/10 px-4 py-3 font-mono text-sm text-[var(--syntax-magenta)]"
      >
        <XCircle className="w-4 h-4 shrink-0" />
        <span>[error] {m ?? "Something went wrong."}</span>
      </div>
    );
  }

  return null;
}
