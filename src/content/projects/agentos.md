---
order: 1
title: "AgentOS"
subtitle: "Personal agent control plane"
category: "AI"
summary: "Self-hosted control plane for running autonomous coding agents unattended, on a schedule, against real repositories."
tech: ["Claude Agent SDK", "Python", "Google Cloud Platform", "MCP"]
---
### Overview
A self-hosted control plane for running autonomous coding agents unattended, on a schedule, against real repositories — headless branch → implement → test → PR pipeline built on the Claude Agent SDK, MIT-licensed and public.

### What's actually built
- **Unattended pipeline, verified end-to-end:** Pointed at a real repo with a well-scoped task, the pilot branched, implemented, ran the full test suite, committed, and opened a real pull request — no manual babysitting.
- **Defense-in-depth permission enforcement:** A real production bug surfaced and was fixed during development — auto-approved tool allowlists were bypassing the policy callback entirely, and even after that fix, the coding agent's own sandbox executed some commands directly without ever consulting the permission check. Closed with a pre-tool-use hook that fires before the sandboxing decision, verified against both denied and allowed commands.
- **Isolated cloud deployment:** Runs on a dedicated GCP project with a private VPC, deny-all ingress except IAP-tunneled SSH, NAT-only egress, and a service account scoped via conditional IAM bindings to only the two secrets it actually needs — nothing project-wide.
- **File-based task queue:** A pending/processing/done/failed inbox with atomic claiming, a CLI trigger surface, and a worker that runs on a timer — the first real unattended, scheduled run of the system, currently instrumented with per-run cost and success-rate metrics as the baseline for future model-routing decisions.
- **Honest about scope:** Still a single linear pipeline — no parallel agent fan-out, multi-profile isolation, or chat-based triggers yet.