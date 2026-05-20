export type Project = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  techStack: string[];
  role: string;
  image: string;
  /** Optional. Omit / leave empty for private prototypes. UI hides the link. */
  githubUrl?: string;
  /** Optional. Omit / leave empty if not deployed yet. UI hides the link. */
  liveUrl?: string;
  featured: boolean;
  content: string;
};

export const projects: Project[] = [
  {
    id: "0",
    slug: "tripmates",
    title: "Tripmates",
    shortDescription:
      "A group-travel marketplace for India where solo travellers join curated trips with verified hosts, fixed dates, and pre-booked hotels — at unbeatable per-seat prices.",
    techStack: ["Next.js 16", "TypeScript", "Tailwind CSS v4", "shadcn/ui"],
    role: "Founder & Builder",
    image: "/projects/tripmates.svg",
    githubUrl: "https://github.com/anmolmalhan/tripmates",
    liveUrl: "https://tripmates-coral.vercel.app/",
    featured: true,
    content:
      "Tripmates is a group-travel marketplace built around one observation: every trip you try to plan with friends gets killed by excuses. The product replaces the coordination loop with a curated catalogue of trips that already have fixed dates, pre-booked hotels, and a verified host — you book a seat, you go. The current build is a frontend-complete prototype: a homepage that pitches the value (travel together, make friends, save ~30%), a trip listings grid with day-by-day itineraries, host-verification and trust-and-safety pages, and a seat-based booking flow that drops users into a WhatsApp group on confirmation. It's intentionally backend-agnostic — no database, no real payments — so the matching, pricing, and trust flows can be validated with real users before wiring up Clerk for auth, Neon Postgres for trip data, and Razorpay for payments in Phase 1. Built with Next.js 16 (App Router, Server Components, Turbopack), TypeScript in strict mode, Tailwind v4, and a shadcn/ui Nova preset.",
  },
  {
    id: "1",
    slug: "speedometx",
    title: "SPEEDOMETX",
    shortDescription:
      "A brutally fast, high-precision edge network telemetry dashboard with fluid Framer Motion kinematics.",
    techStack: ["Next.js", "TypeScript", "TailwindCSS", "Framer Motion"],
    role: "Full-stack Engineer",
    image: "/projects/speedometx.png",
    githubUrl: "https://github.com/anmolmalhan/Speedometx",
    liveUrl: "https://speedometx.vercel.app/",
    featured: true,
    content:
      "Engineered from the ground up to bypass standard browser telemetry bottlenecks, SPEEDOMETX utilizes a high-concurrency upload engine pooling multithreaded HTTP workers to saturate modern TCP stacks. Paired with a dark, immersive interface, it accurately logs latency jitter natively to edge nodes without yielding to micro-stutters — making it an aggressively premium network assessment tool.",
  },
];
