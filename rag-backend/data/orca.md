---
title: "Orca"
subtitle: "Worktree-per-task agent orchestration"
category: "AI"
order: 3
tech: ["Orca", "Git Worktrees", "Claude Agent SDK", "Gemini CLI", "Antigravity CLI"]
---
### Overview
A GUI-driven orchestration layer that drives whatever coding-agent CLI is already installed (Gemini CLI, Antigravity CLI) through a worktree-per-task workflow: each unit of work gets its own git branch and worktree, runs independently, and is merged through an in-app diff review loop rather than a single long-lived session.

### How it's used
- **Parallel slices:** Work is decomposed into file-disjoint slices up front, so multiple worktrees can run concurrently without merge conflicts — the same principle behind a hand-rolled Docker/claim-queue worker pool, but packaged with a GUI diff-review gate instead of automated test-gating.
- **Human-in-the-loop merge gate:** Every slice is reviewed as an actual diff before merging, not trusted on the agent's self-reported summary.
- **Sandboxing discipline:** Default agent launch flags (e.g. `--yolo`-style auto-approval) are explicitly disabled before first use, since an unconstrained worktree does nothing on its own to limit shell or network access.
- **Proven on real repos:** Used as the build vehicle for the Minor Working-Hour Auditor hackathon entry (two parallel worktrees — compliance logic and UI/integration — built against a locked contract and merged independently) and evaluated as the eventual driver for AgentOS's multi-agent phase.
