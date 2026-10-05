---
order: 6
title: "Agentic Harness Engineering"
subtitle: "Deterministic governance for autonomous coding agents, now powering Hadisfar Health's platform build"
category: "AI"
summary: "Started as a self-repairing PHI anonymizer built with zero human-written code, gated by hard test/lint checks and a kill switch — the same harness discipline now underpins ongoing platform engineering for Hadisfar Health."
tech: ["Google ADK 2.0", "Antigravity SDK", "Gemini", "pytest", "ruff", "Terraform", "GCP"]
---
### System Architecture
A deterministic harness wrapping Google's Antigravity coding-agent SDK inside an ADK 2.0 graph workflow: the agent writes 100% of the application code, and hard automated gates (pytest, static analysis) — not manual review — decide whether its output is accepted, in a closed write-test-repair loop with a hard iteration cap.

### The Finding
The agent solved the task correctly on its first live attempt, but the harness's own lint gate had a scope bug — it was linting a seed file the harness itself had planted, not just the agent's output — and rejected a working solution five times running before the kill switch fired. Fixing the gate's scope (not the agent's approach) took it from always-fails to a clean first-try pass. Full write-up: [PHI Anonymizer Harness Case Study](/writing/phi-anonymizer-harness-case-study).

> **The point isn't the bug.** It's that a deterministic harness produces a trajectory log detailed enough to prove *which* layer actually failed — the agent, or its own governance.

### Beyond the PoC

The PHI anonymizer was the proving ground. The harness pattern — agent writes the code, hard automated gates decide if it's accepted — is now the working method behind ongoing platform engineering for [Hadisfar Health](https://hadisfarhealth.com), covering infrastructure (Terraform on GCP), backend services, and site content, with the same deterministic-gate discipline applied throughout.
