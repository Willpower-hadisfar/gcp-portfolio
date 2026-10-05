---
order: 0
title: "Nomothetes"
subtitle: "Event Modeling with a Verification Spine"
category: "Architecture"
summary: "An event-modeling canvas where a rule change on the board flips a passing build to failing — verification criteria derived from requirements, not invented next to them."
tech: ["React Flow", "TypeScript", "MCP", "xUnit", "Marten"]
repoUrl: "https://github.com/Powerworks-Global/nomothetes-engine"
---

# Nomothetes (Storyboard Canvas)

*Formerly EUnomia — renamed in October 2026 to avoid clashing with an unrelated open-source project of the same name.*

A CRUD-native event-modeling canvas — Actor/Screen/Action/Outcome swimlanes at Layer 1, a free-form Rule/Example/Question card set per slice at Layer 2 — that carries a spec forward into the code that has to satisfy it, instead of stopping at "generate code."

### The proof that matters

Edit a Rule on the board. Re-export. Watch an already-passing build fail, with the implementation code completely untouched.

That's the demo, not a claim: a genuine spec-to-oracle pipeline (Layer 2 Example Map → `specifications[]` export → a gate that fails on missing coverage, not on the agent's own self-reported "done") plus drift detection that catches a specification's *content* changing with no count change at all. Read the [full writeup](/writing/spec-driven-verification).

### What's built

- **Verification spine**: Example Mapping → executable acceptance criteria → a blocking gate → drift check, proven end-to-end against a real xUnit/Marten fixture.
- **Preset system**: 45 opinionated-but-overridable presets (modeling, design, testing, integration, billing, handover) resolving `default → org → project → user`, driving both the canvas UI (live theme/density) and the CLI exporters (billing snapshot, stakeholder digest, spec format).
- **Agent-native surface**: an MCP server (`list_slices`, `get_example_map`, `export_specifications`) so an agent can pull the verification spine directly, not just browse the board.
- **Handover, not just build**: runbook generation from board Actions, NFRs/SLOs declared in a project constitution, LGTM observability wired to those SLOs.

### On the roadmap

- Voice intake for capturing slices directly from a working session.
- Contextual nudges surfaced on the board as a spec drifts from its examples.
- A reusable pattern library for common slice shapes.

Personal MVP, proving out the design behind an internal Version 1 App Delivery Canvas pitch.
