---
order: 6
title: "Broker Connect"
subtitle: "Event-Driven Integration Broker"
category: "Architecture"
summary: "Broker for trading."
tech: ["Java", "Spring Boot", "Docker", "Kubernetes"]
---
### Architecture Pattern & Discovery
This system demonstrates event modeling as a rigorous discovery and scoping discipline, rather than a passive diagramming exercise. It maps a seamless pipeline from **board ➔ spec ➔ code**.

### Core Architecture
- **Domain Scope:** Event-modeled system spanning Authority Administration ➔ Submission Intake ➔ Underwriting Decisioning ➔ Binding ➔ Bordereaux Settlement ➔ Claims.
- **Data Normalization:** Incoming broker submissions are normalized strictly to the ACORD ADEPT standard right at intake.
- **State & Ledger:** Binding is modeled as an immutable ledger; policies are split via quota share across capacity providers.
- **Scope Discipline:** Pricing and actuarial modules were strictly kept out of scope. Exploratory sub-contexts were marked distinctly on the event modeling board to isolate them from confirmed tracks.
- **Automation:** Specifications are generated programmatically directly from the event modeling board export.