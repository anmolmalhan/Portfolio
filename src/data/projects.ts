export type ProjectSection = {
  heading: string;
  paragraphs: string[];
};

export type ProjectMetric = {
  label: string;
  value: string;
};

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
  /** One-line positioning shown above the section list on the case study page. */
  summary: string;
  /** Highlight numbers shown as a small stat row at the top of the case study. */
  metrics?: ProjectMetric[];
  /** Structured case study body. Each section renders as a heading + paragraphs. */
  sections: ProjectSection[];
};

export const projects: Project[] = [
  {
    id: "0",
    slug: "tripmates",
    title: "Tripmates",
    shortDescription:
      "A group-travel marketplace for India where solo travellers join curated trips with verified hosts, fixed dates, and pre-booked hotels at unbeatable per-seat prices.",
    techStack: ["Next.js 16", "TypeScript", "Tailwind CSS v4", "shadcn/ui"],
    role: "Founder & Builder",
    image: "/projects/tripmates.svg",
    githubUrl: "https://github.com/anmolmalhan/tripmates",
    liveUrl: "https://tripmates-coral.vercel.app/",
    featured: true,
    summary:
      "Replacing the friend-group coordination loop with a marketplace of pre-curated trips you can join with one seat.",
    metrics: [
      { label: "Status", value: "Frontend-complete prototype" },
      { label: "Target market", value: "India · solo travellers" },
      { label: "Avg. saving vs DIY", value: "~30%" },
    ],
    sections: [
      {
        heading: "The Problem",
        paragraphs: [
          "Every group trip you try to plan with friends gets killed by excuses: mismatched leaves, mismatched budgets, mismatched commitment. Solo travellers who want company end up either traveling alone or coordinating with strangers on noisy WhatsApp groups with no accountability.",
          "Tripmates is built around one observation: the coordination loop is the bottleneck, not the desire. Remove the loop and the trip happens.",
        ],
      },
      {
        heading: "The Product",
        paragraphs: [
          "A curated catalogue of trips that already have fixed dates, pre-booked hotels, and a verified host. You browse, you book a seat, you go. No planning, no chasing, no convincing.",
          "The current build is frontend-complete: a homepage that pitches the value (travel together, make friends, save ~30%), a trip listings grid with day-by-day itineraries, host-verification and trust-and-safety pages, and a seat-based booking flow that drops users into a WhatsApp group on confirmation.",
        ],
      },
      {
        heading: "Why Backend-Agnostic First",
        paragraphs: [
          "Deliberately no database, no real payments yet. The hardest questions for a marketplace like this aren't technical: they're whether real users trust a stranger-host enough to wire money, whether per-seat pricing reads as fair, and whether the WhatsApp handoff feels safe.",
          "By keeping the prototype backend-light, I can iterate on those flows with real users in days, not sprints. Phase 1 wires up Clerk for auth, Neon Postgres for trip data, and Razorpay for payments only once the trust and pricing flows are validated.",
        ],
      },
      {
        heading: "Stack & Engineering Choices",
        paragraphs: [
          "Next.js 16 with the App Router, Server Components, and Turbopack. TypeScript in strict mode. Tailwind v4 with a shadcn/ui Nova preset for a consistent design system. The catalogue is statically generated where possible so listing pages stay sub-second even on Indian mid-tier devices.",
        ],
      },
      {
        heading: "Outcomes & Roadmap",
        paragraphs: [
          "Where it landed: a frontend-complete prototype that walks a real user end-to-end from landing page through host verification, trip selection, day-by-day itinerary, seat-based booking, and a WhatsApp-group handoff on confirmation. Every flow is interactive; nothing is a dead Figma mock.",
          "What I'm validating next: whether per-seat pricing reads as fair to the target user, whether the WhatsApp-group reveal feels safe, and how many seats convert from view to booking before any paid acquisition. Phase 1 then wires Clerk for auth, Neon Postgres for persistent trip data, and Razorpay for payments only after those conversions hold up.",
          "If you want to walk the flows: the live prototype runs without an account, no card required.",
        ],
      },
    ],
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
    summary:
      "A network speed test that competes on motion fidelity, not just numbers. Saturating the link without dropping a frame on the gauge.",
    metrics: [
      { label: "Status", value: "Public" },
      { label: "Render budget", value: "60fps gauge under load" },
      { label: "Concurrency", value: "Pooled HTTP workers" },
    ],
    sections: [
      {
        heading: "The Goal",
        paragraphs: [
          "Most browser-based speed tests measure the bottleneck of their own measurement code, not your link. They run on a single TCP connection, share the main thread with the rendering loop, and produce numbers that lag behind reality.",
          "SPEEDOMETX is engineered from the ground up to bypass those bottlenecks, and to look good doing it.",
        ],
      },
      {
        heading: "How It Measures",
        paragraphs: [
          "A high-concurrency upload engine pools multithreaded HTTP workers to saturate modern TCP stacks the way a real workload would. Latency jitter is sampled natively against edge nodes rather than against a single distant origin, so the readout reflects what the user's network actually feels like under sustained load.",
        ],
      },
      {
        heading: "Why Motion Matters Here",
        paragraphs: [
          "A speed test is one of the rare apps where the user stares at a single animating component for the entire session. If the gauge stutters while the link is being saturated, the tool feels slow, even if its numbers are correct.",
          "Framer Motion drives the kinematics with spring physics tuned to feel weighty without lag. The dark, immersive interface keeps focus on the gauge, and the rendering path is structured so the upload engine never starves the animation frame.",
        ],
      },
      {
        heading: "Stack",
        paragraphs: [
          "Next.js with the App Router, TypeScript in strict mode, Tailwind for utility-first styling, and Framer Motion for the gauge and transitions.",
        ],
      },
      {
        heading: "Outcomes & What I Took Away",
        paragraphs: [
          "Where it landed: a public, working speed-test app where the gauge holds a steady 60fps while the upload engine saturates the link. The visible jitter and download numbers track real edge-node behavior rather than a smoothed average, which is the differentiator vs. consumer tests.",
          "What it taught me: rendering budgets are a first-class constraint, not an afterthought. The biggest win came from making sure the measurement workers and the animation frame never compete for the same thread, which sounds obvious until you actually instrument it. Useful pattern I'll reach for again on any data-heavy live-updating UI.",
        ],
      },
    ],
  },
];
