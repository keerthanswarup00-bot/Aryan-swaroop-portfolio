# OpenCode Build Prompt — aryanswaroop.com

Paste everything below into OpenCode as one task. Stack assumed: **Next.js (App Router) + Tailwind + Framer Motion**. If the live site isn't on that stack yet, say so first — don't let it improvise a different framework mid-task.

---

## PROMPT TO PASTE

```
You are working on my Next.js portfolio site (aryanswaroop.com). Implement the
four features below exactly as specced. Match my existing design tokens
(background #FAFAF8, black text/accents) wherever a new component needs a
color choice I haven't specified. Do not introduce new color themes, fonts,
or layout patterns beyond what's described. Ask me before deviating from any
spec below — do not silently "improve" the design.

Reference implementations for each feature are provided as a starting point,
not a final answer — adapt them to my actual file structure, existing
components, and content.

=====================================================================
FEATURE 1 — Sticky header with scroll progress bar
=====================================================================
- Fixed header, full width, sits above all content, backdrop-blur.
- Left side: circular avatar (44px) + name "Aryan Swaroop" on top line.
  Below it, smaller/lighter text: "Open to work" next to a small green dot
  that pulses/beeps (animated ring, not just a static dot).
- Right side: hamburger icon (two lines, no text label).
- Hamburger opens a fullscreen black overlay nav with links, in this order:
  Real Estate, Lifestyle, Builds, Tools, About Me.
- Directly below the header row: a 2px scroll-progress line, full width,
  empty/light track, filled left-to-right in black as the user scrolls
  through the ENTIRE page (0% at top, 100% at bottom of document).
- The progress line must persist across the whole site, not just one page.

=====================================================================
FEATURE 2 — About Me page (contains Resume)
=====================================================================
Route: /about

Section 1 (first viewport, full black background, full white text):
- Exactly 3 lines, centered, large type, filling the full screen height.
  Content: who I am / what I build / my experience summary — pull from my
  existing About copy on the homepage, condensed to 3 lines.

Section 2 (scroll-revealed, white background, black text):
- Three blocks that fade/slide in on scroll (once each, not repeating):
  1. "What I do" — current disciplines (brand, packaging, video, 3D, web builds)
  2. "What I've been doing" — recent real work (Paavani Properties, Sastry's
     by Brahmi, AlbumFlow, Selectly — pull from existing case study copy)
  3. "How I became multidisciplinary" — the actual narrative of why, in my
     voice, not generic "I love wearing many hats" copy

Section 3 (below the journey, same page — Resume):
- A "Resume" section showing the resume in TWO mockup frames side by side
  (stack vertically on mobile): a desktop browser-chrome frame and a phone
  frame, each displaying a screenshot/render of my resume.
- Below both frames: a "Download PDF" button linking to the actual resume file.
- I will supply the resume screenshots — use placeholder image paths for now
  (/images/resume-desktop.png, /images/resume-mobile.png) and flag them as
  placeholders I need to swap.

=====================================================================
FEATURE 3 — Intro flash sequence (site load, once per session)
=====================================================================
- Full black screen, on top of everything, on first load only (gate with
  sessionStorage so it does NOT replay on every navigation/visit).
- Step 1: my name ("Aryan Swaroop") fades in slowly (~800ms ease-in), holds
  briefly, fades out.
- Step 2: a fast flash sequence of words, each one appearing instantly and
  disappearing instantly (snap cut, no fade) as the next one snaps in —
  roughly 140ms per word:
  Branding → Designer → 3D Walkthrough → Developer → Marketing → Motion Design
- After the last word, the overlay unmounts and the site is revealed.
- Total sequence should land under ~2.2 seconds. Do not let this block
  become skippable-but-annoying — it must be short enough that it never
  needs a skip button.
```

---

## REFERENCE CODE

### 1. Header + scroll progress bar

```jsx
// components/SiteHeader.jsx
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Real Estate", href: "/real-estate" },
  { label: "Lifestyle", href: "/lifestyle" },
  { label: "Builds", href: "/builds" },
  { label: "Tools", href: "/tools" },
  { label: "About Me", href: "/about" },
];

export default function SiteHeader() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      setScrollProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#FAFAF8]/90 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <Image
            src="/images/portrait.jpg"
            alt="Aryan Swaroop"
            width={44}
            height={44}
            className="rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-black leading-tight">
              Aryan Swaroop
            </span>
            <span className="flex items-center gap-1.5 text-xs text-neutral-500 leading-tight">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              Open to work
            </span>
          </div>
        </div>

        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className="flex flex-col gap-1.5 w-7"
        >
          <span className="h-[1.5px] bg-black w-full" />
          <span className="h-[1.5px] bg-black w-full" />
        </button>
      </div>

      <div className="h-[2px] w-full bg-neutral-200">
        <div
          className="h-full bg-black transition-[width] duration-150 ease-linear"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {menuOpen && (
        <nav className="fixed inset-0 bg-black text-white z-[60] flex flex-col items-center justify-center gap-8">
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-6 right-6 text-3xl"
            aria-label="Close menu"
          >
            ×
          </button>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-4xl font-medium hover:opacity-60 transition-opacity"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
```

### 2. About Me page

