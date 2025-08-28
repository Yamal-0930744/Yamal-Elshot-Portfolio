// src/data/projects.js
export const projects = [
  {
    id: "logicare-ui",
    title: "LogiCare – UI Redesign",
    subtitle: "From cluttered to clear",
    tags: ["UI/UX", "Design system", "React"],
    cover: "/img/projects/logicare-cover.png",
    content: `
- Led UX audit and wireframes
- Built component library
- Measurable gains: faster task completion, fewer support tickets
    `,
    links: [{ label: "Case study", href: "#" }],
  },
  {
    id: "care4women-3d",
    title: "Care4Women – 3D Game",
    subtitle: "Playful education",
    tags: ["Three.js", "Game", "UX"],
    cover: "/img/projects/care4women-cover.png",
    content: `
- Designed core loop & UI
- Implemented 3D interactions
- Focus on accessibility & clarity
    `,
  },
  {
    id: "landingpages",
    title: "Landing Pages",
    subtitle: "Therapeutenkompas, LogiCare, JanetCP",
    tags: ["Marketing", "A/B tests"],
    cover: "/img/projects/landingpages-cover.png",
    content: `
- Rapid experiments
- Above-the-fold clarity
- Measurable CTR improvements
    `,
  },
  {
    id: "calendar-integration",
    title: "Google Calendar Integration",
    subtitle: "Seamless scheduling",
    tags: ["API", "Backend", "Auth"],
    cover: "/img/projects/calendar-cover.png",
    content: `
- OAuth flow
- Sync & conflict handling
- Error states designed for humans
    `,
  },

  // -------- MOCKS (to enable the carousel) --------
  {
    id: "portfolio-site",
    title: "Portfolio Revamp",
    subtitle: "From static to cinematic",
    tags: ["Framer Motion", "Branding", "UI"],
    cover: "/img/projects/logicare-cover.png",
    content: `
- Motion language & micro-interactions
- Typography and color system polish
- Accessibility pass
    `,
  },
  {
    id: "realtime-chat",
    title: "Realtime Chat",
    subtitle: "Low-latency interactions",
    tags: ["WebSockets", "Auth", "UI"],
    cover: "/img/projects/care4women-cover.png",
    content: `
- Presence indicators
- Message delivery states
- Keyboard-first UX
    `,
  },
  {
    id: "ecommerce-ui",
    title: "E-commerce UI",
    subtitle: "Conversion-focused flows",
    tags: ["Design system", "Checkout", "A/B tests"],
    cover: "/img/projects/landingpages-cover.png",
    content: `
- Cart & checkout journey
- Empty states & error recovery
- Experiment-led improvements
    `,
  },
  {
    id: "dataviz-dashboard",
    title: "DataViz Dashboard",
    subtitle: "Clarity over complexity",
    tags: ["Charts", "React", "UX"],
    cover: "/img/projects/calendar-cover.png",
    content: `
- Visual hierarchy for KPIs
- Drill-downs & filters
- Dark theme legibility
    `,
  },
];
