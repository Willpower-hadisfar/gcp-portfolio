---
title: "Agent Plugins: Bundling Behaviour, Not Just Access"
date: 2026-08-07
description: "MCP solved what tools an agent can access — Agent Plugins solve how it should use them, bundling skills, tools, rules, and hooks behind progressive disclosure instead of an ever-growing system prompt."
tags: ["agentic-ai", "google-adk", "mcp", "agent-plugins"]
readingTime: "3 min"
draft: false
---

If you've used an AI coding agent for more than a week, you've probably noticed a recurring problem: you're constantly repeating the same instructions.

"Use our architecture pattern."
"Run tests this way."
"Here's how we handle errors."

Most teams work around this with files like CLAUDE.md, AGENTS.md, system prompts, or a collection of scripts. They all solve part of the problem, but they're tied to specific tools and aren't easily reusable.

## The problem

MCP solved one side of the equation: what an agent can access. It gives an agent access to databases, APIs, ticketing systems, and other external tools. In other words, it answers the question:

*What tools does the agent have?*

What it doesn't answer is:

*How should the agent use them?*

That's where Agent Plugins (Google's term in the ADK ecosystem) come in. Rather than exposing new capabilities, they package the knowledge required to use those capabilities effectively. A plugin bundles Skills, Tools, Rules, and Hooks into a reusable component that teaches an agent how to operate within a particular domain, instead of relying on a growing list of prompts and instructions.

## How it works

One of the more interesting ideas is progressive disclosure.

Instead of loading every piece of organisational knowledge into the model upfront, the agent only keeps a catalogue of available skills in context — typically just a name and a short description. When a task requires one of those skills, the agent loads the detailed instructions on demand.

Without this approach, installing every skill your organisation has simply turns into an enormous system prompt that is slower, more expensive, and less effective. Progressive disclosure is a much more natural model. The agent retrieves the information it needs when it needs it, much like an engineer navigating a codebase rather than trying to memorise every document before writing a line of code.

What's particularly interesting is that several independent projects have converged on almost the same pattern. GitHub Spec Kit's Extensions, Claude Code's Skills, and Amazon Kiro's steering files and hooks all package behaviour into reusable components that can be discovered and installed independently. Different implementations, but remarkably similar ideas.

## Is it easy to use?

Mechanically, yes.

Installing a plugin is usually a single command through a marketplace or extension manager. There's no copying markdown files between repositories or manually editing configuration files.

The harder question isn't how to install a plugin — it's which plugins are worth trusting and adopting.

## Two challenges to watch

**Fragmentation.** Every vendor currently defines its own plugin format. While the underlying concepts are similar, they're not interoperable. A truly portable plugin ecosystem remains aspirational until the industry agrees on common standards in the same way it has begun to converge around MCP for tool access.

**Trust.** Most plugin marketplaces include some variation of the same disclaimer: plugin authors are responsible for their own code, and submissions are not necessarily reviewed or endorsed.

This creates a familiar supply-chain problem. Much like npm or pip packages, plugins require careful evaluation before they're installed. The difference is that an agent plugin often has access to powerful tools — or even permission to modify code and infrastructure — making the potential impact of a malicious or poorly written plugin significantly greater.

At the moment, the ecosystem is producing plugins faster than it is producing mature ways to assess whether those plugins are safe to use.