```jsx
// app/about/page.jsx
"use client";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <main className="bg-black text-white">
      <section className="h-screen flex items-center justify-center px-8">
        <p className="max-w-4xl text-center text-3xl md:text-5xl font-medium leading-snug">
          I'm a brand designer and developer from Bengaluru.
          <br />
          I build identity systems that hold up in print, on screen, and in space.
          <br />
          Three years leading creative end-to-end, from strategy to shipped result.
        </p>
      </section>

      <section className="min-h-screen bg-white text-black px-8 py-24 flex flex-col gap-16 max-w-3xl mx-auto">
        <RevealBlock title="What I do">
          Brand identity, packaging, video, 3D visualization, and the web builds
          that ship it — under one roof, for founders who need more than a logo.
        </RevealBlock>
        <RevealBlock title="What I've been doing">
          Leading creative at Paavani Properties across 30+ projects. Building
          Sastry's by Brahmi's full packaging system. Shipping SaaS tools —
          AlbumFlow, Selectly — in React, Next.js, and Supabase on the side.
        </RevealBlock>
        <RevealBlock title="How I became multidisciplinary">
          Every brand I worked on needed something the last designer couldn't
          give it — a working prototype, a rendered walkthrough, a system that
          survived contact with a dev handoff. I stopped waiting for someone
          else to build it.
        </RevealBlock>
      </section>

      <ResumeShowcase />
    </main>
  );
}

function RevealBlock({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h3 className="text-sm uppercase tracking-widest text-neutral-500 mb-3">
        {title}
      </h3>
      <p className="text-xl md:text-2xl leading-relaxed">{children}</p>
    </motion.div>
  );
}
```

### 3. Resume showcase (phone + desktop frames)

```jsx
// components/ResumeShowcase.jsx
export default function ResumeShowcase() {
  return (
    <section className="bg-white text-black py-24 px-8">
      <h2 className="text-center text-sm uppercase tracking-widest text-neutral-500 mb-16">
        Resume
      </h2>
      <div className="flex flex-col md:flex-row items-center justify-center gap-12">
        <div className="w-full max-w-2xl rounded-xl border border-neutral-200 shadow-lg overflow-hidden">
          <div className="h-8 bg-neutral-100 flex items-center gap-1.5 px-3">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
          </div>
          {/* PLACEHOLDER — swap with real resume screenshot */}
          <img src="/images/resume-desktop.png" alt="Resume desktop view" className="w-full" />
        </div>
        <div className="w-[220px] rounded-[2rem] border-4 border-neutral-800 overflow-hidden shadow-lg">
          {/* PLACEHOLDER — swap with real resume screenshot */}
          <img src="/images/resume-mobile.png" alt="Resume mobile view" className="w-full" />
        </div>
      </div>
      <div className="flex justify-center mt-12">
        <a
          href="/Aryan_Swaroop_Resume.pdf"
          download
          className="border border-black px-6 py-3 rounded-full text-sm font-medium hover:bg-black hover:text-white transition-colors"
        >
          Download PDF
        </a>
      </div>
    </section>
  );
}
```

### 4. Intro flash sequence

```jsx
// components/IntroSequence.jsx
"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FLASH_WORDS = [
  "Branding",
  "Designer",
  "3D Walkthrough",
  "Developer",
  "Marketing",
  "Motion Design",
];

const FLASH_INTERVAL = 140; // ms per word

export default function IntroSequence({ onDone }) {
  const [phase, setPhase] = useState("name"); // "name" | "flash"
  const [flashIndex, setFlashIndex] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem("introSeen")) {
      onDone();
      return;
    }
    const toFlash = setTimeout(() => setPhase("flash"), 1400);
    return () => clearTimeout(toFlash);
  }, []);

  useEffect(() => {
    if (phase !== "flash") return;
    if (flashIndex >= FLASH_WORDS.length) {
      sessionStorage.setItem("introSeen", "true");
      const toDone = setTimeout(onDone, 150);
      return () => clearTimeout(toDone);
    }
    const timer = setTimeout(() => setFlashIndex((i) => i + 1), FLASH_INTERVAL);
    return () => clearTimeout(timer);
  }, [phase, flashIndex]);

  return (
    <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
      <AnimatePresence mode="wait">
        {phase === "name" && (
          <motion.span
            key="name"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="text-white text-5xl font-semibold"
          >
            Aryan Swaroop
          </motion.span>
        )}
        {phase === "flash" && flashIndex < FLASH_WORDS.length && (
          <motion.span
            key={FLASH_WORDS[flashIndex]}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0 } }}
            className="text-white text-4xl font-medium"
          >
            {FLASH_WORDS[flashIndex]}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
```

### 5. Wiring it into layout

```jsx
// app/layout.jsx (relevant excerpt)
"use client";
import { useState } from "react";
import IntroSequence from "@/components/IntroSequence";
import SiteHeader from "@/components/SiteHeader";

export default function RootLayout({ children }) {
  const [introDone, setIntroDone] = useState(false);
  return (
    <html lang="en">
      <body>
        {!introDone && <IntroSequence onDone={() => setIntroDone(true)} />}
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
```

---

## Before you run this

1. Confirm the two placeholder intro words — "Marketing" / "Motion Design" — or swap them.
2. You need actual `resume-desktop.png` and `resume-mobile.png` screenshots before Feature 2 looks finished — take them now so OpenCode isn't blocked mid-build.
3. Ship in this order: header/progress bar → about page → resume section → intro sequence last. Same reasoning as before — the intro is the one feature that can hurt you if botched, so it's the last thing you polish, not the first thing you obsess over.
