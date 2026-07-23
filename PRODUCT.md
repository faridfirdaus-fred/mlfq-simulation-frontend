# Product

## Register

product

## Users

CS / operating-systems students and their instructors. Context: a student at their laptop — evening in a dorm or library, or a classroom demo — working through an OS scheduling assignment. They are focused and experimenting: tweak the config, add processes, run, and read the result to build intuition for how a Multi-Level Feedback Queue decides what runs next. Sessions are short and iterative. Some are first-time visitors who need the interface to teach them; some are power users running many what-if scenarios.

## Product Purpose

An interactive simulator that makes the MLFQ CPU-scheduling algorithm legible. Users define processes (arrival, burst, I/O, priority) and scheduler parameters (queues, time slice, boost interval, aging threshold), run the simulation against the backend, and see the outcome three ways: a per-process results table, aggregate metrics (turnaround, waiting, response, CPU utilization), and a time-based visualization (Gantt + queue-level playback). Success = a student can watch a process get demoted, aged, or boosted and understand *why*. The visualization is the product; controls exist to feed it.

## Brand Personality

Precise, instructive, calm-confident. Three words: **instrument, legible, honest.** It should feel like a real systems tool a professional would trust (a profiler, a monitor), not a toy — but never intimidating. Voice is plain and exact: name the mechanism, show the number, explain the "why" in one line. No hype, no decoration standing in for substance.

## Anti-references

- **Its own current state**: rainbow blue→purple→green gradients on every surface, gradient clip-text headings, `hover:scale` card wiggle, pure-neutral shadcn palette with no identity, mixed Indonesian/English copy. This is the AI-slop baseline being replaced.
- Generic SaaS landing pages (hero-metric templates, tiny tracked eyebrows, identical icon-card grids).
- Consumer "fun" edu apps with mascots, confetti, and cartoon color. This is a technical instrument, not a game.

## Design Principles

1. **Color carries meaning, never decoration.** Queue level maps to a single-hue priority ramp (brightest = highest priority); the one signal accent marks what is active/actionable. If a color isn't encoding data or state, it's wrong.
2. **The visualization is the hero.** Gantt and queue-level playback get the craft budget. Controls are quiet and get out of the way.
3. **Numbers are typeset.** Every metric, PID, time, and queue index is monospace, aligned, with units — data you can scan and trust.
4. **Teach in place.** Empty states load a real sample; metrics carry a one-line "what this means"; the interface explains the algorithm as you use it.
5. **Instrument, not ornament.** Motion conveys state (running, demoted, boosted, done) and nothing else. Familiar, standard affordances over invented flavor.

## Accessibility & Inclusion

WCAG AA minimum: body text ≥4.5:1, large/UI text ≥3:1, on both dark and light themes — verified, not assumed. Queue ramp and state colors must stay distinguishable for color-vision deficiency: pair color with a label, index, or shape (don't rely on hue alone to tell queues apart). Full keyboard operability for forms, controls, and playback. Every animation has a `prefers-reduced-motion` alternative. Copy is English throughout.
