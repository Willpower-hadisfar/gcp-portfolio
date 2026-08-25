---
order: 6
title: "Agentic Harness Engineering"
subtitle: "Deterministic governance for autonomous coding agents"
category: "AI"
summary: "A self-repairing PHI anonymizer built with zero human-written code, gated by hard test/lint checks and a kill switch."
tech: ["Google ADK 2.0", "Antigravity SDK", "Gemini", "pytest", "ruff"]
---
### System Architecture
A deterministic harness wrapping Google's Antigravity coding-agent SDK inside an ADK 2.0 graph workflow: the agent writes 100% of the application code, and hard automated gates (pytest, static analysis) — not manual review — decide whether its output is accepted, in a closed write-test-repair loop with a hard iteration cap.

### The Finding
The agent solved the task correctly on its first live attempt, but the harness's own lint gate had a scope bug — it was linting a seed file the harness itself had planted, not just the agent's output — and rejected a working solution five times running before the kill switch fired. Fixing the gate's scope (not the agent's approach) took it from always-fails to a clean first-try pass. Full write-up: [PHI Anonymizer Harness Case Study](/writing/phi-anonymizer-harness-case-study).

> **The point isn't the bug.** It's that a deterministic harness produces a trajectory log detailed enough to prove *which* layer actually failed — the agent, or its own governance.
