---
order: 5
title: "MSc Advanced Cybersecurity Technologies, Governance & Research"
subtitle: "Research-track masters — application in progress"
category: "Research"
summary: "Research-track masters application investigating the gap between attested and independently verifiable compliance controls."
tech: ["EU AI Act", "ISO/IEC 42001", "NIST AI RMF", "DORA"]
---
### Overview
A research-track masters application, building on the Level 8 Higher Diploma in Business, Regulatory Risk & Compliance completed at TU Dublin (DORA-focused, Dec 2024). Application forms submitted; currently at the admissions interview stage.

### Research focus
The working thesis distinguishes three ways regulation can outpace technical reality — a timing gap, a verifiability gap, and a semantic gap — and commits to the **verifiability gap**: cases where compliance controls exist, but compliance with them can only be attested to, not independently verified.

- **Concrete case:** GDPR Article 17 (right to erasure) in event-sourced systems, where an append-only log is the system of record and the available reconciliations (crypto-shredding, PII externalization, tombstoning) are all controls nobody outside the organization can currently verify.
- **Empirical piece already underway:** running `dpia-generator`, a forked open-source Claude Skill that drafts GDPR Data Protection Impact Assessments and hard-fails its own build if a stated risk rating contradicts the underlying computed data, against a live event-sourced application (a personal project) to test whether that verifiability claim actually holds up in practice.
- **Method:** primary-instrument analysis (EU AI Act, ISO/IEC 42001, NIST AI RMF, DORA) classifying obligations by what they require as proof — documentary evidence, technical demonstration, or self-attestation — followed by a literature review and the empirical case study above.
