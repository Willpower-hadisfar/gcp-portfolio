---
title: "Lessons Learned Deploying a RAG API to Google Cloud Run"
date: 2026-08-17
description: "Eight concrete gotchas from shipping a FastAPI + LlamaIndex + Qdrant RAG backend to Cloud Run — shared embedding dependencies, default service-account permissions, and why Cloud Run is private by default."
tags: ["rag", "google-cloud-run", "llamaindex", "deployment"]
readingTime: "3 min"
draft: false
relatedProject: "enterprise-rag-assistant"
---

Gotchas from building and deploying a FastAPI + LlamaIndex + Qdrant RAG backend to Google Cloud Run, integrated with a static frontend.

1. **Ingestion vs. execution share a dependency, not just a data contract.** The query engine (`app/engine.py`) only reads from Qdrant, but it still has to embed the incoming prompt with the same model the ingestion script (`ingest.py`) used to build the index. Skip `llama-index-embeddings-openai` / `llama-index-llms-openai` in the runtime environment and LlamaIndex fails silently on startup — surfaces later as a generic 500.

2. **Don't fight the host runtime.** Developing on a host with a bleeding-edge/unsupported Python (e.g. pre-release 3.14 on Fedora) breaks C-extension deps like pandas/pydantic. Rather than patching headers, isolate ingestion in a pinned container:

   ```bash
   docker run -it --rm -v "$(pwd)":/app -w /app \
     -e QDRANT_URL=… -e QDRANT_API_KEY=… -e OPENAI_API_KEY=… \
     python:3.11-slim sh -c "pip install -r requirements.txt llama-index-readers-file llama-index-embeddings-openai && python ingest.py"
   ```

3. **New GCP projects cripple the default service account by design.** `gcloud run deploy --source .` fails at the build step on fresh projects until the default compute SA (`{PROJECT_NUMBER}-compute@developer.gserviceaccount.com`) has `roles/cloudbuild.builds.builder` and `roles/storage.objectViewer` bound explicitly.

4. **Keep the raw corpus out of the deployed service.** `SimpleDirectoryReader("data", recursive=True)` belongs to the ingestion phase only. Production reads exclusively via the Qdrant connection string — the `data/` folder never ships in the container image.

5. **Cloud Run is private by default.** A 403 from curl is Google's IAM layer, not your app. Fix with `roles/run.invoker` for `allUsers`, and pass `--allow-unauthenticated` in CI/CD every deploy — otherwise it silently reverts. If org policy blocks `allUsers` (`constraints/iam.allowedPolicyMemberDomains`), you have to enable unauthenticated invocations manually in the console.

6. **Diagnose by error shape, not just status code.**

   | Error | Body | Meaning |
   |---|---|---|
   | 403 | HTML | Cloud Run IAM blocked it before your container ran |
   | 404 | `{"detail": "Not Found"}` | Reached FastAPI, route doesn't exist — check `/docs` |
   | 500 | `{"detail": "…"}` | Reached your code, uncaught exception (missing key, DB failure) |

7. **Qdrant client hangs on Cloud Run without explicit config.** The client's automatic version-compatibility check can time out in serverless environments:

   ```python
   client = QdrantClient(
       url=qdrant_url,
       api_key=qdrant_api_key,
       check_compatibility=False,
       timeout=10.0,
   )
   ```

   Also assert required env vars (`OPENAI_API_KEY`, `QDRANT_URL`, `QDRANT_API_KEY`) at startup so failures name the missing variable in logs instead of surfacing as a generic pipeline error.

8. **Test in this order:** `/docs` (routing/schema) → curl (raw HTTP) → frontend integration (hostname mismatches are a frequent last-mile bug).
