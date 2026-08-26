---
title: "Axon Framework Supported Patterns"
date: 2024-07-29
description: "The difference between the Saga pattern and Unit of Work in Axon Framework — coordinating distributed transactions across services versus consistency within a single bounded context."
tags: ["axon-framework", "event-sourcing", "cqrs"]
readingTime: "2 min"
draft: false
---

In Axon Framework, the Saga pattern and Unit of Work (UoW) serve different purposes and have distinct characteristics.

## Saga Pattern

- Used to manage transactions and maintain data consistency in distributed systems, especially where a single business transaction needs to span multiple microservices or bounded contexts.
- A Saga coordinates a series of local transactions within participating services and ensures the overall business transaction either completes successfully or is compensated in case of failures.
- Sagas help overcome the limitations of distributed transactions by implementing a sequence of local transactions, resulting in a more scalable and resilient system.

## Unit of Work (UoW)

- A design pattern that manages database operations and maintains consistency of the domain model within a single transaction.
- In Axon Framework, UoW groups multiple operations together and executes them as a single transaction within a single bounded context or aggregate.
- UoW ensures that all operations within the transaction either succeed or fail as a whole, preserving data integrity and keeping system state consistent.

**In short**: both patterns deal with transactions, but Sagas manage distributed transactions across multiple bounded contexts or services, while UoW focuses on maintaining consistency within a single bounded context or aggregate.
