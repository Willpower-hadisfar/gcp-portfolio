---
order: 7
title: "Rütli"
subtitle: "An audit-and-policy gate for autonomous agents"
category: "AI"
summary: "Swiss AI Hackathon (Apertus track) submission: a hash-chained, tamper-evident audit ledger and policy gate sitting in front of an LLM agent, with crypto-shredding erasure built in from day one."
tech: ["Apertus 1.5", "Python", "Event Sourcing", "WORM Storage"]
repoUrl: "https://github.com/Powerworks-Global/ruetli"
---

# Rütli

A submission to the Swiss AI Hackathon's Apertus track: an auditor that sits between an autonomous agent and the tools it's allowed to call, gating every action against policy and recording an immutable, tamper-evident trail of what the agent actually did.

### What's built

- **Hash-chained audit ledger** — every agent action is recorded as an event in an append-only chain; altering a past entry breaks the chain.
- **Policy gate** — actions are checked against policy before execution, not logged after the fact as an afterthought.
- **Crypto-shredding erasure** — GDPR/FADP-style right-to-erasure support designed in from the start, rather than bolted on.
- **Local append-only WORM mirror** — a second, independent tamper check that catches the harder case: someone sophisticated enough to fool the hash chain alone.
- **Eval harness** — a runner, metrics, and a replay CLI to compare gated vs. ungated agent behaviour on a realistic task set.

Named for the 1291 oath that founded the Swiss Confederation — a mutual-trust, mutual-verification pact, which is exactly what a policy-gated agent ledger is trying to be.
