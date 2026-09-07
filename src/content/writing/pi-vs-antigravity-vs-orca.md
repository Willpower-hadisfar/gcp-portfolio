---
title: "Pi vs. Antigravity vs. Orca: One Job Per Harness, Not One Harness to Rule Them"
date: 2026-09-08
description: "Why I retired Orca, kept Antigravity for exactly one job, and picked Pi as the headless runner underneath an oracle-gated build pipeline — plus the subscription-metering trap that made 'conserve API credits' the wrong question."
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

## What I'm actually testing before I trust this

None of the above is a decision yet — it's a hypothesis with a test attached. The plan: take a reference build kit I already have a working baseline for, run it through Pi's SDK with the project's constitution doc and oracle gates wrapped around it, use a cheap model as the coder via API key, and measure tokens-per-successful-build against the existing Orca baseline on the same tasks.

If the lazy-skill model holds up at real constitution-doc scale — not a toy prompt, the actual rules a build has to satisfy — that's the signal to make Pi the standing runner. If it doesn't, I want to know *why* before committing anything unattended to it. The specific failure mode I'm watching for is daemon stability under sustained autonomous load. A harness that's flaky after the fortieth iteration of an overnight loop is worse than a heavyweight, reliable one — a stall three hours into an unattended run costs more than the tokens a leaner harness ever saved.

## The cheap-tier idea riding along with this

One more piece worth naming, because it's easy to conflate with the harness question and it isn't the same thing: which *model* does the coding versus which model handles the dozens of low-judgement calls a build-verify loop fires per run — re-checking a verification step, triaging lint output, deciding whether a failure is worth a retry or an escalation. Those calls don't need frontier reasoning, and I'm planning to test Gemma 4 on GCP specifically for that tier — not as the coder, just as the cheap, high-frequency layer underneath it, while a stronger model stays on the planning and slicing step where judgement actually pays. That's a separate measurement from the harness question above, and I'm deliberately not committing to a specific setup or cost number until it's actually been run — vendor pricing pages are not a substitute for your own measured numbers.

## Where this leaves the stack

Fewer harnesses, each with exactly one job, and a cost question that finally has a plan to answer it instead of a vibe. That's a smaller claim than "I found the best agent tool," and it's the one that's actually true.
