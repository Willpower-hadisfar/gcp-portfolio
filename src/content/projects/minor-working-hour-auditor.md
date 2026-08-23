---
order: 4
title: "Minor Working-Hour Auditor"
subtitle: "Legal compliance co-pilot for film production scheduling — Google Cloud Agentic Cinema Hackathon entry"
category: "AI"
summary: "Agent that audits film production schedule changes against child-labor law, flagging contested statutory interpretations rather than silently resolving them."
tech: ["Python", "Gemini", "ClickHouse", "MCP", "Streamlit"]
repoUrl: "https://github.com/Powerworks/Minor-Working-Hour-Auditor"
---
### Overview
Entry for the Google Cloud Agentic Cinema Hackathon (ClickHouse track): an agent that reads a plain-English film production schedule change and audits it against child-labor law before a production manager acts on it.

### How it works
- **Flow:** Natural-language schedule change → Gemini reasoning (manual tool-calling loop, not a framework, so every step is inspectable) → dynamic read-only SQL against ClickHouse via a single frozen MCP tool → compliance delta calculation → structured Audit Report.
- **Guardrails:** The ClickHouse MCP server enforces a hard read-only boundary (SQL keyword allow/deny-listing) — the agent can query cast and labor-law data but can never write to the database. All legal facts come from queried rows, never the model's own parametric knowledge.
- **Contested-law flagging:** California's own labor code doesn't fully agree with itself for the 16–18/school-day band (two statutes cap hours differently, one hour apart, with no statutory statement of which governs). Rather than silently picking a side, the agent surfaces this as `rule_confidence: contested_interpretation`, cites both statutes, and flags it for human legal review — an explicit design choice that an agent which is always confident is more dangerous than one that knows when it's uncertain.
- **Build:** Two parallel git-worktree slices (compliance logic; UI/integration) built independently against a locked schema and MCP tool contract, driven by Orca, then verified by reading the actual diffs.
- **Data sourcing:** California labor-law rows sourced directly from primary statute/regulation text (8 CCR §11760, Cal. Labor Code §1308.7), not secondary summaries — a cross-check against the verbatim text caught a real error in an early secondary source.
