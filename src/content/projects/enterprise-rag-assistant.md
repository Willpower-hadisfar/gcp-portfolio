---
order: 4
title: "Enterprise RAG Assistant"
subtitle: "Multimodal document Q&A with citations"
category: "AI"
summary: "A document Q&A assistant with citation-backed retrieval."
tech: ["Qdrant", "LlamaIndex", "OpenAI API", "FastAPI", "Python"]
---
### System Architecture
A Morphik-style multimodal document Q&A assistant built to deliver high-fidelity information retrieval backed by verifiable source citations. 

### Production Implementation
- **Ingestion & Retrieval:** Orchestrated via LlamaIndex to process complex layout semantics across corporate documentation.
- **Vector Storage:** Powering low-latency semantic lookup using Qdrant vector spaces.
- **Dynamic Optimization:** Fully containerized backend using FastAPI to expose retrieval streams.

> **Live Demo Notice:** The interactive RAG widget embedded below runs against a fixed, pre-ingested, and curated demo corpus. It enforces strict application-level rate limits and compute budget caps to preserve operational safety.