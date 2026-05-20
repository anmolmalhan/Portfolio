import { Terminal } from "lucide-react";
import { StatusBanner } from "./StatusBanner";
import { ContactForm } from "./ContactForm";

// Server Component: reads searchParams on the server so the status banner
// renders in the initial HTML. That means visitors without JS see the
// success/error feedback from the Server Action redirect immediately —
// real progressive enhancement, not a client-only patch.
export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; mode?: string; msg?: string }>;
}) {
  const sp = await searchParams;

  return (
    <div className="max-w-2xl w-full mx-auto px-6 py-20 flex-1 page-reveal">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
          <Terminal className="text-accent w-8 h-8" />
          Contact Request
        </h1>
        <p className="text-[var(--syntax-comment)] text-lg">
          Execute a transmission to standard out. I usually reply within 1-2 business days.
        </p>
      </div>

      <StatusBanner status={sp.status} mode={sp.mode} msg={sp.msg} />

      <ContactForm />
    </div>
  );
}
