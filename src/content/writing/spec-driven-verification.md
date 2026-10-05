---
title: "Verification Criteria That Derive From Requirements (Not Invented Next to Them)"
date: 2026-09-14
description: "Change a rule on an Event Modeling board and watch a previously-passing build fail — with zero code changes. The one-way path from a spec artefact to acceptance criteria, an oracle gate, and drift detection."
tags: ["event-modeling", "spec-driven-development", "verification", "agentic-ai"]
readingTime: "8 min"
draft: false
relatedProject: "nomothetes"
---

I built something small this month that produced a specific, reproducible moment. It's not a model, not a framework, not a pipeline of pipelines. It's a one-line outcome:

**I changed a rule on an Event Modeling board. A build that had been passing started failing — and I never touched the code.**

That sentence is either trivial or it's the whole point, depending on how much of your verification you currently invent by hand next to your requirements instead of deriving from them. For me, it was the point.

## The half of the SDLC that's empty

Most of my recent work has been in the *build* half of the software lifecycle. That half is, honestly, over-served — I've run five different agent harnesses, several codegen paths, and more scaffolding than I care to admit. But the *verify and hand over* half was empty: acceptance criteria written after the fact, test cases invented in a review to match whatever the code happened to do, and "done" defined as "the agent said it was done."

The empty half is the half people actually pay for. If I ship code and hand it to a client, what they're buying is confidence that the code does what was agreed — and that confidence has to come from somewhere mechanical, not from my assurance that I checked.

So the question became: can I make the verification *derive* from the requirement, deterministically, instead of being authored beside it?

## One artefact, propagated forward

The spine is a single source of truth: a storyboard canvas — an Event Modeling board with a Layer 2 Example Mapping drill-down. Each slice carries a set of structured cards:

- **Rule** (yellow) — the business rule the slice must satisfy.
- **Example** (green) — a concrete Given/When/Then case that instantiates the rule.
- **Question** (red) — a first-class "we don't understand this yet" marker.

The key design choice (which I've written up as an ADR) was to force acceptance criteria into this structured-card shape rather than parse them out of free prose. It costs an extra authoring step, but it buys two things prose can't: a *deterministic* export into a machine-checkable format, and an *unresolved-question signal* that a parser would silently paper over.

From that board, a small exporter produces a `specifications[]` array — one entry per Example, carrying its Rule and its Given/When/Then — in exactly the shape the build pipeline's test-authoring step already consumes. One test is written per specification. That's the whole forward path:

**board → specifications[] → tests → gate**

## The gate that stopped trusting the agent

Here's the part I'm slightly embarrassed about: the pipeline already had a gate. It just trusted the wrong thing.

The eval harness ran a slice's build, confirmed it compiled, confirmed at least one test ran — and then asked the agent whether it was done. If the agent said "done," the slice passed. Independent spot-checking found that **a quarter of the mechanically-passing runs had silent bugs the gate missed** — because "the agent self-reported complete" is not a verification step, it's a courtesy.

The fix was small and concrete: stop trusting the report, and start counting. After a run, the gate now counts the real test methods in the slice's test files and compares them against the number of specifications seeded from the board. If coverage falls short, the gate fails with a `spec-coverage` error and blocks the build — regardless of whether `dotnet test` itself came back green.

That's it. No semantic reasoning, no LLM judging the tests. Just a ground-truth count against a requirement-derived number. It's the least sophisticated possible check, and it closed a gap that had been silently swallowing real bugs.

## The moment

The coverage gate needed proving, and the proof is the part I keep coming back to.

I took a real slice — `RejectApplication`, from the K9crush eval harness — with two specifications and two passing tests. The gate read that as **PASS (2 ≥ 2)**.

Then I made a board-only change: through the app's own data layer, I added a third Example under the existing Rule — "Rejecting an application that is already rejected," a genuine business scenario the slice didn't cover. I re-exported the board, re-wired the specifications file, and ran the *same* command against the *same* code.

**FAIL (2 < 3).**

No code changed. No test file changed. `git status` on the code directory was clean. The only difference between a passing build and a failing one was a requirement on a board — and the failure was *correct*: the code genuinely didn't handle the new scenario.

That's the differentiated claim, in one before/after: **verification criteria that derive from requirements, not invented next to them.** The board edit *is* the test plan. When the requirement changes, the gate changes, and the build tells you — immediately, mechanically — that the code no longer matches what was agreed.

## What the count is blind to (and why drift matters)

A coverage count has an obvious hole: it only sees *how many*, not *what*. Change the wording of an existing specification — same count, no new test — and the count stays green while the code no longer matches what's actually specified.

So the second half of the mechanism is drift detection: a structural diff that names exactly which specification changed and which field, rather than reporting "something changed." The subtle part is the baseline. A baseline that updates itself on every passing check can never detect drift — the check would overwrite the old baseline with the drifted content before anyone saw the difference. So recording a baseline is a *separate, deliberate* action, never an automatic side effect.

I demonstrated it the same way: recorded a baseline from the last known-good state, then changed one specification's `then` clause only (count unchanged). Coverage stayed green — `2 ≥ 2` — while drift correctly flagged the exact change. Both checks together close what either alone misses.

## What I'm not claiming

Three things, because this project has a hard rule about not overstating progress:

1. **It's a coverage-count heuristic, not semantic verification.** The gate knows *that* N tests exist, not *that* test N actually verifies specification N's content. Real semantic matching is harder work, and I haven't done it.

2. **The third specification is still genuinely uncovered.** I left it that way on purpose — a real gap on record, not reverted to make the demo tidy. Closing it is real product work, still open.

3. **The Given/When/Then is free prose, but the real format is symbolic.** The Example card's GWT is human text; the build pipeline's real `given`/`when`/`then` are arrays of named domain events. The coverage check doesn't need to resolve that gap — it only needs counts — but any future semantic check will have to. It's flagged, not silently resolved.

## Why this matters

None of this is a new framework or a clever model. It's a one-way path from a single artefact to a mechanical check, with the honest gaps named out loud.

But it's the part of the SDLC I was missing, and it's the part I can now demonstrate to a client: *here's the board that defines what we agreed. Here's the gate that derives from it. Change the board and watch the build — you don't have to take my word that the code matches the spec, because the spec is what's failing the build.*

That's a smaller claim than "I automated verification." It's also the one that's actually true.
