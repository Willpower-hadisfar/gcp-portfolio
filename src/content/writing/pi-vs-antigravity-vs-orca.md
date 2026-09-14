---
title: "Pi vs. Antigravity vs. Orca: One Job Per Harness, Not One Harness to Rule Them"
date: 2026-09-08
description: "Why I retired Orca, kept Antigravity for exactly one job, and picked Pi as the headless runner underneath an oracle-gated build pipeline — and the measured result: Pi came in 27–55× cheaper than Claude Code per successful build on the same tasks."
tags: ["agentic-ai", "developer-tools", "multi-agent-orchestration"]
readingTime: "7 min"
draft: false
relatedProject: "agentos"
---

I spent most of this year running five agent harnesses in parallel and telling myself it was due diligence. It wasn't — it was the build half of the SDLC eating time that belonged to the half that actually ships: verification, handover, evidence. The correction started with a blunt question — do I actually need Orca, Antigravity, *and* a third headless runner, or have I just accumulated tools? — and the answer turned out to be more interesting than "pick one."

## The wrong question: which one is best

Orca, Antigravity, and Pi aren't competing for the same job. They're three different shapes of tool that happen to all render as "an agent runs code," and treating them as interchangeable is exactly how you end up running a comparison matrix instead of shipping something.

- **Orca** is a native GUI over worktree-per-task work — spin up a worktree, point an external CLI agent (Gemini, Claude Code, whatever) at a slice, review the diff in-app, merge. Its value is the human-in-the-loop review surface.
- **Antigravity** is Google's own agent platform — desktop app, `agy` CLI, a Python SDK, a Managed Agents API, community ACP adapters so external editors can drive it. Its value is the IDE surface and a real Managed Agents story for a product I'm building on top of it.
- **Pi** is a deliberately minimal coding-agent harness from Earendil — CLI, print/JSON mode, RPC, and an SDK, with MCP, sub-agents, and permission popups *excluded* from the core on purpose. Its value is that it was built to be driven programmatically, not retrofitted for it.

None of those descriptions overlap much once you write them out. The comparison matrix I'd been running — "which agent CLI is best" — was the wrong frame from the start.

## First, the question I actually asked and got a clean no on

Before any of this, I wanted to know: can I hook Pi up to Antigravity, so I get Pi's lean headless loop *inside* Antigravity's surface? No. They're both agent runtimes, not a runtime and a host — asking one to drive the other is asking two front doors to open into each other.

You technically *could* register Pi as an MCP server inside Antigravity's `mcp_config.json`. You shouldn't. Practitioners running Antigravity at scale report needing to keep active tools under roughly 25 for stability, and wrapping an entire second agent as a single MCP tool is exactly the context bloat Pi's lazy-skill design exists to avoid. You'd be paying Pi's minimalism tax and Antigravity's tool-budget tax on the same call.

There's a second wall behind the first, and it's the one that actually changed my architecture: **both vendors have closed their subscription routes to programmatic use.** The `google-antigravity` SDK hard-requires a Gemini API key and cannot authenticate against an Antigravity subscription — using an Antigravity *account* from third-party software violates Google's TOS. On the Anthropic side, the Claude Agent SDK is API-key-only for headless auth, and subscription usage through the SDK moved to a separate, further-metered credit pool in June 2026. Neither vendor's subscription survives contact with an unattended loop.

That matters because my original Orca decision was partly built on "conserve Claude credits by routing background work through Gemini instead." That logic doesn't survive: any autonomous background build is API-metered on *both* vendors regardless of which harness drives it. The real lever isn't which subscription you protect — it's whether you're measuring cost per successful build at all. Which, until recently, I wasn't.

## What each tool is actually for, once you stop comparing them

| Tool | Job | Verdict |
|---|---|---|
| Claude Code | Interactive, human-in-the-loop work | Keep — the one place a subscription is legitimately usable |
| Antigravity | IDE surface + Managed Agents for a live product build | Keep, but not the oracle runner too |
| Pi | Headless build-loop runner under an oracle | Adopt, specifically for this |
| Orca | Build environment for personal-project worktree work | Retired — Pi's daemon covers the same ground with far less per-turn overhead |
| A control plane above all of it | Scheduling, task queue, policy | Still the right layer, deliberately not built ahead of need |

The row that actually cost me something to write is Orca's. It's a genuinely good tool — the K9crush and Cratis harness spikes I ran on it found real bugs, including a legitimate upstream framework issue I filed and got acknowledged. Retiring it isn't a verdict on its quality. It's a verdict on *duplication*: once a harness exists whose entire design brief is "be driven headlessly, impose none of your own approval gates, stay out of the way of a build-verify loop that supplies its own," a GUI-first worktree reviewer is doing a job that's already covered elsewhere, at higher per-turn overhead.

