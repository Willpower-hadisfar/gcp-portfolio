---
title: "When Your Governance Layer Is the Thing That's Wrong"
date: 2026-09-01
description: "An autonomous coding agent solved a HIPAA-shaped PHI anonymizer correctly on its first live attempt — and a deterministic harness failed it five times anyway, because the wrong file was under scrutiny."
tags: ["agentic-ai", "google-adk", "governance", "case-study"]
readingTime: "6 min"
draft: false
relatedProject: "hadisfar-health-harness-poc"
---

**The setup**: a deterministic harness for an autonomous coding agent — the agent writes 100% of the code (a HIPAA-shaped PHI anonymizer microservice for a synthetic scenario), and hard, automated gates (pytest, static analysis) decide whether its output is accepted, in a closed write-test-repair loop with a hard iteration cap — a kill switch — rather than unlimited retries. Built on Google's Antigravity SDK wired into ADK 2.0's graph-based workflow engine, via a first-class bridge (`google.adk.labs.antigravity.AntigravityAgent`) most documentation doesn't surface clearly yet.

**What actually happened on the first live run**: the agent got it right. Its 86-line, zero-human-edit implementation passed every seed test and was clean under an isolated lint check — correct SSN/name/DOB masking, no raw PHI ever logged, missing-field cases handled safely. By any reasonable measure, the task was solved.

The harness still failed it. Every one of its 5 iterations came back rejected, and the kill switch terminated the run as `FAILED_MAX_ITERATIONS` — on a working solution.

**Why**: the static-analysis gate ran a lint check over the *entire* sandbox directory, not just the agent's own file. Sitting in that sandbox was a seed test file the harness itself had planted before the agent ever ran — and that seed file had a small, pre-existing lint violation (an unused import) that had nothing to do with the agent's code. The agent had no way to fix it: it wasn't told to touch that file, and shouldn't be allowed to edit the file that's meant to hold it accountable. Every retry, it fixed its own code correctly and got told no anyway, for a reason entirely outside its control.

**The point isn't the bug — it's what caught it.** This is exactly what a deterministic harness is for: not just gating the agent's output, but producing a full trajectory log that makes a governance-layer bug visible and attributable, instead of silently eating a correct solution and reporting "the AI failed" with no further explanation. Without the trajectory log, the natural read of `FAILED_MAX_ITERATIONS` is "the agent couldn't solve it." With it, the actual story is legible: five loop-backs, five instances of the agent doing exactly the right thing, one governance check with a scoping bug.

**The fix, confirmed**: scoped the lint check to agent-authored files only — excluding the harness's own seed files from the same rule that's meant to police agent output. Reran the full harness from a genuine zero-line state. The agent passed on its very first attempt: one iteration, no retries, clean on both the test suite and the lint check. Nothing about the agent's approach had to change; the only thing that changed was making the gate honest about what it was actually checking.

**The lesson for AI governance work generally**: the instinct is to treat every gate the same way — pass/fail, no further thought. But a gate that scores its own scaffolding by the same rule as the thing it's judging will eventually produce a false negative, and the only way to tell the difference between "the agent failed" and "the gate is wrong" is a trajectory log detailed enough to show which one actually happened. Deterministic governance isn't just about stopping bad output — it has to be legible enough to catch itself being wrong, too.
