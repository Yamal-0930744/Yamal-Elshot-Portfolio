export const projects = [
  {
    id: "logicare-ui",
    title: "LogiCare – UI Redesign",
    subtitle: "From cluttered to clear",
    tags: ["UI/UX", "Design system", "React"],
    cover: "/img/projects/logicare/logicarelogo.svg", // tile image
    isLogo: true,
    media: [
      { type: "image", src: "/img/projects/logicare/logicarebefore.png",  caption: "Original dashboard (before)" },
      { type: "image", src: "/img/projects/logicare/logicarebefore2.png", caption: "Original dashboard (before)" },
      { type: "image", src: "/img/projects/logicare/logicareduring.png",  caption: "Wireframes & IA cleanup" },
      { type: "image", src: "/img/projects/logicare/logicareduring2.png", caption: "Wireframes & IA cleanup" },
      { type: "image", src: "/img/projects/logicare/logicareduring3.png", caption: "Wireframes & IA cleanup" },
      { type: "image", src: "/img/projects/logicare/logicareafter.png",   caption: "Redesigned dashboard (after)" }
    ],
    sections: {
      challenge: [
        "Cluttered UI slowed users down and increased training/support costs.",
        "Inconsistent components; no clear hierarchy across critical flows."
      ],
      roadmap: [
        "UX audit → wireframes → design system tokens & components."
      ],
      results: [
        "Faster task completion; fewer support tickets after rollout.",
        "Clearer flows and better dark-theme legibility."
      ]
    }
  },

  {
    id: "threejs-first-character", // CSS-safe id
    title: "Three.js - First 3D Character",
    subtitle: "My first step into 3D on the web",
    tags: ["Three.js", "GLTF", "Animation"],
    cover: "/img/projects/care4/carelogo.svg",
    isLogo: true,
    media: [
      {
        type: "video",
        src: "/img/projects/care4/film.mp4",
        poster: "/img/projects/care4/carelogo.svg", // use a JPG/PNG poster
        caption: "Tiny demo: idle, walk and jump"
      }
    ],
    sections: {
      challenge: [
        "First time in Three.js: load a low-poly character, play animations, and react to input — all in the browser.",
      ],
      roadmap: [
        "Set up scene, lights and a simple camera rig; exported the character as glTF.",
        "Hooked idle/walk clips with AnimationMixer and wrote a small jump arc.",
        "Keyboard input, basic collision/collectibles, and a sparkle feedback effect.",
      ],
      results: [
        "Shipped a playful micro-demo (see video).",
        "Got comfortable with the glTF → AnimationMixer pipeline, input/camera control, and 3D UI polish — a foundation for future 3D moments on the site."
      ]
    }
  },

  {
    id: "landingpages",
    title: "Landing Pages - SEO + CTA Experiments",
    subtitle: "Therapeutenkompas, LogiCare, JanetCP",
    tags: ["SEO", "Copywriting", "A/B tests"],
    cover: "/img/projects/landingpages/TKlogo.svg", // logo or wordmark
    isLogo: true,
    media: [
      {
        type: "video",
        src: "/img/projects/landingpages/janetcp.mp4",
        caption: "JanetCP - variant walkthrough and CTA flow"
        // poster: "/img/projects/landingpages/janetcp-poster.jpg"
      },
      {
        type: "video",
        src: "/img/projects/landingpages/welkomnapsales.mp4",
        caption: "Weklomnap Sales - hero/CTA experiments"
        // poster: "/img/projects/landingpages/weklomnapsales-poster.jpg"
      }
    ],
    sections: {
      challenge: [
        "Increase qualified leads for different audiences without rebuilding entire sites.",
      ],
      roadmap: [
        "Keyword research → intent clusters → on-page structure (H1/H2, schema, internal links).",
        "Practiced lightweight JavaScript animations & micro-interactions (hover/press, scroll reveals, icon FX)."
      ],
      results: [
        "Winning variants consistently outperformed controls in CTR and form starts.",
        "Mobile bounce trended down after simplifying the above-the-fold and tightening copy.",
        "Shipped reusable page templates and a small experimentation playbook for future campaigns."
      ]
    }
  },


  {
  id: "google-calendar",
  title: "Google Calendar Integration - LogiCare",
  subtitle: "One-click sync to personal calendars",
  tags: ["Google API", "OAuth 2.0", "Backend"],
  cover: "/img/projects/google/google.svg", // or a logo if you have one; set isLogo:true to spin/gray
  isLogo: true,
  media: [
    // Add your own assets when ready:
    { type: "image", src: "/img/projects/google/googleapi.svg", caption: "Google OAuth consent & scopes" },
  ],
  sections: {
    challenge: [
      "Users create appointments in LogiCare but need them to appear in their personal Google Calendar.",
    ],
    roadmap: [
      "Implemented Google OAuth 2.0 (user-level) with offline access and secure refresh-token storage.",
      "Mapped LogiCare events to Google’s model (attendees, reminders, all-day vs timed, time-zone aware).",
    ],
    results: [
      "Appointments created in LogiCare now show up in users’ Google Calendars within moments.",
      "Teams appreciated the one-click connect flow and clear messaging when re-authentication was needed."
    ]
  }
},

  {
  id: "personality-app",
  title: "Personality — Classroom Typing App",
  subtitle: "Brand-first, interactive quiz for teachers",
  tags: ["Branding", "Animation", "UX"],
  cover: "/img/projects/personality/personalitylogo.svg",
  isLogo: true, // greyscale + spin effect (if you kept that CSS)
  media: [
    {
      type: "video",
      src: "/img/projects/personality/personality.mp4",
      poster: "/img/projects/personality/personalitylogo.svg",
      caption: "Typewriter intro → quiz flow → results share"
    },
    { type: "image", src: "/img/projects/personality/firstscreen.png", caption: "Brand system and landing" },
    { type: "image", src: "/img/projects/personality/teacherdashboard.png",  caption: "Teacher dashboard" }
  ],
  sections: {
    challenge: [
      "Build a simple app teachers can use to estimate student personality types (16-type model) and then form balanced groups.",
      "Make it feel friendly and branded, not “test-y,” while staying clear and accessible."
    ],
    roadmap: [
      "Created a fictional brand (name, mark, palette, typography) and applied it across the UI kit.",
      "Layered playful details: typewriter intro, subtle hover/press states, progress ring, and gentle result reveal.",
    ],
    results: [
      "Teachers can run a quick session, share links, and group students by complementary traits with minimal guidance.",
      "The brand and small animations make the flow inviting while keeping the questions the star."
    ]
  }
},

  {
  id: "blue-alien-game",
  title: "Blue Alien — Cupcake Run",
  subtitle: "First platformer, first team lead",
  tags: ["Python", "Pygame", "Game Design", "Art Direction"],
  cover: "/img/projects/bluealien/bluealien.svg", // or a key art image
  isLogo: true,
  media: [
    {
      type: "video",
      src: "/img/projects/bluealien/bluealiengame.mp4",
      poster: "/img/projects/bluealien/bluealienlogo.png", // optional
      caption: "Gameplay: collect cupcakes and reach the mothership"
    }
  ],
  sections: {
    challenge: [
      "Make a small, polished platformer as a school team project—my first time leading a group.",
      "Shape a cohesive art style while learning the nuts and bolts of 2D gameplay."
    ],
    roadmap: [
      "Scoped the build, assigned roles, and ran weekly check-ins to keep momentum.",
      "Implemented core mechanics in Python with Pygame: run/jump, collisions, pickups, checkpoints, win/lose states.",
      "Designed levels with tile layers and basic enemy/hazard patterns."
    ],
    results: [
      "Playable demo delivered on time; classmates could finish levels without instructions.",
      "Built foundation skills: game loop thinking, collision handling, state machines, and team leadership."
    ]
  }
},

  {
  id: "n8n-youtube-discord",
  title: "n8n Automation - YouTube → Discord",
  subtitle: "Auto-announce new uploads to your server",
  tags: ["n8n", "TypeScript", "YouTube Data API", "Discord Webhook", "OAuth 2.0", "Automation"],
  cover: "/img/projects/n8n/n8n.svg", 
  isLogo: true,
  media: [
    { type: "image", src: "/img/projects/n8n/ytxdsc.svg", caption: "n8n workflow: Cron → YouTube → Format → Discord" },
  ],
  sections: {
    challenge: [
      "Creators wanted Discord to auto-announce new YouTube videos without manual posting.",
      "Do it securely with Google OAuth and make messages consistent with the channel’s brand."
    ],
    roadmap: [
      "Set up a Cron trigger in n8n to poll the YouTube Data API for new uploads on a cadence.",
      "Connected YouTube via OAuth 2.0 (offline access) and stored refresh tokens securely.",
      "Normalized payload (title, URL, thumbnail, publish time) and de-duplicated by videoId to avoid reposts.",
      "Wrote a small TypeScript helper (compiled to JS for the n8n Code node) for formatting, templating, and dedupe caching.",
      "Added error handling/retries and lightweight run logs so failures are easy to spot and replay."
    ],
    results: [
      "New uploads show up in Discord automatically—no copy/paste needed.",
      "Creators keep followers engaged with consistent, well-formatted announcements.",
    ]
  }
},

];
