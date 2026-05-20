"use client";

import { useState, useTransition } from "react";
import { Send, CheckCircle } from "lucide-react";
import { sendContactMessage, sendContactForm } from "./actions";

const CONTACT_EMAIL = "malhananmol1@gmail.com";

type Status = "idle" | "compiling" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [logs, setLogs] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const appendLog = (line: string) => setLogs((l) => [...l, line]);
  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const website = String(data.get("website") ?? "");

    if (!name || !email || !message) return;

    setStatus("compiling");
    setErrorMsg(null);
    setLogs(["[init] Starting payload assembly..."]);

    startTransition(async () => {
      const actionPromise = sendContactMessage({ name, email, message, website });

      await wait(250);
      appendLog("[network] Establishing secure channel...");
      await wait(350);
      appendLog("[auth] Verifying payload signature...");

      const result = await actionPromise;

      if (!result.ok) {
        appendLog(`[error] ${result.error}`);
        setErrorMsg(result.error);
        setStatus("error");
        return;
      }

      if (result.mode === "mailto") {
        appendLog("[handoff] Backend not configured — opening default mail client...");
        appendLog("[success] Message handed off to mail client.");
        setStatus("success");
        const subject = `Portfolio inquiry from ${name}`;
        const body = `${message}\n\n— ${name}\n${email}`;
        const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        await wait(300);
        window.location.href = mailto;
        return;
      }

      appendLog("[db] Writing record...");
      await wait(200);
      appendLog("[success] Message transmitted successfully.");
      setStatus("success");
    });
  };

  const showTerminal = status === "compiling" || status === "success";

  return (
    <div className="rounded-xl border border-surface bg-background overflow-hidden shadow-2xl">
      <div className="bg-surface px-4 py-3 flex items-center gap-2 border-b border-surface">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <div className="text-xs font-mono text-[var(--syntax-comment)] mx-auto">contact.sh</div>
      </div>

      <div className="p-6 md:p-8 relative">
        {/* Form is always mounted so input state survives error retries. */}
        <form
          action={sendContactForm}
          onSubmit={handleSubmit}
          className={`space-y-6 ${showTerminal ? "pointer-events-none opacity-0 absolute inset-6 md:inset-8" : ""}`}
          aria-hidden={showTerminal}
          noValidate
        >
          <div className="space-y-2">
            <label htmlFor="contact-name" className="font-mono text-sm text-[var(--syntax-blue)] flex">
              const <span className="text-foreground mx-2">name</span> =
            </label>
            <input
              id="contact-name"
              name="name"
              required
              autoComplete="name"
              type="text"
              className="w-full bg-surface/30 border border-surface rounded-md p-3 text-foreground font-mono text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent focus:border-accent transition-colors"
              placeholder='"Enter your name"'
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="contact-email" className="font-mono text-sm text-[var(--syntax-blue)] flex">
              const <span className="text-foreground mx-2">email</span> =
            </label>
            <input
              id="contact-email"
              name="email"
              required
              autoComplete="email"
              type="email"
              className="w-full bg-surface/30 border border-surface rounded-md p-3 text-foreground font-mono text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent focus:border-accent transition-colors"
              placeholder='"Email address"'
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="contact-message" className="font-mono text-sm text-[var(--syntax-blue)] flex">
              const <span className="text-foreground mx-2">message</span> =
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={4}
              className="w-full bg-surface/30 border border-surface rounded-md p-3 text-foreground font-mono text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent focus:border-accent transition-colors resize-none"
              placeholder="`Hello, I'd like to discuss...`"
            />
          </div>

          {/* Honeypot — hidden from real users, irresistible to dumb bots */}
          <div aria-hidden className="hidden" style={{ position: "absolute", left: "-9999px" }}>
            <label htmlFor="contact-website">Website (leave blank)</label>
            <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          {errorMsg && (
            <p role="alert" className="font-mono text-sm text-[var(--syntax-magenta)]">
              [error] {errorMsg}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-accent text-background font-bold font-mono py-3 rounded-md hover:bg-accent/90 transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Send className="w-4 h-4" /> await transmit()
          </button>

          <p className="font-mono text-xs text-[var(--syntax-comment)] text-center">
            Sends directly via the API when configured, otherwise opens your default mail client.
          </p>
        </form>

        {showTerminal && (
          <div className="min-h-[300px] flex flex-col font-mono text-sm relative z-10 bg-background">
            <div className="flex-1 space-y-2 text-[var(--syntax-comment)]" aria-live="polite">
              {logs.map((log, i) => (
                <div
                  key={i}
                  className={
                    log.includes("[success]")
                      ? "text-[var(--syntax-green)] mt-4"
                      : log.includes("[error]")
                        ? "text-[var(--syntax-magenta)]"
                        : ""
                  }
                >
                  {log}
                </div>
              ))}
              {status === "compiling" && (
                <div className="animate-pulse text-accent">_</div>
              )}
            </div>

            {status === "success" && (
              <div className="pb-4">
                <div className="flex items-center gap-3 text-[var(--syntax-green)] mb-6">
                  <CheckCircle className="w-6 h-6" />
                  <span className="text-lg">Transmission Complete</span>
                </div>
                <button
                  onClick={() => {
                    setStatus("idle");
                    setLogs([]);
                  }}
                  className="border border-surface-hover hover:bg-surface px-6 py-2 rounded-md font-mono transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  reset()
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
