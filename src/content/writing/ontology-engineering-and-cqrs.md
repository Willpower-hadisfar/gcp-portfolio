---
title: "Ontology Engineering and CQRS"
date: 2026-08-16
description: "What an ontology actually is, when OWL/DL reasoning earns its cost over a plain knowledge graph, and why event sourcing and ontology engineering are orthogonal, not competing, concerns."
tags: ["ontology-engineering", "cqrs", "event-sourcing", "knowledge-graphs"]
readingTime: "5 min"
draft: false
---

## First principles: what an ontology actually is

An ontology is a **formal specification of a shared conceptualization** — classes, relationships between classes, and constraints/rules on those relationships, expressed in a logic that a machine can evaluate. That's it. Three layers, from weakest to strongest:

- **Taxonomy** — is-a hierarchies (Claim → PropertyClaim → WaterDamageClaim). No inference, just structure.
- **RDF/RDFS graph** — subject-predicate-object triples plus basic class/subclass semantics. This is "knowledge graph" territory. Still mostly descriptive, minimal inference.
- **OWL / Description Logic ontology** — adds *formal semantics with a decidable logic*, so a reasoner (HermiT, Pellet, ELK) can derive facts that were never explicitly stated. This is the layer that actually earns the word "ontology" in the strict sense — the others are graphs wearing the name.

The thing that makes DL ontologies different from "just a schema" is **open-world assumption + automated classification**: you assert facts and constraints, and the reasoner computes which classes an individual belongs to, checks the whole model for logical contradictions, and can explain *why* an inference holds. A relational schema or a class hierarchy in code does none of that — you write the classification logic by hand and it's closed-world (absence of a row means false, not unknown).

## When it's actually useful

Ontology engineering earns its cost when you have **two or more of**:

1. **Multi-hop classification that changes faster than your release cycle** — e.g., regulatory eligibility rules that combine 6+ conditions across several entity types, redefined quarterly by compliance, and you don't want a code deploy every time the definition of "sanctioned exposure" changes.
2. **A federated vocabulary problem** — multiple independent parties (not one team, one codebase) need to agree on what terms mean, and disagreement is costly. This is the actual historical driver: biomedical research (gene/protein ontologies — GO, SNOMED CT), not enterprise CRUD apps.
3. **Consistency checking matters more than throughput** — you need to *prove* the model has no contradictions, not just query it fast.
4. **Explainability of inference is a hard requirement** — regulators or auditors need "why does the system think this," not just the answer.

If you have none of these, you don't need OWL — you need a well-modeled schema and some rules, in code or a decision table. Most systems that reach for "ontology" actually just need a **taxonomy + a rules engine**, which is a fraction of the operational cost.

## Is it needed for event-sourced systems? No — orthogonal

Event sourcing answers "how did we get here" (write side, temporal, imperative). Ontology answers "what does 'here' mean, and what can I infer from it" (read side, atemporal, declarative). They don't compete, but ES doesn't *need* an ontology any more than it needs a relational read model — CQRS already gives you the seam to plug in whatever read-side representation fits the query need. A DL reasoner is one option among many for the read side; a normal projection is the default, and you only escalate past it when you hit the criteria above.

## What "modern" ontology engineering looks like now

The field has shifted meaningfully in the last 18 months, driven by LLMs on both the *construction* and *consumption* sides:

- **Construction is being semi-automated.** Traditional ontology engineering (NeOn methodology, manual Protégé modeling) is slow and expert-bottlenecked. Current work uses LLMs to draft class hierarchies and OWL axioms from requirements or unstructured text, with human review as a checkpoint rather than the whole job — methods like NeOn-GPT follow requirements-writing → OWL encoding → evaluation → documentation, producing fast first drafts but with hierarchy quality still depending on the LLM and no built-in validation. Known failure mode: deep concept hierarchies get flattened rather than properly nested.
- **Ontologies as LLM substrate, not competitor.** The framing of "ontology as semantic read model for AI" is roughly the live consensus, but the emphasis in practice is narrower than that framing suggests: the graph encodes the structural facts a domain actually needs (identity, versioning, regulatory logic), and the LLM operates inside that structure for reasoning within a bounded context, rather than the graph replacing the LLM's judgment ([arXiv](https://arxiv.org/pdf/2502.07223)). The insight driving this: most failures blamed on "model limitations" turn out to be representation failures — once the right structure is encoded, the model doesn't need to be a wizard ([arXiv](https://arxiv.org/pdf/2502.07223)).
- **GraphRAG** is the dominant applied pattern right now — building a knowledge graph (usually RDF/lightweight OWL, not full DL) from your corpus, then having retrieval walk the graph for multi-hop queries instead of relying purely on vector similarity. This is a *weaker* ontology commitment than full DL reasoning — most GraphRAG setups skip formal reasoning entirely and just use graph structure for retrieval.
- **Reasoners are still the unglamorous, unsolved-at-scale part.** None of this changes the tractability problem — LLM-assisted *construction* is new, but the *execution-time cost* of DL reasoning is the same engineering constraint it's always been.

## Bottom line

The filter to apply when a real requirement shows up: **do I need a reasoner, or do I need a graph?** Most "AI needs an ontology" pitches actually just need a well-structured knowledge graph feeding retrieval — which is cheap — dressed up in DL vocabulary that implies you need a reasoner, which is expensive and rarely justified outside federated-vocabulary or heavy-regulatory-inference domains.
