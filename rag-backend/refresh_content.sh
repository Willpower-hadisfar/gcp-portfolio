#!/bin/bash
# 🚀 One-click script to sync local data/ markdown files to Qdrant Cloud

echo "🔄 Initializing secure content sync to Qdrant..."

#!/usr/bin/env bash
set -e

echo "Refreshing RAG index using .env config..."

docker run --rm \
  --env-file .env \
  -v "$(pwd)/data:/app/data" \
  rag-backend:latest python ingest.py

  
echo "✨ Sync complete! The live Cloud Run backend will immediately serve the updated text."
