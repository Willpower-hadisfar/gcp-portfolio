---
title: "Observability Tells You What Happened, Evals Tell You If It Was Any Good"
date: 2026-08-13
description: "Why LLM observability and evaluation are two different jobs — and the loop (trace, evaluate, regression-test, deploy, pull failures back into the dataset) that most teams still aren't running end-to-end."
tags: ["llm-observability", "evals", "ai-in-production"]
readingTime: "6 min"
draft: false
---

Traditional application monitoring has a comfortable story: the request returned 200, latency was 1.8 seconds, CPU sat at 40%, the database query took 100ms. Every signal says the system worked.

An LLM application can hit every one of those marks and still be wrong. The retrieval step can pull the wrong document while the HTTP status reads 200. An agent can chain fourteen tool calls, burn a few thousand tokens, and land on a confident, incorrect answer. None of that shows up in APM.

This is the gap that LLM observability and evaluation tooling exists to close, and in 2026 it's moved from optional tooling to something closer to core infrastructure for any team running AI in production.

## Two different jobs, often confused as one

Observability captures what your AI application actually did: prompts, model calls, retrieval steps, tool calls, outputs, tokens, latency, cost. Evals answer the question observability can't — was the output any good?

Take a customer-support agent handling: "What's the refund policy for annual subscriptions?" A trace tells you it retrieved a document, called the LLM, and returned an answer in 1.2 seconds for $0.02. It does not tell you whether the document was the right one, whether the answer stayed faithful to it, or whether the agent quietly invented a refund window that doesn't exist. That's what an eval suite is for — scoring dimensions like correctness, faithfulness, retrieval quality, tool correctness, and safety against a dataset of test cases.

## Offline vs. online evals

There are two loops, and the distinction matters operationally.

**Offline evals** run before deployment, against a fixed test dataset. Change a prompt, rerun the suite, compare. The new prompt improved one thing and quietly damaged another — exactly the kind of regression that latency and error-rate metrics will never catch, because nothing "broke" in the traditional sense.

**Online evals** score live production traffic, typically via an LLM acting as judge, sampling real traces and grading them for faithfulness, relevance, or task completion. The payoff is the loop this enables: a production trace that scores badly — a user complaint, a hallucinated policy — gets pulled into the regression dataset. Future releases have to pass against that exact failure before they ship. Production failures become permanent test cases. That feedback loop, more than any individual dashboard, is the actual discipline being sold here.

## Four ways to score an output

- **Deterministic checks** — did it parse as valid JSON, contain the required fields, call the right tool, stay within a numeric range. Cheap, objective, and you should use as many of these as the task allows before reaching for anything softer.
- **LLM-as-judge** — another model scores subjective qualities like tone, helpfulness, or groundedness. Useful precisely where deterministic checks can't reach, but worth validating against human-labeled examples rather than trusting blind — a judge model has its own failure modes and biases.
- **Human evaluation** — a person reviews input, expected answer, actual answer, and judge score, and produces the ground truth the automated judge gets calibrated against.
- **User feedback** — thumbs up/down and complaint text, fed back into the dataset like any other production signal.

None of these substitute for the others. A mature setup uses deterministic checks as a floor, LLM-as-judge for scale, and human review to keep the judge honest.

## The platform landscape, briefly

The category splits into four camps, and which one fits depends on what you're actually optimizing for:

- **AI-native platforms** (Langfuse, LangSmith, Braintrust, Arize) treat the trace as the primary object and attach eval scores to it.
- **Eval-focused libraries** (Phoenix, DeepEval, RAGAS, MLflow) focus on scoring — faithfulness, hallucination, relevance — often as something you layer on top of your own tracing.
- **Gateways** (Helicone, Portkey, LiteLLM) sit as a proxy in front of model providers, giving you cost and latency visibility with almost no instrumentation effort, at the cost of trace depth.
- **APM extensions** (Datadog, New Relic) bolt LLM signals onto infrastructure monitoring you already run.

**Langfuse** is the one worth investigating first if you don't already have a strong opinion. It's MIT-licensed, genuinely self-hostable, and covers tracing, prompt management, datasets, LLM-as-judge, human annotation, and cost tracking in one product — which matters if data residency or vendor lock-in is a real constraint rather than a theoretical one.

**Arize Phoenix** is the OpenTelemetry-native alternative, strong if you want the observability layer decoupled from any single vendor. Worth checking the license carefully — Phoenix ships under Elastic License 2.0, which is source-available rather than OSI-approved open source, a distinction that matters for some procurement processes even if it changes nothing about day-to-day usage.

**Braintrust** is the eval-first option: the workflow — dataset, experiment, evaluator, regression gate — is the product, not an add-on to tracing.

**LangSmith** makes the most sense if you're already committed to LangChain or LangGraph, where the integration is near-zero-friction. Outside that ecosystem it's a less obvious default.

**Datadog** is the right call only if you're already standing there — the value is correlating AI failures with the infrastructure and incident tooling your team already lives in, not deeper eval capability.

## The architecture worth defaulting to

Rather than picking a platform as the foundational abstraction, standardize on OpenTelemetry's GenAI semantic conventions (`gen_ai.*`) as the instrumentation layer, and treat the observability backend as swappable underneath it.

The conventions are already backed by a CNCF project and adopted across Google Cloud, AWS, Azure, Datadog, and increasingly the coding-agent tooling itself. Instrumenting against `gen_ai.*` rather than a vendor SDK means a backend swap doesn't mean re-instrumenting the application — which, given how fast this category is still consolidating, is not a hypothetical concern.

## The actual discipline

The tempting mistake is treating this as a tooling decision — pick the platform, install the SDK, done. The tooling is downstream of a loop:

**Build → trace it → evaluate (deterministic + judge) → score → regression-test → deploy → observe production → pull failures into the dataset → repeat.**

The market data backs up how uneven adoption of that full loop still is: surveys put agent observability adoption at around 89%, but offline eval adoption at only ~52% and online eval at ~37%. Most teams are watching what their agents did. Far fewer are systematically gating what ships. That gap — not which vendor logo you pick — is where the actual risk sits.