## Why Pi specifically earns the oracle-runner slot

An oracle-gated build loop has a particular shape: it needs to run many build-verify cycles unattended, it must *not* bring its own approval gates (the surrounding framework supplies those), and it needs to be driven programmatically rather than through a chat window. Pi fits that brief unusually well for reasons that are mostly about what it *doesn't* do:

- **A sub-1K-token system prompt** that stays flat across every iteration of a loop, instead of compounding context overhead the way a heavier, feature-complete harness does over dozens of cycles.
- **Opt-in safety features rather than in-the-way ones** — no permission popups blocking an unattended run, because the oracle framework already owns that decision.
- **An `AgentConnection` SDK seam** designed for headless driving from day one, not a chat-first tool with a CLI mode bolted on afterward.

The philosophy behind this is the interesting part, and it's a genuine fork in how these tools get designed. Pi explicitly excludes MCP, sub-agents, and permission popups from its core, on the stated premise that you build those as extensions only when you actually need them. That's the opposite bet from a framework like LangChain's Deep Agents, which ships a planning loop, first-class subagents, and built-in human-in-the-loop interrupts as defaults. Deep Agents bets that most people want the batteries in the box. Pi bets that most people are carrying weight they don't use. Neither bet is wrong in general — but for a harness that's going to run underneath something else's verification logic, minimal is the right side of that bet.

## What the test actually showed

The test ran sooner than planned — the hypothesis needed the number, and waiting wasn't buying anything. I took two frozen slices from the K9crush eval harness (`GetPendingApplicationsQueue` and `RejectApplication`), ran each through Claude Code and through Pi, pinned both sides to the same Sonnet model, and recorded cost per successful build:

| Slice | Runner | Result | Wall clock | Cost |
|---|---|---|---|---|
| GetPendingApplicationsQueue | Claude Code | Passed | 6.68m | $0.918 |
| GetPendingApplicationsQueue | Pi | Passed | 6.28m | $0.0168 |
| RejectApplication | Claude Code | Passed | 3.47m | $0.455 |
| RejectApplication | Pi | Passed | 7.97m | $0.0166 |

Identical pass/fail outcomes, similar wall-clock time, and Pi came in roughly **27–55× cheaper per successful build**.

That's the number the whole exercise existed to get: not a vendor's pricing page, not a back-of-the-envelope token estimate — an actual measured cost per successful build on the same tasks. The lazy-skill, sub-1K-token, no-approval-gates bet paid off exactly where I'd hoped, at the cost line rather than the capability line.

Now the caveats, because a single cheap run isn't a proof and I don't want this quoted as one:

- **Two slices, one run each, no repeats.** It's a real signal, not a statistically solid baseline. The 27–55× spread is the honest range across the two tasks, not a stable ratio to bank on.
- **Same model on both sides.** The comparison is harness overhead, not model quality — Sonnet was pinned on both, so the delta is Pi's per-turn efficiency versus Claude Code's, not frontier-versus-cheap. The cheap-model tier below is a separate, still-unmeasured question.
- **The headless plumbing wasn't free.** Pi needed `--api-key` passed explicitly (it doesn't fall back to `ANTHROPIC_API_KEY` from the environment), and a real multi-file coding transcript is too large to pass as a CLI argument — it has to go through temp files. Small things, but they're the difference between a clean unattended run and a stalled one.

I'm still watching the daemon-stability failure mode — two slices don't exercise what happens after the fortieth iteration of an overnight loop. That's the next measurement, not the one above.

## The cheap-tier idea riding along with this

One more piece worth naming, because it's easy to conflate with the harness question and it isn't the same thing: which *model* does the coding versus which model handles the dozens of low-judgement calls a build-verify loop fires per run — re-checking a verification step, triaging lint output, deciding whether a failure is worth a retry or an escalation. Those calls don't need frontier reasoning, and I'm planning to test Gemma 4 on GCP specifically for that tier — not as the coder, just as the cheap, high-frequency layer underneath it, while a stronger model stays on the planning and slicing step where judgement actually pays. That's a separate measurement from the harness question above, and I'm deliberately not committing to a specific setup or cost number until it's actually been run — vendor pricing pages are not a substitute for your own measured numbers.

## Where this leaves the stack

Fewer harnesses, each with exactly one job, and a cost question that now has a measured answer instead of a vibe: on the same tasks, Pi did the same work for 27–55× less. Pi is the standing headless runner; the cheap-model tier below is the next measurement, still deliberately uncommitted.

That's a smaller claim than "I found the best agent tool," and it's the one that's actually true — now with a number attached.
