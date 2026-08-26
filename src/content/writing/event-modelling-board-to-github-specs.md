---
title: "Converting Event Modelling Board to GitHub Specs"
date: 2026-08-19
description: "A six-step pipeline for turning an Event Modeling board into GitHub Spec-Kit specs, keeping the architectural constitution separate from fast-changing feature slices."
tags: ["event-modeling", "spec-driven-development", "automation"]
readingTime: "2 min"
draft: false
---

A 6-step pipeline for automating Spec-Kit with Event Modeling, establishing a clear separation between long-term architectural governance and fast-changing feature slices.

| Stage | Artifact | Change Frequency | Authored / Managed By |
|---|---|---|---|
| 0. Scaffold | `.specify/`, project skeleton | Once (at project setup) | `specify init` |
| 1. Shape | `templates/overrides/spec-template.md` | Rarely (template structure) | Hand-crafted by engineer |
| 2. Rules | `.specify/memory/constitution.md` | Amendments only | `/speckit.constitution` (fed by ADRs) |
| 3. Content | `specs/00N-*/spec.md` | Every board edit | Generator script (`gen_specs_from_slices.py`) |

## Core Architectural Rules

- **Constitution Invariance:** Feature slices change frequently and must *never* dictate the constitution. The constitution enforces long-term rules (e.g., event immutability, integration boundaries), while slices describe specific capabilities.
- **Early Initialization:** Run `specify init` during scaffold setup (Step 0) so `.specify/` is tracked in version control before adding overrides.
- **1:1 Key-to-Heading Parity:** Name exported JSON keys identically to the Markdown template headings. This keeps the generator script acting as a simple data-mapping tool rather than a translation engine.

## Implementation Workflow

1. **Scaffold Repository:** Execute `specify init . --ai claude` and create `.specify/templates/overrides/`.
2. **Define Template Shape:** Populate `spec-template.md` with your slice skeleton (Commands, Events, Read Models, Screens, Scenarios, Traceability).
3. **Establish Constitution:** Feed architectural decision records (ADRs) and design rules to `/speckit.constitution` to produce testable principles.
4. **Export Board State:** Export slice metadata from your event-modeling board into structured JSON matching your template schema.
5. **Run Generator:** Execute `python gen_specs_from_slices.py` to produce structured spec files grouped by bounded context.
6. **Analyze & Execute:** Run `/speckit.analyze` to verify specs against your constitution, generate task breakdowns via `/speckit.tasks`, and pass tasks to your implementation loop.

## Critical Risk & Mitigation

Drift between JSON properties, template headers, and generator logic will break automation. Add a simple CI test that checks that every heading in your template override has a matching property in your JSON schema and generator branch.
