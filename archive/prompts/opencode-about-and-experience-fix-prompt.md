# OpenCode Prompt — Finalize About Page Copy + Fix "3 years" Sitewide

Standalone prompt, paste into OpenCode as one task. Two separate changes: replace About page section copy, and correct every instance of the old experience figure.

---

## PROMPT TO PASTE

```
Make two changes to my static HTML site (aryanswaroop.com). Do not touch
layout, styling, or any section not named below.

1. ABOUT PAGE COPY — replace the text content of these four sections on
   /about.html with the exact copy below. Do not paraphrase or shorten it.
   Keep existing HTML structure/classes, only swap the text inside.

2. EXPERIENCE FIGURE — search the entire codebase (every .html file,
   including embedded resume content) for any instance of "3 years",
   "3+ years", "three years", or "Three years" and replace it with
   "2.5+ years". This must include the resume Summary paragraph embedded
   in the About page, the homepage hero/subhead if it appears there, and
   any meta description tags that reference years of experience. Report
   back every file and line where a replacement was made so I can verify
   nothing was missed.
```

---

## 1. About page — final copy

**In short**
```
I'm from Bengaluru and still live here. I go to the gym most days, play badminton on weekends, and box when I have time.
```

**Why brand design?**
```
A logo is just text and color, but it can spark a real chemical reaction in someone's brain before they've read a single word. I got into brand design chasing that — the moment someone looks twice and thinks, wait, what.
```

**Life outside work**
```
Outside client work, I build my own tools and passion projects — the ones I care enough about to lose sleep over. I'm also building toward a YouTube channel. Family dinner stays non-negotiable, whatever the week looks like.
```

**So what now**
```
Currently open to Creative Lead and Brand Designer roles.
```

## 2. Experience figure — known locations to check

Based on everything built in this project, these are the specific places "3 years" / "3+ years" is likely to still exist — use this as a checklist, not an exhaustive list:

- Resume Summary paragraph (embedded HTML resume on the About page): *"Brand Designer and Creative Lead with 3+ years leading end-to-end creative..."* → change to *"2.5+ years"*
- Homepage hero subhead, if it still reads *"Three years leading creative end-to-end, from strategy to shipped result."* — either update to *"2.5+ years"* or drop the years reference entirely if you've already moved to the shorter hero subhead from this project ("Identity, packaging, film, and space — designed, and often shipped into working product, by the same person.")
- Any `<meta name="description">` tag that references years of experience, if metadata was added per the earlier AI-readability prompt
- `llms.txt`, if the summary line there mentions years
