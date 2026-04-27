# OpenClaw B2B Marketing Docs — Design Brainstorm

<response>
<text>
## Idea 1: "Terminal Noir" — Hacker Documentation Aesthetic

**Design Movement**: Cyberpunk terminal UI meets technical documentation. Inspired by retro CRT monitors, hacker culture, and command-line interfaces.

**Core Principles**:
1. Information density over whitespace — pack content tightly like a real terminal
2. Monospace-first typography with selective proportional accents
3. Glowing accent colors on near-black backgrounds (green phosphor, amber warnings)
4. Scanline texture and subtle CRT curvature effects

**Color Philosophy**: Near-black base (#0a0e14) with phosphor green (#39ff14) as primary accent. Amber (#ffb627) for warnings and callouts. Cool gray (#8b949e) for body text. The palette evokes trust through technical competence — "this was built by engineers, for engineers."

**Layout Paradigm**: Fixed left sidebar navigation (terminal-style file tree), main content area with a top command bar showing current "path" (breadcrumb). Content sections use bordered panels resembling terminal windows with title bars.

**Signature Elements**: 
- Blinking cursor animations on section headers
- Code blocks styled as actual terminal output with prompt characters
- ASCII art dividers between major sections

**Interaction Philosophy**: Keyboard-first navigation hints. Hover states reveal additional context like tooltips in an IDE. Click feedback uses brief flash animations.

**Animation**: Typewriter text reveal on page load for hero section. Smooth slide-in for sidebar items. Subtle scanline overlay that moves vertically.

**Typography System**: JetBrains Mono for headings and code. IBM Plex Sans for body text. Strict hierarchy: H1 at 2rem mono bold, H2 at 1.5rem mono, body at 1rem sans.
</text>
<probability>0.06</probability>
</response>

<response>
<text>
## Idea 2: "Maritime Technical Manual" — Nautical Documentation

**Design Movement**: Inspired by naval operations manuals, maritime charts, and the OpenClaw lobster/ocean branding. A warm, textured documentation style that feels like a captain's logbook.

**Core Principles**:
1. Warm, paper-like backgrounds with subtle texture (parchment grain)
2. Deep ocean blues and coral reds as the primary palette — tied to the lobster/claw identity
3. Structured layouts inspired by naval technical manuals — clear sections, numbered procedures
4. Illustrations and diagrams that feel hand-drawn or engraved

**Color Philosophy**: Off-white parchment base (#f5f0e8) with deep navy (#1a2744) for text and headers. Coral red (#e05252) for the OpenClaw brand accent. Teal (#2a7f8e) for links and interactive elements. Gold (#c4953a) for highlights and badges. The palette connects to the ocean/lobster identity while maintaining readability.

**Layout Paradigm**: Two-column layout with a persistent left navigation styled as a ship's manifest. Main content uses wide margins with marginal notes (like Tufte-style sidenotes). Section breaks use wave-pattern SVG dividers.

**Signature Elements**:
- Compass rose icon for navigation
- Rope-knot decorative borders on key cards
- Anchor icons for deep-link indicators

**Interaction Philosophy**: Smooth, deliberate transitions — nothing snappy or jarring. Hover states use subtle shadow deepening like pressing into paper. Active states use a slight "embossed" effect.

**Animation**: Gentle wave motion on the hero section background. Smooth accordion expansions for FAQ items. Page transitions use a horizontal slide (like turning pages).

**Typography System**: Playfair Display for headings (serif, authoritative). Source Sans 3 for body text (clean, readable). Fira Code for code blocks. H1 at 2.5rem serif bold, H2 at 1.75rem serif, body at 1.05rem sans.
</text>
<probability>0.04</probability>
</response>

<response>
<text>
## Idea 3: "Brutalist Blueprint" — Industrial Documentation

**Design Movement**: Brutalist web design meets architectural blueprints. Raw, exposed structure. No decoration — every element serves a function. Inspired by construction documents and engineering schematics.

**Core Principles**:
1. Exposed grid structure — visible layout lines and alignment guides
2. High contrast with a limited palette: white, dark charcoal, and one signal color
3. Oversized typography for hierarchy — massive headings, compact body
4. Raw HTML energy — borders instead of shadows, underlines instead of color changes

**Color Philosophy**: Pure white (#ffffff) background with charcoal (#1c1c1c) text. Electric orange (#ff4d00) as the single accent color for links, active states, and critical callouts. No gradients, no opacity variations. The palette communicates: "this is serious infrastructure documentation, not a marketing site."

**Layout Paradigm**: Full-width sections with a visible 12-column grid overlay (faint lines). Navigation is a horizontal top bar with oversized text labels. Content sections are separated by thick horizontal rules. No cards — content sits directly on the page with generous vertical spacing.

**Signature Elements**:
- Blueprint-style dotted grid background on diagram sections
- Oversized section numbers (like "01.", "02.") in the accent color
- Thick left-border accent bars on blockquotes and callouts

**Interaction Philosophy**: Binary states — elements are either default or active, no in-between hover states. Clicks produce immediate, hard transitions. Scrolling reveals content with no animation — it's just there.

**Animation**: Minimal to none. Only functional animations: accordion open/close, mobile menu toggle. No entrance animations, no parallax, no decorative motion.

**Typography System**: Space Grotesk for everything — headings and body. Bold weight for headings, regular for body. Monospace (Space Mono) for code. H1 at 3.5rem bold, H2 at 2rem bold, body at 1rem regular. Tight letter-spacing on headings.
</text>
<probability>0.03</probability>
</response>
