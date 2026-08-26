---
title: "Running with Scissors: How Tech Evolution Means the Risks Just Change Shape"
date: 2026-08-18
description: "Docker-era chaos got tamed into boring infrastructure — but the same reckless-speed pressure just moved up the stack onto generative AI and modern software supply chains."
tags: ["engineering-culture", "platform-risk", "ai-adoption"]
readingTime: "3 min"
draft: false
---

Back when Docker was first taking the tech world by storm, a CTO summed up the state of software engineering with a phrase that stuck:

*"We are running with scissors, and we look around and everyone else is running just as fast with scissors."*

It perfectly captured the chaotic, thrilling, and downright terrifying reality of early cloud-native infrastructure. You were taking raw, unproven technology, slapping it into production, and praying it didn't blow up — because if you didn't, your competitors would outpace you before the quarter ended.

Looking at where we are today, it raises an obvious question: **Have we finally matured, or does that quote still stand to reason?**

The short answer? We've definitely grown up. But the scissors have just changed shape.

---

## Where We've Matured: Putting Safety Guards on the Infrastructure

In the early Docker era, running containers in production felt like tap dancing in a minefield. You were dealing with raw kernel panics, flaky networking drivers, and a total lack of persistent storage standards. It was pure wild west.

Today, that wild west has been paved over:

- **Standardization and Reliability:** Containers are no longer experimental; they're boring infrastructure. Technologies like Kubernetes, managed cloud engines (AWS ECS, Google Cloud Run), and OCI standards have turned containerization into a utility as dependable as electricity.
- **Managed Guardrails:** Engineering teams rarely build basic plumbing from scratch anymore. Security scanning, automated CI/CD pipelines, and zero-downtime deployments are built directly into modern platforms.

In many ways, the infrastructure we used to sprint with has been replaced with safety scissors.

---

## Why the Quote Still Applies: The New Edge of Innovation

Even though yesterday's risky tech is today's standard, the underlying pressure to move fast hasn't vanished — it has just shifted up the stack.

### The AI Rush is the New Docker

Replace "containers in 2013" with "Generative AI and autonomous agents today." Organizations are rushing non-deterministic models and experimental tools directly into enterprise workflows with minimal security frameworks or long-term safety testing. Why? Because standing still feels like commercial suicide.

### Modern Supply Chain Chaos

While our core infrastructure is safer, our software supply chains are vastly more complex. Modern applications rely on thousands of open-source dependencies and third-party APIs. Sprinting at today's required speed means constantly accepting hidden vulnerabilities just to ship on time.

### Accelerated Market Expectations

The baseline speed of business has fundamentally changed. Ship cycles have compressed from quarterly or weekly releases to continuous deployment. Moving cautiously often means getting out-executed by a competitor who is willing to take the risk and fix the bugs live in production.

---

## The Verdict

So, are things different now? **Yes and no.**

The specific tools that used to keep CTOs up at night during the Docker boom are now safe, structured, and predictable. But technology evolution is a treadmill that only speeds up. The moment one layer of the stack becomes secure, we invent a brand-new, unproven layer on top of it — pick up the sharpest tools available, and start sprinting all over again.
