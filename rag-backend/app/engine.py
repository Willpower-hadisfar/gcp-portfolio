# app/engine.py
import os
from qdrant_client import QdrantClient
from llama_index.core import VectorStoreIndex
from llama_index.vector_stores.qdrant import QdrantVectorStore
from llama_index.llms.openai import OpenAI

class RAGEngine:
    def __init__(self):
        self._query_engine = None

    def _get_engine(self):
        if self._query_engine is None:
            qdrant_url = os.getenv("QDRANT_URL")
            qdrant_api_key = os.getenv("QDRANT_API_KEY")
            openai_api_key = os.getenv("OPENAI_API_KEY")

            missing_vars = []
            if not qdrant_url: missing_vars.append("QDRANT_URL")
            if not qdrant_api_key: missing_vars.append("QDRANT_API_KEY")
            if not openai_api_key: missing_vars.append("OPENAI_API_KEY")

            if missing_vars:
                raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")

            client = QdrantClient(
                url=qdrant_url, 
                api_key=qdrant_api_key,
                check_compatibility=False,
                timeout=10.0
            )
            
            vector_store = QdrantVectorStore(client=client, collection_name="portfolio-corpus")
            llm = OpenAI(model="gpt-4o-mini", temperature=0.1, api_key=openai_api_key)

            index = VectorStoreIndex.from_vector_store(vector_store=vector_store, llm=llm)
            self._query_engine = index.as_query_engine(similarity_top_k=3)
        return self._query_engine

    def query(self, prompt: str) -> str:
        engine = self._get_engine()
        response = engine.query(prompt)
        return str(response)

# LAZY INSTANCE: Singleton created only when needed, not on module import
_engine_instance = None

def get_rag_engine() -> RAGEngine:
    global _engine_instance
    if _engine_instance is None:
        _engine_instance = RAGEngine()
    return _engine_instance