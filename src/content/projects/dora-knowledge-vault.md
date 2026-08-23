---
order: 3
title: "DORA Knowledge Vault"
subtitle: "Navigable knowledge graph of the EU Digital Operational Resilience Act"
category: "Architecture"
summary: "Open-source tool that parses the EU DORA regulation into a cross-referenced, verifiable knowledge base."
tech: ["Python", "EUR-Lex", "Obsidian", "Knowledge Graphs"]
repoUrl: "https://github.com/Powerworks/dora-knowledge-vault"
---
### Overview
An open-source tool that turns Regulation (EU) 2022/2554 (DORA) — a primary legal text — into a cross-referenced, navigable knowledge base rather than a flat document, extending a Higher Diploma in Business, Regulatory Risk & Compliance (DORA-focused) into a working artifact.

### Build
- **Authoritative-text backbone:** A deterministic parser fetches the EUR-Lex HTML rendition of the regulation, parses it structurally, and asserts its output against the published article/recital/definition counts — failing the build on any mismatch rather than trusting the parse silently.
- **Zero fabricated cross-references:** A post-build verification pass caught and fixed an early bug where references to *other* legal instruments were being mislinked as internal DORA cross-references.
- **Editorial layer:** Hand-curated actor, concept, and obligation hub notes layered on top of the parsed text — binding specific compliance obligations to the actor and article/paragraph that impose them, without altering the verbatim source.
- **Open-sourced:** Published as a standalone, MIT-licensed public repository (editorial content and build tooling; the regulation's verbatim text remains © EU under its own reuse policy), with an explicit "not legal advice" disclaimer.
