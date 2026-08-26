---
title: "Why We're Rebuilding Hadisfar Health From the Ground Up"
date: 2026-08-12
description: "An early look at why Hadisfar Health moved off managed WordPress hosting entirely — since revised: the live site now runs on Astro + Firebase Hosting + Cloud Run, not the Frappe Builder stack described below."
tags: ["case-study", "gcp", "website-migration"]
readingTime: "3 min"
draft: false
---

> **Update, 2026-08-26:** this post captures the thinking at the point the migration decision was made — get off managed WordPress hosting, own the platform. The specific stack named below (Frappe Builder) was an early direction that didn't end up shipping. The site that's actually live today, [hadisfarhealth.com](https://hadisfarhealth.com), runs on **Astro (static) + Firebase Hosting + Cloud Run** instead, with a separate [Open Mercato](https://github.com/open-mercato/open-mercato)-based clinic platform planned for the practice-management layer. The reasoning below about *why* to leave WordPress still holds; the *how* changed once the actual build started.

When we sat down to plan the new HadisfarHealth website, the honest answer is that WordPress wasn't broken. It was fine. That was actually part of the problem.

"Fine" meant a page builder plugin, a forms plugin, an SEO plugin, a security plugin — each one doing its one job reasonably well, stitched together into something that worked but that we didn't really *own*. Every feature we might want down the line — payments, a booking system, a community space — would mean finding another plugin, trusting another third party, and hoping they all kept playing nicely together indefinitely.

We wanted something different: to actually own the platform, understand how it's put together, and have the freedom to build exactly what we need on it rather than search a plugin marketplace and hope. That meant stepping off the "managed WordPress hosting" treadmill entirely and running our own infrastructure on Google Cloud — partly because it gives us real architectural control, and honestly, partly because it was something we wanted to properly learn by doing.

## The search

Our list of requirements was short but non-negotiable:

- A **real content management system** underneath the page builder — not just a page editor, but structured data we could actually build features on top of.
- **Genuine extensibility** — the ability to add real functionality (bookings, payments, community features) without duct-taping together five more plugins.
- **Full control**, since we're a health-focused business and don't want our data or our uptime dependent on someone else's plugin marketplace.
- Something we could run cost-effectively, without our hosting bill creeping up every year the way WordPress hosting tends to.

## Finding Frappe

That search led us to **Frappe Builder** — a visual, low-code website builder built on top of the Frappe Framework, the same open-source platform that powers Frappe.io itself.

What made it stand out wasn't the drag-and-drop editor, even though it's genuinely nice to use. It was what's underneath it: a real backend framework with structured data models, a proper API, and an actual extension system. Instead of plugins, Frappe lets us build small, purpose-built apps that plug directly into the site — Python on the backend, Vue on the frontend, no guesswork about whether two "plugins" will fight each other.

It's also open-source (MIT licensed), so there's no vendor lock-in and no surprise pricing tiers waiting for us down the line.

## Choosing the infrastructure

Rather than chase the newest, shiniest cloud architecture, we optimized for something boring and reliable: a self-hosted deployment on Google Cloud, running the official Frappe production stack — automatic HTTPS included, backups running on a regular schedule, everything under our own control.

No dependency on a page-builder company's servers, no "your site is on a shared host with 400 other WordPress sites" uncertainty. Just our data, on our infrastructure, sized appropriately for where we are today with room to grow.

## What's next: planned optimizations

With the foundation in place, the next phase is making sure the site actually performs — for visitors and for search engines:

- **SEO groundwork** — proper meta data on every page, a real sitemap, and structured data (schema.org markup) so search engines understand exactly what kind of business we are and what we offer.
- **Performance** — starting from a fast baseline instead of clawing back speed from plugin bloat.

## What's next: connecting the pieces

The site itself is step one. The roadmap from here is about turning it into a real hub for the people we serve:

- **Stripe integration** for straightforward, secure payments.
- **A self-help resource section**, so people can find guidance and information without needing to book an appointment for every question.
- **A community forum**, giving people a place to ask questions and support each other, not just a contact form into the void.
- **A Discord link**, for anyone who wants a more real-time, conversational space alongside the site.

None of these are bolted-on afterthoughts — each one is meant to be a natural extension of the same system, not a separate tool we have to keep glued together.

## Where things stood

At the time of writing we were heads-down on the build: content, design, and the first round of SEO work before flipping the site live. See the update note at the top of this post for how the actual build turned out.
